import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Attempt DB connection (non-blocking fallback to mock store if offline)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  Brahm Shakti Hospital - API Server Active    `);
    console.log(`  Local URL: http://localhost:${PORT}          `);
    console.log(`  Health:    http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
};

startServer();
