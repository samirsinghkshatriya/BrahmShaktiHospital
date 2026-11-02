import Appointment from '../models/Appointment.js';
import { isMongoConnected } from '../config/db.js';
import { appointmentsData } from '../data/seedData.js';

let inMemoryAppointments = [...appointmentsData];

export const getAppointments = async (req, res, next) => {
  try {
    const { doctorId, departmentId, status, date, search } = req.query;

    if (isMongoConnected) {
      let filter = {};

      // If logged in as doctor, scope automatically to this doctor
      if (req.user && req.user.role === 'doctor' && req.user.doctorId) {
        filter.doctorId = req.user.doctorId;
      } else if (doctorId) {
        filter.doctorId = doctorId;
      }

      // If logged in as patient, scope to patient email or phone
      if (req.user && req.user.role === 'patient') {
        filter.$or = [
          { patientEmail: req.user.email },
          { patientPhone: req.user.phone }
        ];
      }

      if (departmentId) filter.departmentId = departmentId;
      if (status && status !== 'all') filter.status = status;
      if (date) filter.date = date;

      if (search) {
        filter.$or = [
          { patientName: { $regex: search, $options: 'i' } },
          { patientPhone: { $regex: search, $options: 'i' } },
          { appointmentId: { $regex: search, $options: 'i' } }
        ];
      }

      const list = await Appointment.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: list.length, data: list });
    }

    // In-memory fallback
    let filtered = [...inMemoryAppointments];

    if (req.user && req.user.role === 'doctor' && req.user.doctorId) {
      filtered = filtered.filter(a => a.doctorId === req.user.doctorId);
    } else if (doctorId) {
      filtered = filtered.filter(a => a.doctorId === doctorId);
    }

    if (req.user && req.user.role === 'patient') {
      filtered = filtered.filter(
        a => a.patientEmail === req.user.email || a.patientPhone === req.user.phone
      );
    }

    if (departmentId) filtered = filtered.filter(a => a.departmentId === departmentId);
    if (status && status !== 'all') filtered = filtered.filter(a => a.status === status);
    if (date) filtered = filtered.filter(a => a.date === date);

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.patientName.toLowerCase().includes(q) ||
          a.patientPhone.includes(q) ||
          a.appointmentId.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const apt = await Appointment.findOne({
        $or: [{ appointmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (apt) return res.status(200).json({ success: true, data: apt });
    }

    const apt = inMemoryAppointments.find(a => a.appointmentId === id || a._id === id);
    if (!apt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    return res.status(200).json({ success: true, data: apt });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const {
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      gender,
      doctorId,
      doctorName,
      departmentId,
      departmentName,
      date,
      timeSlot,
      appointmentType = 'OPD Consultation',
      symptoms = '',
      fee = 800,
      paymentMethod = 'Online payment'
    } = req.body;

    if (!patientName || !patientPhone || !doctorId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Patient name, phone, doctor, date, and time slot are required.'
      });
    }

    const appointmentId = `APT-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newAptData = {
      appointmentId,
      patientName,
      patientPhone,
      patientEmail: patientEmail || '',
      patientAge: Number(patientAge) || 30,
      gender: gender || 'Male',
      doctorId,
      doctorName: doctorName || 'Consultant Doctor',
      departmentId: departmentId || 'general',
      departmentName: departmentName || 'General OPD',
      date,
      timeSlot,
      appointmentType,
      symptoms,
      fee: Number(fee) || 800,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod,
      doctorNotes: '',
      prescriptions: []
    };

    if (isMongoConnected) {
      const created = await Appointment.create(newAptData);
      return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data: created
      });
    }

    inMemoryAppointments.unshift({ ...newAptData, _id: `apt-${Date.now()}` });
    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: inMemoryAppointments[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, doctorNotes, date, timeSlot } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (doctorNotes !== undefined) updateFields.doctorNotes = doctorNotes;
    if (date) updateFields.date = date;
    if (timeSlot) updateFields.timeSlot = timeSlot;

    if (isMongoConnected) {
      const updated = await Appointment.findOneAndUpdate(
        { $or: [{ appointmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        updateFields,
        { new: true }
      );
      if (updated) {
        return res.status(200).json({ success: true, message: 'Status updated', data: updated });
      }
    }

    const idx = inMemoryAppointments.findIndex(a => a.appointmentId === id || a._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Appointment not found' });
    inMemoryAppointments[idx] = { ...inMemoryAppointments[idx], ...updateFields };
    return res.status(200).json({ success: true, message: 'Status updated', data: inMemoryAppointments[idx] });
  } catch (error) {
    next(error);
  }
};
