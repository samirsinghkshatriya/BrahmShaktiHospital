import BloodInventory from '../models/BloodInventory.js';
import BloodRequest from '../models/BloodRequest.js';
import BloodDonation from '../models/BloodDonation.js';
import { isMongoConnected } from '../config/db.js';
import { bloodInventoryData, bloodRequestsData, bloodDonationsData } from '../data/seedData.js';

let inMemoryInventory = [...bloodInventoryData];
let inMemoryRequests = [...bloodRequestsData];
let inMemoryDonations = [...bloodDonationsData];

export const getBloodInventory = async (req, res, next) => {
  try {
    const { bloodGroup, component, status } = req.query;

    if (isMongoConnected) {
      let filter = {};
      if (bloodGroup) filter.bloodGroup = bloodGroup;
      if (component) filter.component = component;
      if (status) filter.status = status;

      const items = await BloodInventory.find(filter).sort({ bloodGroup: 1, component: 1 });
      return res.status(200).json({ success: true, count: items.length, data: items });
    }

    let filtered = [...inMemoryInventory];
    if (bloodGroup) filtered = filtered.filter(i => i.bloodGroup === bloodGroup);
    if (component) filtered = filtered.filter(i => i.component === component);
    if (status) filtered = filtered.filter(i => i.status === status);

    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

export const updateBloodStock = async (req, res, next) => {
  try {
    const { bloodGroup, component, unitsAvailable, minThreshold, pricePerUnit } = req.body;

    if (!bloodGroup || !component || unitsAvailable === undefined) {
      return res.status(400).json({ success: false, message: 'Blood group, component, and units are required.' });
    }

    let status = 'Adequate';
    if (unitsAvailable <= 3) status = 'Critical';
    else if (unitsAvailable <= (minThreshold || 5)) status = 'Low Stock';

    if (isMongoConnected) {
      const updated = await BloodInventory.findOneAndUpdate(
        { bloodGroup, component },
        {
          unitsAvailable,
          minThreshold: minThreshold || 5,
          pricePerUnit: pricePerUnit || 1200,
          status,
          lastUpdated: new Date()
        },
        { new: true, upsert: true }
      );
      return res.status(200).json({ success: true, message: 'Blood inventory updated', data: updated });
    }

    const idx = inMemoryInventory.findIndex(i => i.bloodGroup === bloodGroup && i.component === component);
    const item = {
      bloodGroup,
      component,
      unitsAvailable,
      minThreshold: minThreshold || 5,
      pricePerUnit: pricePerUnit || 1200,
      status,
      lastUpdated: new Date().toISOString()
    };

    if (idx >= 0) {
      inMemoryInventory[idx] = item;
    } else {
      inMemoryInventory.push(item);
    }

    return res.status(200).json({ success: true, message: 'Blood inventory updated', data: item });
  } catch (error) {
    next(error);
  }
};

export const getBloodRequests = async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const list = await BloodRequest.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
    return res.status(200).json({ success: true, count: inMemoryRequests.length, data: inMemoryRequests });
  } catch (error) {
    next(error);
  }
};

export const createBloodRequest = async (req, res, next) => {
  try {
    const { patientName, hospitalName, bloodGroup, component, unitsNeeded, urgency, contactPhone, notes } = req.body;

    if (!patientName || !bloodGroup || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Patient name, blood group, and contact phone are required.' });
    }

    const requestId = `REQ-BLD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq = {
      requestId,
      patientName,
      hospitalName: hospitalName || 'Brahm Shakti Hospital',
      bloodGroup,
      component: component || 'Packed Red Blood Cells',
      unitsNeeded: Number(unitsNeeded) || 1,
      urgency: urgency || 'Urgent',
      contactPhone,
      doctorPrescription: req.body.doctorPrescription || 'Hospital Medical Officer Verification',
      status: 'Pending',
      notes: notes || ''
    };

    if (isMongoConnected) {
      const created = await BloodRequest.create(newReq);
      return res.status(201).json({ success: true, message: 'Blood request registered', data: created });
    }

    inMemoryRequests.unshift({ ...newReq, _id: `req-${Date.now()}` });
    return res.status(201).json({ success: true, message: 'Blood request registered', data: inMemoryRequests[0] });
  } catch (error) {
    next(error);
  }
};

export const updateBloodRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoConnected) {
      const updated = await BloodRequest.findOneAndUpdate(
        { $or: [{ requestId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { status },
        { new: true }
      );
      if (updated) return res.status(200).json({ success: true, message: 'Status updated', data: updated });
    }

    const idx = inMemoryRequests.findIndex(r => r.requestId === id || r._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Request not found' });
    inMemoryRequests[idx].status = status;
    return res.status(200).json({ success: true, message: 'Status updated', data: inMemoryRequests[idx] });
  } catch (error) {
    next(error);
  }
};

export const getBloodDonations = async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const list = await BloodDonation.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
    return res.status(200).json({ success: true, count: inMemoryDonations.length, data: inMemoryDonations });
  } catch (error) {
    next(error);
  }
};

export const recordBloodDonation = async (req, res, next) => {
  try {
    const { donorName, donorPhone, donorAge, gender, bloodGroup, unitsDonated = 1 } = req.body;

    if (!donorName || !donorPhone || !bloodGroup) {
      return res.status(400).json({ success: false, message: 'Donor name, phone, and blood group are required.' });
    }

    const donationId = `DON-2026-${Math.floor(100 + Math.random() * 900)}`;
    const certificateNo = `BSH-DON-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation = {
      donationId,
      donorName,
      donorPhone,
      donorAge: Number(donorAge) || 28,
      gender: gender || 'Male',
      bloodGroup,
      unitsDonated: Number(unitsDonated) || 1,
      donationDate: new Date().toISOString().split('T')[0],
      certificateNo,
      screeningStatus: 'Passed'
    };

    if (isMongoConnected) {
      const created = await BloodDonation.create(newDonation);
      // Increment Whole Blood units for this group
      await BloodInventory.findOneAndUpdate(
        { bloodGroup, component: 'Whole Blood' },
        { $inc: { unitsAvailable: Number(unitsDonated) || 1 } }
      );
      return res.status(201).json({ success: true, message: 'Donation recorded and stock credited', data: created });
    }

    inMemoryDonations.unshift({ ...newDonation, _id: `don-${Date.now()}` });
    return res.status(201).json({ success: true, message: 'Donation recorded and stock credited', data: inMemoryDonations[0] });
  } catch (error) {
    next(error);
  }
};
