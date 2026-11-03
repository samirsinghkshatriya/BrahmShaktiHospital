import Appointment from '../models/Appointment.js';
import AppointmentSlot from '../models/AppointmentSlot.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { isMongoConnected } from '../config/db.js';
import { appointmentsData, doctorsData } from '../data/seedData.js';
import { generateSlotWindowsForDoctor } from '../utils/slotGenerator.js';

let inMemoryAppointments = [...appointmentsData];
// Demo-mode slot store: key `${doctorId}|${date}|${time}` -> { capacity, booked }
const inMemorySlots = new Map();

const DEFAULT_SLOT_CAPACITY = 1;

const makeSlotKey = (doctorId, date, timeSlot) => `${doctorId}|${date}|${timeSlot}`;

const pad = (n, len = 4) => String(n).padStart(len, '0');

const random4 = () => Math.floor(1000 + Math.random() * 9000);

const genAppointmentId = () => `APT-${new Date().getFullYear()}-${random4()}`;

// Generate a unique hospital registration number (UHID)
async function generateUHID() {
  const year = new Date().getFullYear();
  if (isMongoConnected) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const count = await Patient.estimatedDocumentCount();
      const candidate = `BSH-UHID-${year}-${pad(count + 1 + attempt)}`;
      // eslint-disable-next-line no-await-in-loop
      const exists = await Patient.findOne({ uhid: candidate });
      if (!exists) return candidate;
    }
    return `BSH-UHID-${year}-${Date.now().toString().slice(-6)}`;
  }
  return `BSH-UHID-${year}-${Date.now().toString().slice(-6)}`;
}

const genToken = (date) => `T-${String(date).replace(/-/g, '').slice(4)}-${random4()}`;

/* -------------------------------------------------------------------------- */
/*                              Slot management                               */
/* -------------------------------------------------------------------------- */

// Ensure AppointmentSlot records exist for a doctor on a date, from schedule.
async function ensureSlots(doctor, date) {
  const windows = generateSlotWindowsForDoctor(doctor, date);

  if (isMongoConnected) {
    for (const timeSlot of windows) {
      // Idempotent upsert of the slot scaffold (does not reset bookedCount)
      // eslint-disable-next-line no-await-in-loop
      await AppointmentSlot.findOneAndUpdate(
        { doctorId: doctor.id, date, timeSlot },
        {
          $setOnInsert: {
            doctorId: doctor.id,
            doctorName: doctor.name,
            departmentId: doctor.departmentId,
            departmentName: doctor.departmentName,
            date,
            timeSlot,
            capacity: DEFAULT_SLOT_CAPACITY,
            bookedCount: 0
          }
        },
        { upsert: true, new: true }
      );
    }
    const slots = await AppointmentSlot.find({ doctorId: doctor.id, date }).sort({ timeSlot: 1 });
    return slots.map((s) => ({
      _id: s._id,
      timeSlot: s.timeSlot,
      capacity: s.capacity,
      bookedCount: s.bookedCount,
      remaining: Math.max(0, s.capacity - s.bookedCount),
      isClosed: s.isClosed
    }));
  }

  // Demo/in-memory store
  for (const timeSlot of windows) {
    const key = makeSlotKey(doctor.id, date, timeSlot);
    if (!inMemorySlots.has(key)) {
      inMemorySlots.set(key, { capacity: DEFAULT_SLOT_CAPACITY, booked: 0 });
    }
  }
  return windows.map((timeSlot) => {
    const s = inMemorySlots.get(makeSlotKey(doctor.id, date, timeSlot));
    return {
      timeSlot,
      capacity: s.capacity,
      bookedCount: s.booked,
      remaining: Math.max(0, s.capacity - s.booked),
      isClosed: false
    };
  });
}

async function findDoctorById(doctorId) {
  if (!doctorId) return null;
  if (isMongoConnected) {
    const doc = await Doctor.findOne({
      $or: [{ id: doctorId }, { _id: doctorId.match(/^[0-9a-fA-F]{24}$/) ? doctorId : null }]
    });
    if (doc) return doc;
  }
  return inMemoryDoctorsLookup(doctorId);
}

function inMemoryDoctorsLookup(doctorId) {
  return doctorsData.find((d) => d.id === doctorId) || null;
}

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ success: false, message: 'doctorId and date are required.' });
    }
    const doctor = await findDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    const slots = await ensureSlots(doctor, date);
    return res.status(200).json({
      success: true,
      doctorId,
      doctorName: doctor.name,
      date,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { doctorId, departmentId, status, date, search } = req.query;

    if (isMongoConnected) {
      const filter = {};

      if (req.user && req.user.role === 'doctor' && req.user.doctorId) {
        filter.doctorId = req.user.doctorId;
      } else if (doctorId) {
        filter.doctorId = doctorId;
      }

      if (req.user && req.user.role === 'patient') {
        filter.$or = [{ patientEmail: req.user.email }, { patientPhone: req.user.phone }, { uhid: req.user.patientId }];
      }

      if (departmentId) filter.departmentId = departmentId;
      if (status && status !== 'all') filter.status = status;
      if (date) filter.date = date;

      if (search) {
        filter.$or = [
          { patientName: { $regex: search, $options: 'i' } },
          { patientPhone: { $regex: search, $options: 'i' } },
          { appointmentId: { $regex: search, $options: 'i' } },
          { uhid: { $regex: search, $options: 'i' } }
        ];
      }

      const list = await Appointment.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: list.length, data: list });
    }

    // Demo-mode fallback
    let filtered = [...inMemoryAppointments];
    if (req.user && req.user.role === 'doctor' && req.user.doctorId) {
      filtered = filtered.filter((a) => a.doctorId === req.user.doctorId);
    } else if (doctorId) {
      filtered = filtered.filter((a) => a.doctorId === doctorId);
    }
    if (req.user && req.user.role === 'patient') {
      filtered = filtered.filter(
        (a) => a.patientEmail === req.user.email || a.patientPhone === req.user.phone
      );
    }
    if (departmentId) filtered = filtered.filter((a) => a.departmentId === departmentId);
    if (status && status !== 'all') filtered = filtered.filter((a) => a.status === status);
    if (date) filtered = filtered.filter((a) => a.date === date);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
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
    const apt = inMemoryAppointments.find((a) => a.appointmentId === id || a._id === id);
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
      appointmentType = 'General OPD',
      symptoms = '',
      fee = 800,
      paymentMethod = 'UPI / Online',
      uhid,
      patientUserId
    } = req.body;

    if (!patientName || !patientPhone || !doctorId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Patient name, phone, doctor, date, and time slot are required.'
      });
    }

    const doctor = await findDoctorById(doctorId);
    const resolvedDoctorName = doctor?.name || doctorName || 'Consultant Doctor';
    const resolvedDeptId = departmentId || doctor?.departmentId || 'general';
    const resolvedDeptName = departmentName || doctor?.departmentName || 'General OPD';
    const resolvedFee = fee || doctor?.consultationFee || 800;

    // Resolve or create the patient's UHID (unique hospital registration no.)
    let resolvedUHID = uhid || '';
    let linkedPatientId = '';
    if (isMongoConnected) {
      let patient = null;
      if (uhid) {
        patient = await Patient.findOne({ uhid });
      }
      if (!patient && patientPhone) {
        patient = await Patient.findOne({ phone: patientPhone });
      }
      if (patient) {
        resolvedUHID = patient.uhid || patient.patientId;
        linkedPatientId = patient.patientId;
      } else {
        resolvedUHID = await generateUHID();
        try {
          const created = await Patient.create({
            patientId: resolvedUHID,
            uhid: resolvedUHID,
            name: patientName,
            age: Number(patientAge) || 30,
            gender: gender || 'Male',
            phone: patientPhone,
            email: patientEmail || '',
            userId: patientUserId || '',
            status: 'Active'
          });
          linkedPatientId = created.patientId;
        } catch (e) {
          // Non-fatal: still allow booking with generated UHID
          linkedPatientId = resolvedUHID;
        }
      }
    } else {
      resolvedUHID = await generateUHID();
      linkedPatientId = resolvedUHID;
    }

    if (isMongoConnected) {
      // Ensure slot scaffold exists, then attempt an atomic seat claim.
      if (doctor) await ensureSlots(doctor, date);

      const claim = await AppointmentSlot.findOneAndUpdate(
        { doctorId, date, timeSlot, isClosed: false, $expr: { $lt: ['$bookedCount', '$capacity'] } },
        { $inc: { bookedCount: 1 } },
        { new: true }
      );

      if (!claim) {
        return res.status(409).json({
          success: false,
          message: 'That time slot is no longer available. Please choose another slot.'
        });
      }

      try {
        const appointmentId = genAppointmentId();
        const tokenNumber = genToken(date);
        const created = await Appointment.create({
          appointmentId,
          patientName,
          patientPhone,
          patientEmail: patientEmail || '',
          patientAge: Number(patientAge) || 30,
          gender: gender || 'Male',
          doctorId,
          doctorName: resolvedDoctorName,
          departmentId: resolvedDeptId,
          departmentName: resolvedDeptName,
          date,
          timeSlot,
          appointmentType,
          symptoms,
          fee: Number(resolvedFee) || 800,
          status: 'Confirmed',
          paymentStatus: 'Paid',
          paymentMethod,
          uhid: resolvedUHID,
          patientId: linkedPatientId,
          patientUserId: patientUserId || '',
          slotId: String(claim._id),
          tokenNumber
        });
        return res.status(201).json({
          success: true,
          message: 'Appointment booked successfully',
          data: created
        });
      } catch (err) {
        // Roll back the claimed seat if creation failed (e.g. unique guard)
        await AppointmentSlot.findOneAndUpdate({ _id: claim._id }, { $inc: { bookedCount: -1 } });
        if (err.code === 11000) {
          return res.status(409).json({
            success: false,
            message: 'This patient already has an active appointment in that slot.'
          });
        }
        throw err;
      }
    }

    // ---- Demo / in-memory path ----
    const key = makeSlotKey(doctorId, date, timeSlot);
    if (!inMemorySlots.has(key)) {
      const windows = doctor ? generateSlotWindowsForDoctor(doctor, date) : [timeSlot];
      windows.forEach((w) => inMemorySlots.set(makeSlotKey(doctorId, date, w), { capacity: DEFAULT_SLOT_CAPACITY, booked: 0 }));
    }
    const slot = inMemorySlots.get(key);
    if (!slot || slot.booked >= slot.capacity) {
      return res.status(409).json({ success: false, message: 'That time slot is fully booked. Please choose another.' });
    }
    const duplicate = inMemoryAppointments.some(
      (a) => a.doctorId === doctorId && a.date === date && a.timeSlot === timeSlot && ['Pending', 'Confirmed'].includes(a.status)
    );
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'This slot is already booked.' });
    }
    slot.booked += 1;
    const newApt = {
      _id: `apt-${Date.now()}`,
      appointmentId: genAppointmentId(),
      patientName,
      patientPhone,
      patientEmail: patientEmail || '',
      patientAge: Number(patientAge) || 30,
      gender: gender || 'Male',
      doctorId,
      doctorName: resolvedDoctorName,
      departmentId: resolvedDeptId,
      departmentName: resolvedDeptName,
      date,
      timeSlot,
      appointmentType,
      symptoms,
      fee: Number(resolvedFee) || 800,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod,
      uhid: resolvedUHID,
      patientId: linkedPatientId,
      tokenNumber: genToken(date),
      doctorNotes: '',
      prescriptions: []
    };
    inMemoryAppointments.unshift(newApt);
    return res.status(201).json({ success: true, message: 'Appointment booked successfully', data: newApt });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, doctorNotes } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (doctorNotes !== undefined) updateFields.doctorNotes = doctorNotes;

    if (isMongoConnected) {
      const existing = await Appointment.findOne({
        $or: [{ appointmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (!existing) return res.status(404).json({ success: false, message: 'Appointment not found' });

      const updated = await Appointment.findOneAndUpdate(
        { _id: existing._id },
        updateFields,
        { new: true }
      );

      // Release the slot seat when an appointment becomes Cancelled
      if (status === 'Cancelled' && existing.slotId) {
        await AppointmentSlot.findOneAndUpdate({ _id: existing.slotId }, { $inc: { bookedCount: -1 } });
        await Appointment.findOneAndUpdate({ _id: existing._id }, { cancellationReason: req.body.cancellationReason || 'Cancelled' }, { new: true });
      }
      return res.status(200).json({ success: true, message: 'Status updated', data: updated });
    }

    const idx = inMemoryAppointments.findIndex((a) => a.appointmentId === id || a._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Appointment not found' });
    inMemoryAppointments[idx] = { ...inMemoryAppointments[idx], ...updateFields };
    if (status === 'Cancelled') {
      const a = inMemoryAppointments[idx];
      const key = makeSlotKey(a.doctorId, a.date, a.timeSlot);
      const slot = inMemorySlots.get(key);
      if (slot && slot.booked > 0) slot.booked -= 1;
    }
    return res.status(200).json({ success: true, message: 'Status updated', data: inMemoryAppointments[idx] });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    req.body.status = 'Cancelled';
    return updateAppointmentStatus(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const rescheduleAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, timeSlot, doctorId } = req.body;
    if (!date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'New date and timeSlot are required.' });
    }

    if (isMongoConnected) {
      const existing = await Appointment.findOne({
        $or: [{ appointmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (!existing) return res.status(404).json({ success: false, message: 'Appointment not found' });

      const targetDoctorId = doctorId || existing.doctorId;
      const doctor = await findDoctorById(targetDoctorId);
      if (doctor) await ensureSlots(doctor, date);

      // Claim the new seat atomically
      const claim = await AppointmentSlot.findOneAndUpdate(
        { doctorId: targetDoctorId, date, timeSlot, isClosed: false, $expr: { $lt: ['$bookedCount', '$capacity'] } },
        { $inc: { bookedCount: 1 } },
        { new: true }
      );
      if (!claim) {
        return res.status(409).json({ success: false, message: 'The requested new slot is not available.' });
      }

      // Release the old seat
      if (existing.slotId) {
        await AppointmentSlot.findOneAndUpdate({ _id: existing.slotId }, { $inc: { bookedCount: -1 } });
      }

      const updated = await Appointment.findOneAndUpdate(
        { _id: existing._id },
        {
          date,
          timeSlot,
          doctorId: targetDoctorId,
          doctorName: doctor?.name || existing.doctorName,
          slotId: String(claim._id),
          rescheduledFrom: `${existing.date} ${existing.timeSlot}`,
          status: 'Confirmed'
        },
        { new: true }
      );
      return res.status(200).json({ success: true, message: 'Appointment rescheduled', data: updated });
    }

    // Demo path
    const idx = inMemoryAppointments.findIndex((a) => a.appointmentId === id || a._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Appointment not found' });
    const a = inMemoryAppointments[idx];
    const newKey = makeSlotKey(a.doctorId, date, timeSlot);
    if (!inMemorySlots.has(newKey)) inMemorySlots.set(newKey, { capacity: DEFAULT_SLOT_CAPACITY, booked: 0 });
    if (inMemorySlots.get(newKey).booked >= inMemorySlots.get(newKey).capacity) {
      return res.status(409).json({ success: false, message: 'The requested new slot is not available.' });
    }
    const oldKey = makeSlotKey(a.doctorId, a.date, a.timeSlot);
    if (inMemorySlots.get(oldKey) && inMemorySlots.get(oldKey).booked > 0) inMemorySlots.get(oldKey).booked -= 1;
    inMemorySlots.get(newKey).booked += 1;
    a.rescheduledFrom = `${a.date} ${a.timeSlot}`;
    a.date = date;
    a.timeSlot = timeSlot;
    a.status = 'Confirmed';
    return res.status(200).json({ success: true, message: 'Appointment rescheduled', data: a });
  } catch (error) {
    next(error);
  }
};
