import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import bloodBankRoutes from './routes/bloodBankRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { isMongoConnected } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health & System Info
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    institution: 'Brahm Shakti Hospital, Pocket C, Budh Vihar Phase I, New Delhi',
    service: 'Brahm Shakti Hospital MERN Digital Healthcare Architecture',
    database: isMongoConnected ? 'MongoDB Atlas Connected' : 'In-Memory High-Speed Store',
    timestamp: new Date().toISOString()
  });
});

// Primary RESTful API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blood-bank', bloodBankRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Serve static client production build if available
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Fallback & Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
