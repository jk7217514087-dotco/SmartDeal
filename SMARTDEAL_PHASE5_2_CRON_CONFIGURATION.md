# SMARTDEAL — PHASE 5.2: RENDER NATIVE CRON JOB ARCHITECTURE & DEPLOYMENT GUIDE

**Document ID:** `SMARTDEAL-PHASE5-2-CRON-CONFIGURATION`  
**Generated:** 2026-11-28  
**Target Repository:** `jk7217514087-dotco/SmartDeal`  
**Target Platform:** Render Native Cron Jobs (In-VPC)  
**Security Classification:** RESTRICTED — OPERATIONAL INFRASTRUCTURE  

---

## 1. Executive Summary

During Phase 5.1, security audits established that executing database backups from GitHub Actions runners (`.github/workflows/daily_backup.yml`) is fundamentally blocked by Render's Oregon VPC network security. External runners cannot route to RFC 1918 private database hostnames, and exposing port 5432 to external internet IP pools is unacceptable for production.

This document details the deployment architecture for a **Render Native In-VPC Cron Job**. Running directly inside the Render Oregon private network enables zero-exposure database access, sub-millisecond local network throughput for database dumps, authenticated AES-256-GCM encryption, remote offsite shipping to Cloudflare R2, and clean container lifecycle termination.

---

## 2. In-VPC Cron Architecture vs. External Runners

```mermaid
flowchart TD
    subgraph GitHub_External["External GitHub Actions (INSECURE / BLOCKED)"]
        GHA["GitHub Actions Runner<br/>(Dynamic Azure/AWS IPs)"]
        FW["Render Oregon Firewall<br/>(Port 5432 Blocked)"]
        GHA -.->|Blocked / Connection Refused| FW
    end

    subgraph Render_Oregon_VPC["Render Oregon VPC (SECURE / IN-VPC)"]
        DB["Render Managed PostgreSQL<br/><code>dpg-cuid6j5ds78s73ba85ig-a</code><br/>(Internal Private Network)"]
        Cron["Render Native Cron Job<br/><code>smartdeal-backup-cron</code><br/>Schedule: 0 2 * * *"]
        
        Cron -->|Direct In-VPC pg_dump<br/>(statement_timeout = 0)| DB
    end

    subgraph Offsite_Cloud["Offsite Failure Domain"]
        R2["Cloudflare R2 Object Storage<br/><code>smartdeal-production-backups</code>"]
        HC["Monitoring / Dead Man's Snitch<br/>(26-Hour Alert Trigger)"]
    end

    Cron -->|1. AES-256-GCM Encrypted PUT| R2
    Cron -->|2. SigV4 HEAD Existence Check| R2
    Cron -->|3. SigV4 GET Roundtrip Verify| R2
    Cron -->|4. Dispatch Heartbeat Ping| HC
```

---

## 3. Render Native Cron Job Specification

| Parameter | Recommended Production Value | Justification |
| :--- | :--- | :--- |
| **Service Name** | `smartdeal-backup-cron` | Distinct identifier in Render dashboard |
| **Environment / Runtime** | `Node` (Node.js 20+) | Native ECMAScript modules runtime (`.mjs`) |
| **Repository** | `https://github.com/jk7217514087-dotco/SmartDeal` | Verified production repository |
| **Branch** | `master` | Production release branch |
| **Region** | **`Oregon (US West)`** | **Critical**: Must match database region to utilize internal VPC networking |
| **Schedule** | `0 2 * * *` | 02:00 AM UTC daily (Off-peak low traffic window) |
| **Command** | `node scripts/automated_backup_manager.mjs` | Executes dump, encryption, R2 sync, and verification |
| **Plan / Instance Type** | **Starter** ($1.00 / month) | Minimal cost; prorated by second of execution |

---

## 4. Ephemeral Disk & Storage Lifecycle Rules

> [!WARNING]
> **Ephemeral Storage Constraint**: Render Cron Jobs run in temporary containers with **no persistent disk attachment**. When a cron job completes and exits, its container and filesystem are immediately destroyed.

### Architectural Rules for Cron Durability:
1. **No Reliance on Local Disk**: Local storage in `backups/` is temporary and ephemeral. The backup runner must **never** treat local filesystem writes as successful archival.
2. **Mandatory Offsite Shipping**: Archival is only confirmed once the encrypted archive is successfully uploaded to Cloudflare R2 and confirmed via remote `HEAD` and `GET` verification.
3. **Automated Ephemeral Cleanup**: The backup engine automatically executes Step 7 (`fs.rmSync(targetDir, { recursive: true })`) upon successful upload and verification when `RENDER=true` or `EPHEMERAL_STORAGE=true`, ensuring zero disk saturation during the run.
4. **Failure Enforcement (`REQUIRE_OFFSITE=true`)**: If offsite credentials are missing or the upload fails, the script will strictly throw an error, dispatch a `FAILURE` notification, and exit with code `1`.

---

## 5. Required Environment Variables

Configure these secrets in the Render Cron Job Environment settings:

| Variable Name | Required | Example / Recommended Value | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **YES** | `postgresql://smartdeal:...@dpg-cuid6j5ds78s73ba85ig-a/smartdeal` | Internal Render database connection string |
| `BACKUP_ENCRYPTION_KEY` | **YES** | `<STRONG_64_CHAR_SECRET>` | Master secret for AES-256-GCM encryption |
| `R2_BUCKET` | **YES** | `smartdeal-production-backups` | Target Cloudflare R2 bucket name |
| `R2_ENDPOINT` | **YES** | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` | Cloudflare R2 S3-compatible API endpoint |
| `R2_ACCESS_KEY_ID` | **YES** | `<YOUR_32_CHAR_ACCESS_KEY_ID>` | Restricted Cloudflare R2 API token ID |
| `R2_SECRET_ACCESS_KEY` | **YES** | `<YOUR_64_CHAR_SECRET_ACCESS_KEY>` | Restricted Cloudflare R2 API secret key |
| `AWS_REGION` | **YES** | `auto` | Cloudflare R2 region |
| `REQUIRE_OFFSITE` | **YES** | `true` | Fails cron job if cloud sync fails |
| `RENDER` | **YES** | `true` | Enables ephemeral workspace cleanup |
| `BACKUP_NOTIFICATION_WEBHOOK` | Optional | `https://discord.com/api/webhooks/...` | Discord or Slack webhook URL for alerts |
| `HEARTBEAT_URL` | Optional | `https://hc-ping.com/<UUID>` | Healthchecks.io dead man's snitch ping URL |

---

## 6. Step-by-Step Render Dashboard Deployment Guide

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click the blue **New +** button in the top right corner and select **Cron Job**.
3. Connect your GitHub repository:
   - Select `jk7217514087-dotco/SmartDeal`.
   - Branch: `master`.
4. Configure Cron Job details:
   - **Name**: `smartdeal-backup-cron`
   - **Region**: Select **Oregon (US West)** (Matches PostgreSQL region).
   - **Schedule**: Enter `0 2 * * *` (Daily at 02:00 AM UTC).
   - **Command**: `node scripts/automated_backup_manager.mjs`
5. Select Plan:
   - Choose **Starter** ($1.00/month).
6. Configure Environment Variables:
   - Click **Add Environment Variable** for each of the variables listed in Section 5.
   - For `DATABASE_URL`, copy the **Internal Database URL** from `smartdeal-db`.
7. Click **Create Cron Job**.
8. **Manual Dry-Run Test**:
   - In the newly created Cron Job dashboard, click the **Trigger Run** button.
   - Inspect the live execution log.
   - Confirm the run logs:
     ```text
     🛡️ SMARTDEAL PHASE 5.2: PRODUCTION OFFSITE BACKUP & RESTORE ENGINE
     --- Step 1: Performing Full PostgreSQL Dump across 10 Enterprise Schemas ---
       ↳ Target: Configured PostgreSQL database (via DATABASE_URL)
     --- Step 2: Encrypting Archive with AES-256-GCM ---
     --- Step 3: Offsite Cloud Synchronization & Cryptographic Verification ---
       ✅ Successfully uploaded to Cloudflare R2 bucket: smartdeal-production-backups
       ✓ Remote Object Confirmed: Size ... bytes, ETag ...
       ✅ Remote Roundtrip Verification: 100% SHA-256 & AES-GCM MATCH
     --- Step 7: Ephemeral Workspace Cleanup ---
       ✓ Cleaned up ephemeral workspace directory
     VERDICT: BACKUP OPERATION SUCCESSFUL
     ```

---

## 7. Cost & Infrastructure Footprint Analysis

| Cost Component | Monthly Cost | Execution Details |
| :--- | :--- | :--- |
| **Base Cron Job Fee** | $1.00 / month | Retains container definition on Render Starter plan |
| **Compute Execution** | ~$0.01 / month | 15 seconds daily × 30 days = 7.5 minutes compute total ($0.000003/sec) |
| **Cloudflare R2 Storage** | $0.00 / month | 100 daily backups (~20 MB total) is well within R2's 10 GB free tier |
| **Cloudflare R2 Egress** | $0.00 / month | Cloudflare R2 features **zero egress fees** |
| **Total Added Monthly Cost** | **~$1.01 / month** | Complete offsite durability for approximately $1/month |

---
*Configuration guide certified for SmartDeal Production Infrastructure.*
