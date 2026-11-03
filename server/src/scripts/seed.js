import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User.js';
import Department from '../models/Department.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import AppointmentSlot from '../models/AppointmentSlot.js';
import BloodInventory from '../models/BloodInventory.js';
import BloodRequest from '../models/BloodRequest.js';
import BloodDonation from '../models/BloodDonation.js';
import BloodInventoryTransaction from '../models/BloodInventoryTransaction.js';
import PharmacyProduct from '../models/PharmacyProduct.js';
import Billing from '../models/Billing.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import { News } from '../models/News.js';
import LabReport from '../models/LabReport.js';

import {
  usersData,
  departmentsData,
  doctorsData,
  patientsData,
  appointmentsData,
  bloodInventoryData,
  bloodRequestsData,
  bloodDonationsData,
  pharmacyProductsData,
  billingsData,
  purchaseOrdersData,
  newsArticlesData,
  labReportsData
} from '../data/seedData.js';

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brahm_shakti_hospital';
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('[Seed] Connected successfully.');

    // Clear existing records
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      Appointment.deleteMany({}),
      AppointmentSlot.deleteMany({}),
      BloodInventory.deleteMany({}),
      BloodRequest.deleteMany({}),
      BloodDonation.deleteMany({}),
      BloodInventoryTransaction.deleteMany({}),
      PharmacyProduct.deleteMany({}),
      Billing.deleteMany({}),
      PurchaseOrder.deleteMany({}),
      News.deleteMany({}),
      LabReport.deleteMany({})
    ]);
    console.log('[Seed] Old collections cleared.');

    // Insert users using User.create to trigger password hash pre-save hook
    for (const u of usersData) {
      await User.create(u);
    }
    console.log(`[Seed] Created ${usersData.length} users with hashed credentials.`);

    // Insert other collections
    await Department.insertMany(departmentsData);
    await Doctor.insertMany(doctorsData);
    await Patient.insertMany(patientsData.map((p) => ({ ...p, uhid: p.uhid || p.patientId })));
    await Appointment.insertMany(appointmentsData);
    await BloodInventory.insertMany(bloodInventoryData);
    await BloodRequest.insertMany(bloodRequestsData);
    await BloodDonation.insertMany(bloodDonationsData);
    await PharmacyProduct.insertMany(pharmacyProductsData);
    await Billing.insertMany(billingsData);
    await PurchaseOrder.insertMany(purchaseOrdersData);
    await News.insertMany(newsArticlesData);
    await LabReport.insertMany(labReportsData);

    console.log('====================================================');
    console.log('  BRAHM SHAKTI HOSPITAL DATABASE SEEDING COMPLETED  ');
    console.log('====================================================');
    console.log(`✓ Departments:      ${departmentsData.length}`);
    console.log(`✓ Doctors:          ${doctorsData.length}`);
    console.log(`✓ Patients:         ${patientsData.length}`);
    console.log(`✓ Appointments:     ${appointmentsData.length}`);
    console.log(`✓ Blood Inventory:  ${bloodInventoryData.length}`);
    console.log(`✓ Blood Requests:   ${bloodRequestsData.length}`);
    console.log(`✓ Blood Donations:  ${bloodDonationsData.length}`);
    console.log(`✓ Pharmacy Drugs:   ${pharmacyProductsData.length}`);
    console.log(`✓ Invoices/Bills:   ${billingsData.length}`);
    console.log(`✓ Purchase Orders:  ${purchaseOrdersData.length}`);
    console.log(`✓ Lab Reports:      ${labReportsData.length}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDatabase();
