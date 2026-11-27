# SmartDeal – Render PostgreSQL Cloud Deployment Guide

This guide details the exact steps for deploying SmartDeal with a dedicated, managed PostgreSQL database on **Render**.

---

## 1. Create a Managed PostgreSQL Database on Render

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top navigation bar and select **PostgreSQL**.
3. Configure the database details:
   - **Name:** `smartdeal-db`
   - **Database Name:** `smartdeal`
   - **User:** `smartdeal_user`
   - **Region:** Choose the region closest to your users (e.g., `Singapore` or `Frankfurt`).
   - **PostgreSQL Version:** 16, 17, or 18.
   - **Plan:** Free or Starter.
4. Click **Create Database**.
5. Once provisioned, locate the **Connections** section:
   - If your Web Service is also hosted on Render, copy the **Internal Database URL**:
     `postgresql://smartdeal_user:PASSWORD@dpg-xxxx-a.render.com/smartdeal`
   - If connecting from outside Render, copy the **External Database URL**:
     `postgresql://smartdeal_user:PASSWORD@dpg-xxxx-a.oregon-postgres.render.com/smartdeal?sslmode=require`

---

## 2. Configure Your Web Service Environment Variables

In your Render Web Service dashboard, go to **Environment** -> **Add Environment Variable** and configure:

| Environment Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `PORT` | `10000` | Render default web service port |
| `DATABASE_URL` | `postgresql://smartdeal_user:...@dpg-...render.com/smartdeal?sslmode=require` | Render PostgreSQL Connection URL |
| `PGSSL` | `true` | Enforces SSL for cloud database connection |
| `JWT_SECRET` | *(64-char random hex string)* | Secret for administrative tokens |
| `SESSION_EXPIRY_DAYS`| `30` | Persistent SQL session duration |
| `EMAIL_PROVIDER` | `RESEND` or `GMAIL_SMTP` | Email delivery service |
| `OWNER_EMAIL` | `jk7217514087@gmail.com` | Primary admin alerts email |
| `OWNER_PHONE` | `7217514087` | Primary admin SMS phone |

---

## 3. Render Build & Start Commands

Configure your Render Web Service settings:

- **Build Command:**
  ```bash
  npm install && npm run build
  ```

- **Start Command:**
  ```bash
  node server/db/migrate.mjs && node server/server.mjs
  ```

> [!NOTE]
> `node server/db/migrate.mjs` automatically verifies all 35 tables, creates foreign key constraints, indexes, and idempotently seeds baseline data without dropping existing data.

---

## 4. Automatic SSL Detection Architecture

SmartDeal's PostgreSQL connection manager (`server/db/connection.mjs`) automatically detects:
- When running locally (`127.0.0.1` or `localhost`): SSL is disabled for fast local development.
- When running in cloud (Render / Supabase / Neon): SSL is automatically enabled with `rejectUnauthorized: false` to allow self-signed cloud certificates.

---

## 5. Database Health Check Endpoint

To verify that your Render backend is connected to the real PostgreSQL database:

```bash
curl -i https://your-smartdeal-app.onrender.com/api/admin/database/health
```

Expected response:
```json
{
  "status": "HEALTHY",
  "mode": "POSTGRESQL_PRODUCTION_POOLED",
  "engine": "PostgreSQL 18 (Pure Relational Architecture)",
  "connection": {
    "connected": true,
    "database": "smartdeal",
    "ssl": true,
    "activeConnections": 1
  }
}
```

---

## 6. Backup & Restore Procedures

### Running an Automated Backup
```bash
node scripts/backup_postgres.mjs
```
- Creates timestamped SQL dumps (`backups/SMARTDEAL-PG-BACKUP-.../*.sql`)
- Creates table JSON snapshots (`*.json`)
- Generates SHA-256 cryptographic checksums for data integrity
- Enforces an automated 30-day retention policy

### Restoring from Backup
```bash
node scripts/restore_postgres.mjs [BATCH_ID]
```
If no `BATCH_ID` is provided, the latest verified backup batch is automatically restored within an ACID database transaction.
