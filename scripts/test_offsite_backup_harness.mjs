// ==========================================================
// TEST SUITE: OFFSITE BACKUP PIPELINE & SIGV4 MOCK HARNESS
// Validates PUT, HEAD, GET roundtrip, SHA-256 & AES-GCM verification
// ==========================================================

import http from 'node:http';
import crypto from 'node:crypto';
import { uploadToOffsiteStorage, downloadFromOffsiteStorage, checkRemoteObjectExists, encryptBuffer, decryptPayload } from './automated_backup_manager.mjs';

async function runMockOffsiteHarness() {
  console.log('🧪 Starting Cloudflare R2 / AWS S3 SigV4 Mock Harness Test...');

  const mockStorage = new Map();
  const PORT = 9876;

  // Spin up an in-memory S3/R2 mock HTTP server
  const server = http.createServer((req, res) => {
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader.startsWith('AWS4-HMAC-SHA256')) {
      res.statusCode = 403;
      res.end('Unauthorized - Missing AWS4 signature');
      return;
    }

    const key = req.url; // e.g. /mock-bucket/test-file.enc.json

    if (req.method === 'PUT') {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        const body = Buffer.concat(chunks);
        const etag = crypto.createHash('md5').update(body).digest('hex');
        mockStorage.set(key, { data: body, etag, length: body.length });
        res.writeHead(200, { 'ETag': `"${etag}"`, 'Content-Length': '0' });
        res.end();
      });
    } else if (req.method === 'HEAD') {
      if (mockStorage.has(key)) {
        const item = mockStorage.get(key);
        res.writeHead(200, {
          'Content-Length': String(item.length),
          'ETag': `"${item.etag}"`,
          'Content-Type': 'application/json'
        });
        res.end();
      } else {
        res.statusCode = 404;
        res.end();
      }
    } else if (req.method === 'GET') {
      if (mockStorage.has(key)) {
        const item = mockStorage.get(key);
        res.writeHead(200, {
          'Content-Length': String(item.length),
          'ETag': `"${item.etag}"`,
          'Content-Type': 'application/json'
        });
        res.end(item.data);
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    } else {
      res.statusCode = 405;
      res.end();
    }
  });

  await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`  ✓ Mock S3/R2 Storage Server listening on 127.0.0.1:${PORT}`);

  // Configure environment for mock offsite endpoint
  process.env.R2_BUCKET = 'smartdeal-test-bucket';
  process.env.R2_ENDPOINT = `http://127.0.0.1:${PORT}`;
  process.env.R2_ACCESS_KEY_ID = 'test-access-key-id';
  process.env.R2_SECRET_ACCESS_KEY = 'test-secret-access-key';
  process.env.AWS_REGION = 'auto';

  try {
    // 1. Prepare sample payload
    const testPlaintext = Buffer.from('SELECT * FROM catalog.products; -- SmartDeal Enterprise Backup Test Payload');
    const expectedPlaintextHash = crypto.createHash('sha256').update(testPlaintext).digest('hex');
    const encrypted = encryptBuffer(testPlaintext);

    const testArchive = {
      batchId: 'TEST-BATCH-001',
      timestamp: new Date().toISOString(),
      algorithm: 'aes-256-gcm',
      sha256Plaintext: expectedPlaintextHash,
      byteSize: testPlaintext.length,
      payload: encrypted
    };

    const fileName = 'test-backup-001.enc.json';
    const uploadBuffer = Buffer.from(JSON.stringify(testArchive));

    // 2. Test Upload (PUT)
    console.log('  ↳ Test 1: Uploading encrypted archive to Mock R2 storage via SigV4...');
    const uploadResult = await uploadToOffsiteStorage(fileName, uploadBuffer);
    if (uploadResult.status !== 'UPLOADED') {
      throw new Error(`Upload failed: ${JSON.stringify(uploadResult)}`);
    }
    console.log(`  ✅ Upload verified: Status '${uploadResult.status}', Bucket '${uploadResult.bucket}'`);

    // 3. Test Existence Verification (HEAD)
    console.log('  ↳ Test 2: Verifying remote object existence via SigV4 HEAD request...');
    const headResult = await checkRemoteObjectExists(fileName);
    if (headResult.status !== 'EXISTS') {
      throw new Error(`HEAD check failed: ${JSON.stringify(headResult)}`);
    }
    console.log(`  ✅ Remote object existence verified: Size ${headResult.contentLength} bytes, ETag ${headResult.etag}`);

    // 4. Test Remote Download (GET)
    console.log('  ↳ Test 3: Downloading remote archive via SigV4 GET request...');
    const downloadResult = await downloadFromOffsiteStorage(fileName);
    if (downloadResult.status !== 'DOWNLOADED') {
      throw new Error(`Download failed: ${JSON.stringify(downloadResult)}`);
    }
    console.log(`  ✅ Download verified: Received ${downloadResult.buffer.length} bytes`);

    // 5. Test Cryptographic Verification
    console.log('  ↳ Test 4: Verifying SHA-256 and AES-256-GCM authentication...');
    const parsed = JSON.parse(downloadResult.buffer.toString('utf8'));
    const decrypted = decryptPayload(parsed.payload);
    const decryptedHash = crypto.createHash('sha256').update(decrypted).digest('hex');

    if (decryptedHash !== expectedPlaintextHash) {
      throw new Error(`SHA-256 Mismatch: ${decryptedHash} vs expected ${expectedPlaintextHash}`);
    }
    console.log(`  ✅ Decryption & SHA-256 Integrity Verified: 100% MATCH`);

    // 6. Test Non-existent object HEAD check
    console.log('  ↳ Test 5: Verifying 404 NOT_FOUND handling for non-existent key...');
    const missingHead = await checkRemoteObjectExists('non-existent-archive.enc.json');
    if (missingHead.status !== 'NOT_FOUND') {
      throw new Error(`Expected NOT_FOUND for missing file, got ${missingHead.status}`);
    }
    console.log(`  ✅ Non-existent object handling: Correctly returned 'NOT_FOUND'`);

    console.log('\n🎉 ALL OFFSITE BACKUP PIPELINE TESTS PASSED 100%!\n');
  } finally {
    // Reset env vars and close server
    delete process.env.R2_BUCKET;
    delete process.env.R2_ENDPOINT;
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
    server.close();
  }
}

runMockOffsiteHarness().catch(err => {
  console.error('Offsite Harness Failed:', err);
  process.exit(1);
});
