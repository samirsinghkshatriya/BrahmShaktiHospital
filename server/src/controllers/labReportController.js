import LabReport from '../models/LabReport.js';
import Patient from '../models/Patient.js';
import { isMongoConnected } from '../config/db.js';
import { patientsData, labReportsData } from '../data/seedData.js';

// Compare only the last 10 digits so "+91-9873456780", "9873456780"
// and "09873456780" all resolve to the same registered mobile number.
const samePhone = (a = '', b = '') => {
  const digits = (s) => String(s).replace(/\D/g, '').slice(-10);
  return digits(a) && digits(a) === digits(b);
};

// Find the registered patient for a (UHID + mobile) pair. UHID is stored as
// `uhid` on Mongo records and defaults to `patientId` in seed/in-memory data.
const findPatient = async (uhid, phone) => {
  if (isMongoConnected) {
    const patient = await Patient.findOne({
      $or: [{ uhid }, { patientId: uhid }]
    });
    if (patient && samePhone(patient.phone, phone)) return patient;
    return null;
  }
  const patient = patientsData.find((p) => p.patientId === uhid || p.uhid === uhid);
  if (patient && samePhone(patient.phone, phone)) return patient;
  return null;
};

// GET /api/lab-reports?uhid=BSH-2026-001&phone=9873456780
// Public retrieval is only allowed after the UHID + registered mobile match.
export const getPatientLabReports = async (req, res, next) => {
  try {
    const uhid = String(req.query.uhid || '').trim().toUpperCase();
    const phone = String(req.query.phone || '').trim();

    if (!uhid || !phone) {
      return res.status(400).json({ success: false, message: 'UHID and registered mobile number are required.' });
    }

    const patient = await findPatient(uhid, phone);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'No hospital record found for this UHID and mobile number combination.'
      });
    }

    const patientUhid = patient.uhid || patient.patientId;

    if (isMongoConnected) {
      const reports = await LabReport.find({ uhid: patientUhid }).sort({ orderedDate: -1 });
      return res.status(200).json({
        success: true,
        source: 'mongodb',
        patient: {
          uhid: patientUhid,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup
        },
        count: reports.length,
        data: reports
      });
    }

    const reports = labReportsData
      .filter((r) => r.uhid === patientUhid)
      .sort((a, b) => (a.orderedDate < b.orderedDate ? 1 : -1));
    return res.status(200).json({
      success: true,
      source: 'in-memory',
      patient: {
        uhid: patientUhid,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup
      },
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/lab-reports/:reportId?uhid=...&phone=...
// Full parameter-level report body, same verification required.
export const getLabReportById = async (req, res, next) => {
  try {
    const patient = await findPatient(
      String(req.query.uhid || '').trim().toUpperCase(),
      String(req.query.phone || '').trim()
    );
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Verification failed. Report not accessible.' });
    }

    const patientUhid = patient.uhid || patient.patientId;
    const { reportId } = req.params;

    if (isMongoConnected) {
      const report = await LabReport.findOne({ reportId, uhid: patientUhid });
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found for this patient.' });
      }
      return res.status(200).json({ success: true, source: 'mongodb', data: report });
    }

    const report = labReportsData.find((r) => r.reportId === reportId && r.uhid === patientUhid);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found for this patient.' });
    }
    return res.status(200).json({ success: true, source: 'in-memory', data: report });
  } catch (error) {
    next(error);
  }
};
