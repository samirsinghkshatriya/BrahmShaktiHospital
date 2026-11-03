import { Doctor } from '../models/Doctor.js';
import User from '../models/User.js';
import { doctorsData, usersData } from '../data/seedData.js';
import { isMongoConnected } from '../config/db.js';

let inMemoryDoctors = [...doctorsData];

// Initial doctor login password = birthdate formatted as DDMMYYYY
export const birthdateToInitialPassword = (birthdate) => {
  if (!birthdate) return null;
  const d = new Date(birthdate);
  if (Number.isNaN(d.getTime())) return null;
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${dd}${mm}${d.getUTCFullYear()}`;
};

export const getDoctors = async (req, res, next) => {
  try {
    const { department, search, specialty, availability, maxFee } = req.query;

    if (isMongoConnected) {
      let query = {};

      if (department && department !== 'all') {
        query.departmentId = department;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { designation: { $regex: search, $options: 'i' } },
          { departmentName: { $regex: search, $options: 'i' } },
          { specializations: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      if (specialty) {
        query.specializations = { $in: [new RegExp(specialty, 'i')] };
      }

      if (maxFee) {
        query.consultationFee = { $lte: Number(maxFee) };
      }

      const dbDoctors = await Doctor.find(query).sort({ experienceYears: -1 });
      if (dbDoctors && dbDoctors.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbDoctors.length,
          data: dbDoctors
        });
      }
    }

    // In-memory fallback
    let filtered = [...inMemoryDoctors];

    if (department && department !== 'all') {
      filtered = filtered.filter(
        (doc) => doc.departmentId.toLowerCase() === department.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.designation.toLowerCase().includes(q) ||
          doc.departmentName.toLowerCase().includes(q) ||
          (doc.specializations && doc.specializations.some((s) => s.toLowerCase().includes(q)))
      );
    }

    if (specialty) {
      const sLower = specialty.toLowerCase().trim();
      filtered = filtered.filter((doc) =>
        doc.specializations && doc.specializations.some((s) => s.toLowerCase().includes(sLower))
      );
    }

    if (maxFee) {
      filtered = filtered.filter((doc) => doc.consultationFee <= Number(maxFee));
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const doc = await Doctor.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
      if (doc) {
        return res.status(200).json({ success: true, data: doc });
      }
    }

    const doc = inMemoryDoctors.find((d) => d.id === id || d._id === id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const createDoctor = async (req, res, next) => {
  try {
    const { name, departmentId, departmentName, qualification, designation, experienceYears, consultationFee, availableDays, availableTimings, email, phone, birthdate } = req.body;
    if (!name || !departmentId) {
      return res.status(400).json({ success: false, message: 'Doctor name and department are required.' });
    }
    if (!email || !birthdate) {
      return res.status(400).json({
        success: false,
        message: 'Doctor email and birthdate are required to issue login credentials (initial password is the birthdate in DDMMYYYY format).'
      });
    }
    const initialPassword = birthdateToInitialPassword(birthdate);
    if (!initialPassword) {
      return res.status(400).json({ success: false, message: 'Invalid birthdate format. Use a valid date (YYYY-MM-DD).' });
    }

    const id = `doc-${departmentId.slice(0, 4)}-${Date.now().toString().slice(-4)}`;
    const newDoc = {
      id,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      birthdate,
      departmentId,
      departmentName: departmentName || departmentId,
      qualification: qualification || 'MBBS, MD',
      designation: designation || 'Consultant',
      experienceYears: Number(experienceYears) || 10,
      consultationFee: Number(consultationFee) || 800,
      availableDays: availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableTimings: availableTimings || '09:00 AM - 02:00 PM',
      opdSchedule: `${availableDays ? availableDays.join(', ') : 'Mon-Fri'}: ${availableTimings || '09:00 AM - 02:00 PM'}`,
      specializations: req.body.specializations || [designation || 'Specialist'],
      image: req.body.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      bio: req.body.bio || `Senior Specialist with Brahm Shakti Hospital.`,
      isActive: true,
      rating: 4.8
    };

    if (isMongoConnected) {
      const existingAccount = await User.findOne({ email: newDoc.email });
      if (existingAccount) {
        return res.status(409).json({ success: false, message: 'A login account with this doctor email already exists.' });
      }
      const doc = await Doctor.create(newDoc);
      // Admin-issued doctor portal account: password = DDMMYYYY of birthdate
      await User.create({
        name: newDoc.name,
        email: newDoc.email,
        password: initialPassword,
        role: 'doctor',
        doctorId: id,
        phone: newDoc.phone,
        status: 'active',
        mustChangePassword: true,
        avatar: newDoc.image
      });
      return res.status(201).json({
        success: true,
        message: 'Doctor added successfully. Share the login credentials below with the doctor.',
        data: doc,
        credentials: { email: newDoc.email, initialPassword, rule: 'Password is the doctor birthdate in DDMMYYYY format; doctor can change it after first login.' }
      });
    }

    // In-memory fallback (demo mode)
    inMemoryDoctors.unshift(newDoc);
    usersData.push({
      name: newDoc.name,
      email: newDoc.email,
      password: initialPassword,
      role: 'doctor',
      doctorId: id,
      phone: newDoc.phone,
      status: 'active'
    });
    return res.status(201).json({
      success: true,
      message: 'Doctor added successfully. Share the login credentials below with the doctor.',
      data: newDoc,
      credentials: { email: newDoc.email, initialPassword, rule: 'Password is the doctor birthdate in DDMMYYYY format; doctor can change it after first login.' }
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const updated = await Doctor.findOneAndUpdate(
        { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        req.body,
        { new: true }
      );
      if (updated) {
        return res.status(200).json({ success: true, message: 'Doctor updated successfully', data: updated });
      }
    }

    const idx = inMemoryDoctors.findIndex(d => d.id === id || d._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Doctor not found' });
    inMemoryDoctors[idx] = { ...inMemoryDoctors[idx], ...req.body };
    return res.status(200).json({ success: true, message: 'Doctor updated successfully', data: inMemoryDoctors[idx] });
  } catch (error) {
    next(error);
  }
};
