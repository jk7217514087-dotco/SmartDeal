// ==========================================================
// SMARTDEAL DATABASE RESTORE & INTEGRITY VERIFICATION UTILITY
// Restores database schemas and snapshots from verified backup batches
// ==========================================================

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BACKUP_DIR = path.resolve('backups');
const MANIFEST_FILE = path.join(BACKUP_DIR, 'backup_manifest.json');

const sha256File = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

export const restoreFromBackup = async (batchId) => {
  if (!fs.existsSync(MANIFEST_FILE)) {
    console.error('❌ No backup manifest found.');
    return { success: false, error: 'Manifest not found' };
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  const targetEntry = batchId
    ? manifest.find(b => b.batchId === batchId)
    : manifest[0]; // Most recent backup

  if (!targetEntry) {
    console.error(`❌ Backup batch "${batchId}" not found in manifest.`);
    return { success: false, error: 'Backup batch not found' };
  }

  console.log(`🔄 [SmartDeal Restore] Restoring from batch: ${targetEntry.batchId}...`);
  const folder = path.join(BACKUP_DIR, targetEntry.batchId);

  // 1. Verify Checksums
  for (const file of targetEntry.files) {
    const filePath = path.join(folder, file.fileName);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File missing in backup folder: ${file.fileName}`);
      return { success: false, error: `Missing file: ${file.fileName}` };
    }
    const currentChecksum = sha256File(filePath);
    if (currentChecksum !== file.checksumSha256) {
      console.error(`❌ Checksum mismatch for ${file.fileName}! Aborting restore.`);
      return { success: false, error: `Checksum corruption in ${file.fileName}` };
    }
    console.log(`   ✓ Integrity verified for ${file.fileName}`);
  }

  // 2. Restore JSON State
  const usersJsonPath = path.join(folder, 'smartdeal_users_data.json');
  if (fs.existsSync(usersJsonPath)) {
    fs.copyFileSync(usersJsonPath, path.resolve('server', 'users.json'));
    console.log('   ✓ Restored server/users.json');
  }

  const priceHistoryPath = path.join(folder, 'smartdeal_core_price_history.json');
  if (fs.existsSync(priceHistoryPath)) {
    fs.copyFileSync(priceHistoryPath, path.resolve('server', 'price_history.json'));
    console.log('   ✓ Restored server/price_history.json');
  }

  console.log('🎉 [SmartDeal Restore] Restore operation verified and completed successfully.');
  return { success: true, restoredBatch: targetEntry.batchId };
};

if (process.argv[1] && process.argv[1].endsWith('restore_databases.mjs')) {
  const targetBatch = process.argv[2];
  restoreFromBackup(targetBatch)
    .then(res => {
      if (res.success) process.exit(0);
      else process.exit(1);
    })
    .catch(() => process.exit(1));
}
