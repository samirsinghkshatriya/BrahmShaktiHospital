import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import { isMongoConnected } from '../config/db.js';
import { patientsData } from '../data/seedData.js';

let inMemoryPatients = [...patientsData];

const pad4 = (n) => String(n).padStart(4, '0');

async function makeUHID() {
  const year = new Date().getFullYear();
  if (isMongoConnected) {
    for (let i = 0; i < 5; i += 1) {
      const count = await Patient.estimatedDocumentCount();
      const candidate = `BSH-UHID-${year}-${pad4(count + 1 + i)}`;
      // eslint-disable-next-line no-await-in-loop
      const exists = await Patient.findOne({ uhid: candidate });
      if (!exists) return candidate;
    }
    return `BSH-UHID-${year}-${Date.now().toString().slice(-6)}`;
  }
  return `BSH-UHID-${year}-${Date.now().toString().slice(-6)}`;
}

export const getPatients = async (req, res) => {
  try {
    const { search = '', bloodGroup, status } = req.query;

    if (isMongoConnected) {
      const filter = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { patientId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }
      if (bloodGroup) filter.bloodGroup = bloodGroup;
      if (status) filter.status = status;

      const patients = await Patient.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: patients.length, data: patients });
    }

    let filtered = [...inMemoryPatients];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q) || p.phone.includes(q)
      );
    }
    if (bloodGroup) filtered = filtered.filter(p => p.bloodGroup === bloodGroup);
    if (status) filtered = filtered.filter(p => p.status === status);

    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const patient = await Patient.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { patientId: id }] });
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.status(200).json({ success: true, data: patient });
    }

    const patient = inMemoryPatients.find(p => p.patientId === id || p._id === id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    return res.status(200).json({ success: true, data: patient });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, email, bloodGroup, address, emergencyContact } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Patient name and phone are required.' });
    }

    const patientId = `BSH-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const newPatientData = {
      patientId,
      name,
      age: Number(age) || 30,
      gender: gender || 'Male',
      phone,
      email: email || '',
      bloodGroup: bloodGroup || 'Unknown',
      address: address || '',
      emergencyContact: emergencyContact || { name: '', relationship: '', phone: '' },
      medicalHistory: [],
      admissions: [],
      status: 'Active'
    };

    if (isMongoConnected) {
      const patient = await Patient.create(newPatientData);
      return res.status(201).json({ success: true, message: 'Patient registered successfully', data: patient });
    }

    inMemoryPatients.unshift({ ...newPatientData, _id: `pat-${Date.now()}` });
    return res.status(201).json({ success: true, message: 'Patient registered successfully', data: inMemoryPatients[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const updated = await Patient.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { patientId: id }] },
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.status(200).json({ success: true, message: 'Patient updated', data: updated });
    }

    const index = inMemoryPatients.findIndex(p => p.patientId === id || p._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Patient not found' });
    inMemoryPatients[index] = { ...inMemoryPatients[index], ...req.body };
    return res.status(200).json({ success: true, message: 'Patient updated', data: inMemoryPatients[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public self-registration during the booking flow -> issues a unique UHID
export const registerPatientPublic = async (req, res) => {
  try {
    const { name, age, gender, phone, email, bloodGroup, address } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }

    const uhid = await makeUHID();
    const data = {
      patientId: uhid,
      uhid,
      name,
      age: Number(age) || 30,
      gender: gender || 'Male',
      phone,
      email: email || '',
      bloodGroup: bloodGroup || 'Unknown',
      address: address || '',
      status: 'Active'
    };

    if (isMongoConnected) {
      const patient = await Patient.create(data);
      return res.status(201).json({
        success: true,
        message: 'Patient registered. Your UHID has been generated.',
        data: { uhid: patient.uhid, patientId: patient.patientId, name: patient.name, phone: patient.phone }
      });
    }

    const created = { ...data, _id: `pat-${Date.now()}`, medicalHistory: [], admissions: [] };
    inMemoryPatients.unshift(created);
    return res.status(201).json({
      success: true,
      message: 'Patient registered. Your UHID has been generated.',
      data: { uhid, patientId: uhid, name, phone }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Secure retrieval of a registered profile using mobile + UHID
export const verifyPatient = async (req, res) => {
  try {
    const { phone, uhid } = req.body;
    if (!phone || !uhid) {
      return res.status(400).json({ success: false, message: 'Registered mobile number and UHID are required.' });
    }

    let patient = null;
    if (isMongoConnected) {
      patient = await Patient.findOne({ $and: [{ phone }, { $or: [{ uhid }, { patientId: uhid }] }] });
    } else {
      patient = inMemoryPatients.find((p) => p.phone === phone && (p.uhid === uhid || p.patientId === uhid));
    }

    if (!patient) {
      return res.status(404).json({ success: false, message: 'No patient matched the provided mobile number and UHID.' });
    }

    // Return a minimal, safe profile — no sensitive medical history here.
    const safeProfile = {
      uhid: patient.uhid || patient.patientId,
      patientId: patient.patientId,
      name: patient.name,
      phone: patient.phone,
      email: patient.email || '',
      age: patient.age,
      gender: patient.gender
    };

    let appointmentCount = 0;
    if (isMongoConnected) {
      appointmentCount = await Appointment.countDocuments({ uhid: patient.uhid || patient.patientId });
    } else {
      appointmentCount = inMemoryAppointmentsCountForUHID(patient.patientId);
    }

    return res.status(200).json({ success: true, verified: true, data: safeProfile, appointmentCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

function inMemoryAppointmentsCountForUHID() {
  return 0;
}
