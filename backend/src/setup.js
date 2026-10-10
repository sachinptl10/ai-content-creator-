import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

if (process.env.VERCEL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sourceDb = path.join(__dirname, '../prisma/dev.db');
  const destDb = '/tmp/dev.db';
  
  // Override the database URL for Prisma
  process.env.DATABASE_URL = `file:${destDb}`;
  
  // Copy the database to the writable /tmp directory if it hasn't been copied yet
  if (!fs.existsSync(destDb) && fs.existsSync(sourceDb)) {
    console.log('Vercel Environment: Copying dev.db to /tmp/dev.db');
    fs.copyFileSync(sourceDb, destDb);
  }
}
