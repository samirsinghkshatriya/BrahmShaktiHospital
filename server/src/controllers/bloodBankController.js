import BloodInventory from '../models/BloodInventory.js';
import BloodRequest from '../models/BloodRequest.js';
import BloodDonation from '../models/BloodDonation.js';
import BloodInventoryTransaction from '../models/BloodInventoryTransaction.js';
import { isMongoConnected } from '../config/db.js';
import { bloodInventoryData, bloodRequestsData, bloodDonationsData } from '../data/seedData.js';

let inMemoryInventory = [...bloodInventoryData];
let inMemoryRequests = [...bloodRequestsData];
let inMemoryDonations = [...bloodDonationsData];
const inMemoryTransactions = [];

const random4 = () => Math.floor(1000 + Math.random() * 9000);

const actor = (req) => ({
  performedBy: req.user ? `${req.user.name || req.user.email}` : 'System',
  performedByRole: req.user ? req.user.role : 'system'
});

/* ------------------------------ Inventory ------------------------------ */

export const getBloodInventory = async (req, res, next) => {
  try {
    const { bloodGroup, component, status } = req.query;

    if (isMongoConnected) {
      const filter = {};
      if (bloodGroup) filter.bloodGroup = bloodGroup;
      if (component) filter.component = component;
      if (status) filter.status = status;

      const items = await BloodInventory.find(filter).sort({ bloodGroup: 1, component: 1 });
      // Public availability view — never expose donor identities.
      const publicView = items.map((i) => ({
        bloodGroup: i.bloodGroup,
        component: i.component,
        unitsAvailable: i.unitsAvailable,
        status: i.status,
        pricePerUnit: i.pricePerUnit,
        expiryDate: i.expiryDate,
        daysToExpiry: i.daysToExpiry,
        isExpired: i.isExpired,
        lastUpdated: i.lastUpdated
      }));
      return res.status(200).json({ success: true, count: publicView.length, data: publicView });
    }

    let filtered = [...inMemoryInventory];
    if (bloodGroup) filtered = filtered.filter((i) => i.bloodGroup === bloodGroup);
    if (component) filtered = filtered.filter((i) => i.component === component);
    if (status) filtered = filtered.filter((i) => i.status === status);
    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

// Full inventory management view for authorized blood bank personnel
export const getBloodInventoryAdmin = async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const items = await BloodInventory.find().sort({ bloodGroup: 1, component: 1 });
      return res.status(200).json({ success: true, count: items.length, data: items });
    }
    return res.status(200).json({ success: true, count: inMemoryInventory.length, data: inMemoryInventory });
  } catch (error) {
    next(error);
  }
};

export const updateBloodStock = async (req, res, next) => {
  try {
    const { bloodGroup, component, unitsAvailable, minThreshold, pricePerUnit, batchNo, expiryDate } = req.body;
    if (!bloodGroup || !component || unitsAvailable === undefined) {
      return res.status(400).json({ success: false, message: 'Blood group, component, and units are required.' });
    }

    if (isMongoConnected) {
      const before = await BloodInventory.findOne({ bloodGroup, component });
      const payload = {
        unitsAvailable,
        minThreshold: minThreshold ?? before?.minThreshold ?? 5,
        pricePerUnit: pricePerUnit ?? before?.pricePerUnit ?? 1200
      };
      if (batchNo !== undefined) payload.batchNo = batchNo;
      if (expiryDate) payload.expiryDate = expiryDate;

      const updated = await BloodInventory.findOneAndUpdate(
        { bloodGroup, component },
        { $set: payload, $setOnInsert: { bloodGroup, component } },
        { new: true, upsert: true }
      );

      const delta = Number(unitsAvailable) - (before ? before.unitsAvailable : 0);
      if (delta !== 0) {
        await BloodInventoryTransaction.create({
          bloodGroup,
          component,
          type: delta > 0 ? 'ADJUSTMENT' : 'ADJUSTMENT',
          units: delta,
          balanceAfter: updated.unitsAvailable,
          batchNo: updated.batchNo || '',
          ...actor(req),
          notes: req.body.notes || 'Stock level adjusted by blood bank personnel'
        });
      }
      return res.status(200).json({ success: true, message: 'Blood inventory updated', data: updated });
    }

    const idx = inMemoryInventory.findIndex((i) => i.bloodGroup === bloodGroup && i.component === component);
    const beforeUnits = idx >= 0 ? inMemoryInventory[idx].unitsAvailable : 0;
    const item = {
      bloodGroup,
      component,
      unitsAvailable,
      minThreshold: minThreshold ?? 5,
      pricePerUnit: pricePerUnit ?? 1200,
      batchNo: batchNo ?? (idx >= 0 ? inMemoryInventory[idx].batchNo : ''),
      expiryDate: expiryDate ?? (idx >= 0 ? inMemoryInventory[idx].expiryDate : null),
      status: unitsAvailable <= 3 ? 'Critical' : unitsAvailable <= (minThreshold ?? 5) ? 'Low Stock' : 'Adequate',
      lastUpdated: new Date().toISOString()
    };
    if (idx >= 0) inMemoryInventory[idx] = item;
    else inMemoryInventory.push(item);
    const delta = Number(unitsAvailable) - beforeUnits;
    if (delta !== 0) {
      inMemoryTransactions.push({
        bloodGroup, component, type: 'ADJUSTMENT', units: delta, balanceAfter: unitsAvailable, ...actor(req), createdAt: new Date().toISOString()
      });
    }
    return res.status(200).json({ success: true, message: 'Blood inventory updated', data: item });
  } catch (error) {
    next(error);
  }
};

// Add received units (donation collection or purchase) — expiry aware, creates ledger
export const addInventoryUnits = async (req, res, next) => {
  try {
    const { bloodGroup, component, units, batchNo, expiryDate, donationId, requestId, notes } = req.body;
    if (!bloodGroup || !component || !units) {
      return res.status(400).json({ success: false, message: 'Blood group, component, and units are required.' });
    }

    if (isMongoConnected) {
      const updated = await BloodInventory.findOneAndUpdate(
        { bloodGroup, component },
        {
          $inc: { unitsAvailable: Number(units) },
          $set: {
            ...(batchNo ? { batchNo } : {}),
            ...(expiryDate ? { expiryDate, collectedDate: expiryDate } : {})
          },
          $setOnInsert: { bloodGroup, component }
        },
        { new: true, upsert: true }
      );
      // Recompute status honoring expiry
      if (updated.expiryDate && new Date(updated.expiryDate).getTime() < Date.now()) {
        updated.status = 'Expired';
      } else if (updated.unitsAvailable <= 3) {
        updated.status = 'Critical';
      } else if (updated.unitsAvailable <= updated.minThreshold) {
        updated.status = 'Low Stock';
      } else {
        updated.status = 'Adequate';
      }
      updated.lastUpdated = new Date();
      await updated.save();

      await BloodInventoryTransaction.create({
        bloodGroup, component, type: 'DONATION_IN', units: Number(units),
        balanceAfter: updated.unitsAvailable, batchNo: batchNo || updated.batchNo || '',
        donationId: donationId || '', requestId: requestId || '', ...actor(req), notes: notes || 'Units received into inventory'
      });
      return res.status(201).json({ success: true, message: 'Units added to inventory', data: updated });
    }

    const idx = inMemoryInventory.findIndex((i) => i.bloodGroup === bloodGroup && i.component === component);
    let item;
    if (idx >= 0) {
      inMemoryInventory[idx].unitsAvailable += Number(units);
      if (batchNo) inMemoryInventory[idx].batchNo = batchNo;
      if (expiryDate) inMemoryInventory[idx].expiryDate = expiryDate;
      inMemoryInventory[idx].lastUpdated = new Date().toISOString();
      item = inMemoryInventory[idx];
    } else {
      item = { bloodGroup, component, unitsAvailable: Number(units), minThreshold: 5, pricePerUnit: 1200, batchNo: batchNo || '', expiryDate: expiryDate || null, status: 'Adequate', lastUpdated: new Date().toISOString() };
      inMemoryInventory.push(item);
    }
    inMemoryTransactions.push({ bloodGroup, component, type: 'DONATION_IN', units: Number(units), balanceAfter: item.unitsAvailable, batchNo, donationId, ...actor(req), createdAt: new Date().toISOString() });
    return res.status(201).json({ success: true, message: 'Units added to inventory', data: item });
  } catch (error) {
    next(error);
  }
};

// Issue units to an approved request — expiry-aware, atomic debit, ledger entry
export const issueBloodUnits = async (req, res, next) => {
  try {
    const { requestId, units } = req.body;
    if (!requestId || !units) {
      return res.status(400).json({ success: false, message: 'requestId and units are required.' });
    }
    const wantUnits = Number(units);

    if (isMongoConnected) {
      const request = await BloodRequest.findOne({ $or: [{ requestId }, { _id: String(requestId).match(/^[0-9a-fA-F]{24}$/) ? requestId : null }] });
      if (!request) return res.status(404).json({ success: false, message: 'Blood request not found.' });
      if (!['Approved', 'Partially Available', 'Available'].includes(request.status)) {
        return res.status(400).json({ success: false, message: `Request must be Approved/Available before issuing. Current status: ${request.status}.` });
      }

      const inv = await BloodInventory.findOne({ bloodGroup: request.bloodGroup, component: request.component });
      if (!inv) return res.status(404).json({ success: false, message: 'No inventory record for this blood group & component.' });
      if (inv.isExpired) {
        return res.status(400).json({ success: false, message: 'Cannot issue: available units are expired.' });
      }
      if (inv.unitsAvailable < wantUnits) {
        return res.status(409).json({ success: false, message: `Only ${inv.unitsAvailable} units available. Request reduced or sourcing required.` });
      }

      const atomic = await BloodInventory.findOneAndUpdate(
        { _id: inv._id, unitsAvailable: { $gte: wantUnits } },
        { $inc: { unitsAvailable: -wantUnits } },
        { new: true }
      );
      if (!atomic) return res.status(409).json({ success: false, message: 'Insufficient units at issue time (concurrent change).' });

      const issuedTotal = (request.issuedUnits || 0) + wantUnits;
      const newStatus = issuedTotal >= request.unitsNeeded ? 'Completed' : 'Partially Available';
      await BloodRequest.findOneAndUpdate(
        { _id: request._id },
        { issuedUnits: issuedTotal, allocatedUnits: issuedTotal, status: newStatus, reviewedBy: req.user?.email || 'blood-bank', reviewNotes: `Issued ${wantUnits} unit(s). Batch ${atomic.batchNo || 'n/a'}.` },
        { new: true }
      );

      const newBal = atomic.unitsAvailable;
      atomic.status = newBal <= 3 ? 'Critical' : newBal <= atomic.minThreshold ? 'Low Stock' : 'Adequate';
      atomic.lastUpdated = new Date();
      await atomic.save();

      await BloodInventoryTransaction.create({
        bloodGroup: request.bloodGroup, component: request.component, type: 'ISSUE_OUT', units: -wantUnits,
        balanceAfter: newBal, batchNo: atomic.batchNo || '', requestId: request.requestId, ...actor(req), notes: `Issued to ${request.patientName}`
      });

      const updatedReq = await BloodRequest.findOne({ _id: request._id });
      return res.status(200).json({ success: true, message: `Issued ${wantUnits} unit(s)`, data: updatedReq });
    }

    // Demo path
    const inv = inMemoryInventory.find((i) => i.bloodGroup && i.component ? `${i.bloodGroup}${i.component}` : '');
    const req2 = inMemoryRequests.find((r) => r.requestId === requestId || r._id === requestId);
    if (!req2) return res.status(404).json({ success: false, message: 'Blood request not found.' });
    const invItem = inMemoryInventory.find((i) => i.bloodGroup === req2.bloodGroup && i.component === req2.component);
    if (!invItem || invItem.unitsAvailable < wantUnits) {
      return res.status(409).json({ success: false, message: 'Insufficient units available.' });
    }
    invItem.unitsAvailable -= wantUnits;
    const issuedTotal = (req2.issuedUnits || 0) + wantUnits;
    req2.issuedUnits = issuedTotal;
    req2.status = issuedTotal >= req2.unitsNeeded ? 'Completed' : 'Partially Available';
    inMemoryTransactions.push({ bloodGroup: req2.bloodGroup, component: req2.component, type: 'ISSUE_OUT', units: -wantUnits, balanceAfter: invItem.unitsAvailable, requestId, ...actor(req), createdAt: new Date().toISOString() });
    void inv;
    return res.status(200).json({ success: true, message: `Issued ${wantUnits} unit(s)`, data: req2 });
  } catch (error) {
    next(error);
  }
};

export const getInventoryTransactions = async (req, res, next) => {
  try {
    const { bloodGroup, component } = req.query;
    if (isMongoConnected) {
      const filter = {};
      if (bloodGroup) filter.bloodGroup = bloodGroup;
      if (component) filter.component = component;
      const list = await BloodInventoryTransaction.find(filter).sort({ createdAt: -1 }).limit(200);
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
    let list = [...inMemoryTransactions];
    if (bloodGroup) list = list.filter((t) => t.bloodGroup === bloodGroup);
    if (component) list = list.filter((t) => t.component === component);
    return res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
};

export const getLowStockAlerts = async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const items = await BloodInventory.find({ $or: [{ status: 'Critical' }, { status: 'Low Stock' }, { status: 'Expired' }] }).sort({ unitsAvailable: 1 });
      return res.status(200).json({ success: true, count: items.length, data: items });
    }
    const items = inMemoryInventory.filter((i) => ['Critical', 'Low Stock', 'Expired'].includes(i.status));
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------- Requests ------------------------------ */

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
    const {
      patientName, patientAge, patientGender, hospitalName, wardOrDepartment, prescribingDoctor,
      bloodGroup, component, unitsNeeded, urgency, contactPhone, notes, prescriptionDocUrl
    } = req.body;

    if (!patientName || !bloodGroup || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Patient name, blood group, and contact phone are required.' });
    }

    const requestId = `REQ-BLD-${random4()}`;
    const newReq = {
      requestId,
      patientName,
      patientAge: patientAge ? Number(patientAge) : null,
      patientGender: patientGender || '',
      hospitalName: hospitalName || 'Brahm Shakti Hospital',
      wardOrDepartment: wardOrDepartment || '',
      prescribingDoctor: prescribingDoctor || '',
      bloodGroup,
      component: component || 'Packed Red Blood Cells',
      unitsNeeded: Number(unitsNeeded) || 1,
      urgency: urgency || 'Urgent',
      contactPhone,
      prescriptionDocUrl: prescriptionDocUrl || '',
      status: 'Submitted',
      notes: notes || ''
    };

    if (isMongoConnected) {
      const created = await BloodRequest.create(newReq);
      return res.status(201).json({ success: true, message: 'Blood request submitted for review', data: created });
    }

    inMemoryRequests.unshift({ ...newReq, _id: `req-${Date.now()}`, issuedUnits: 0, allocatedUnits: 0 });
    return res.status(201).json({ success: true, message: 'Blood request submitted for review', data: inMemoryRequests[0] });
  } catch (error) {
    next(error);
  }
};

export const updateBloodRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    const allowed = ['Submitted', 'Under Review', 'Approved', 'Partially Available', 'Available', 'Issued', 'Completed', 'Rejected'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowed.join(', ')}` });
    }

    if (isMongoConnected) {
      const updated = await BloodRequest.findOneAndUpdate(
        { $or: [{ requestId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { status, reviewedBy: req.user?.email || 'blood-bank', ...(reviewNotes !== undefined ? { reviewNotes } : {}) },
        { new: true }
      );
      if (updated) return res.status(200).json({ success: true, message: 'Request status updated', data: updated });
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const idx = inMemoryRequests.findIndex((r) => r.requestId === id || r._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Request not found' });
    inMemoryRequests[idx].status = status;
    if (reviewNotes !== undefined) inMemoryRequests[idx].reviewNotes = reviewNotes;
    inMemoryRequests[idx].reviewedBy = req.user?.email || 'blood-bank';
    return res.status(200).json({ success: true, message: 'Request status updated', data: inMemoryRequests[idx] });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------ Donations ------------------------------ */

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

// Public donor application — submission NEVER declares medical eligibility.
export const submitDonationApplication = async (req, res, next) => {
  try {
    const {
      donorName, dateOfBirth, donorPhone, donorAge, gender, email, address, bloodGroup,
      previousDonations, preferredDonationDate, eligibilityAnswers, consentGiven
    } = req.body;

    if (!donorName || !donorPhone) {
      return res.status(400).json({ success: false, message: 'Donor name and phone are required.' });
    }
    if (!consentGiven) {
      return res.status(400).json({ success: false, message: 'Donor consent is required to submit an application.' });
    }

    const donationId = `DONAPP-${new Date().getFullYear()}-${random4()}`;
    const newApp = {
      donationId,
      donorName,
      dateOfBirth: dateOfBirth || '',
      donorPhone,
      donorAge: Number(donorAge) || (dateOfBirth ? undefined : 0) || 0,
      gender: gender || 'Male',
      email: email || '',
      address: address || '',
      bloodGroup: bloodGroup || 'Unknown',
      previousDonations: previousDonations || '',
      preferredDonationDate: preferredDonationDate || '',
      eligibilityAnswers: Array.isArray(eligibilityAnswers) ? eligibilityAnswers : [],
      consentGiven: true,
      applicationStatus: 'Submitted',
      // Explicitly not eligible/collected — staff decision required.
      screeningStatus: 'Pending',
      unitsDonated: 0,
      donationDate: '',
      certificateNo: ''
    };

    if (isMongoConnected) {
      const created = await BloodDonation.create(newApp);
      return res.status(201).json({
        success: true,
        message: 'Donation application submitted. Our blood bank team will screen and confirm your eligibility.',
        data: { donationId: created.donationId, applicationStatus: created.applicationStatus }
      });
    }

    inMemoryDonations.unshift({ ...newApp, _id: `don-${Date.now()}` });
    return res.status(201).json({
      success: true,
      message: 'Donation application submitted. Our blood bank team will screen and confirm your eligibility.',
      data: { donationId, applicationStatus: 'Submitted' }
    });
  } catch (error) {
    next(error);
  }
};

// Staff updates an application's status (review / schedule / eligible / defer / reject)
export const updateDonationApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { applicationStatus, scheduledDonationDate, screeningStatus } = req.body;
    const allowedApp = ['Submitted', 'Under Review', 'Scheduled', 'Eligible', 'Deferred', 'Collected', 'Rejected'];
    if (applicationStatus && !allowedApp.includes(applicationStatus)) {
      return res.status(400).json({ success: false, message: `Invalid application status. Allowed: ${allowedApp.join(', ')}` });
    }

    const patch = { reviewedBy: req.user?.email || 'blood-bank' };
    if (applicationStatus) patch.applicationStatus = applicationStatus;
    if (scheduledDonationDate) patch.scheduledDonationDate = scheduledDonationDate;
    if (screeningStatus) patch.screeningStatus = screeningStatus;

    if (isMongoConnected) {
      const updated = await BloodDonation.findOneAndUpdate(
        { $or: [{ donationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        patch,
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Donation application not found' });
      return res.status(200).json({ success: true, message: 'Donation application updated', data: updated });
    }

    const idx = inMemoryDonations.findIndex((d) => d.donationId === id || d._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Donation application not found' });
    inMemoryDonations[idx] = { ...inMemoryDonations[idx], ...patch };
    return res.status(200).json({ success: true, message: 'Donation application updated', data: inMemoryDonations[idx] });
  } catch (error) {
    next(error);
  }
};

// Record an actual collection after staff confirms eligibility & screening.
// This is the ONLY public-facing path that credits inventory from a donation.
export const recordDonationCollection = async (req, res, next) => {
  try {
    const { donationId, units = 1, batchNo, expiryDate, component = 'Whole Blood' } = req.body;
    if (!donationId) {
      return res.status(400).json({ success: false, message: 'donationId is required.' });
    }

    if (isMongoConnected) {
      const donation = await BloodDonation.findOne({ donationId });
      if (!donation) return res.status(404).json({ success: false, message: 'Donation application not found' });
      if (!['Eligible', 'Scheduled', 'Collected'].includes(donation.applicationStatus) || donation.screeningStatus !== 'Passed') {
        return res.status(400).json({ success: false, message: 'Donor has not been marked Eligible/Passed by blood bank personnel.' });
      }

      const certificateNo = `BSH-DON-CERT-${random4()}`;
      const collectedAt = new Date().toISOString().split('T')[0];
      Object.assign(donation, {
        applicationStatus: 'Collected',
        screeningStatus: 'Passed',
        unitsDonated: Number(units),
        donationDate: collectedAt,
        certificateNo,
        batchNo: batchNo || '',
        screenedBy: req.user?.email || 'blood-bank'
      });
      await donation.save();

      // Credit inventory + ledger
      const updated = await BloodInventory.findOneAndUpdate(
        { bloodGroup: donation.bloodGroup, component },
        { $inc: { unitsAvailable: Number(units) }, $setOnInsert: { bloodGroup: donation.bloodGroup, component } },
        { new: true, upsert: true }
      );
      await BloodInventoryTransaction.create({
        bloodGroup: donation.bloodGroup, component, type: 'DONATION_IN', units: Number(units),
        balanceAfter: updated.unitsAvailable, batchNo: batchNo || updated.batchNo || '', donationId,
        ...actor(req), notes: `Collected from donor ${donation.donorName}`
      });

      return res.status(201).json({ success: true, message: 'Donation collected and stock credited', data: { donationId, certificateNo, units: Number(units) } });
    }

    const d = inMemoryDonations.find((x) => x.donationId === donationId);
    if (!d) return res.status(404).json({ success: false, message: 'Donation application not found' });
    if (!['Eligible', 'Scheduled', 'Collected'].includes(d.applicationStatus) || d.screeningStatus !== 'Passed') {
      return res.status(400).json({ success: false, message: 'Donor has not been cleared by blood bank personnel.' });
    }
    const certificateNo = `BSH-DON-CERT-${random4()}`;
    d.applicationStatus = 'Collected';
    d.unitsDonated = Number(units);
    d.donationDate = new Date().toISOString().split('T')[0];
    d.certificateNo = certificateNo;
    const invItem = inMemoryInventory.find((i) => i.bloodGroup === d.bloodGroup && i.component === component);
    if (invItem) invItem.unitsAvailable += Number(units);
    inMemoryTransactions.push({ bloodGroup: d.bloodGroup, component, type: 'DONATION_IN', units: Number(units), balanceAfter: invItem?.unitsAvailable || Number(units), donationId, ...actor(req), createdAt: new Date().toISOString() });
    return res.status(201).json({ success: true, message: 'Donation collected and stock credited', data: { donationId, certificateNo, units: Number(units) } });
  } catch (error) {
    next(error);
  }
};

// Legacy direct-record kept for admin manual entry of an already-completed donation
export const recordBloodDonation = async (req, res, next) => {
  try {
    req.body.units = req.body.units ?? req.body.unitsDonated ?? 1;
    return recordDonationCollectionFallback(req, res, next);
  } catch (error) {
    next(error);
  }
};

async function recordDonationCollectionFallback(req, res, next) {
  const { donorName, donorPhone, bloodGroup, units = 1, gender = 'Male', donorAge } = req.body;
  if (!donorName || !donorPhone || !bloodGroup) {
    return res.status(400).json({ success: false, message: 'Donor name, phone, and blood group are required.' });
  }
  const donationId = `DON-2026-${Math.floor(100 + Math.random() * 900)}`;
  const certificateNo = `BSH-DON-CERT-${random4()}`;

  if (isMongoConnected) {
    const created = await BloodDonation.create({
      donationId, donorName, donorPhone, donorAge: Number(donorAge) || 28, gender, bloodGroup,
      unitsDonated: Number(units), donationDate: new Date().toISOString().split('T')[0], certificateNo,
      applicationStatus: 'Collected', screeningStatus: 'Passed', screenedBy: req.user?.email || 'blood-bank'
    });
    await BloodInventory.findOneAndUpdate(
      { bloodGroup, component: 'Whole Blood' },
      { $inc: { unitsAvailable: Number(units) }, $setOnInsert: { bloodGroup, component: 'Whole Blood' } },
      { upsert: true }
    );
    const inv = await BloodInventory.findOne({ bloodGroup, component: 'Whole Blood' });
    await BloodInventoryTransaction.create({
      bloodGroup, component: 'Whole Blood', type: 'DONATION_IN', units: Number(units),
      balanceAfter: inv?.unitsAvailable || Number(units), donationId, ...actor(req), notes: 'Manual donation entry by authorized staff'
    });
    return res.status(201).json({ success: true, message: 'Donation recorded and stock credited', data: created });
  }

  const newDonation = {
    _id: `don-${Date.now()}`, donationId, donorName, donorPhone, donorAge: Number(donorAge) || 28, gender,
    bloodGroup, unitsDonated: Number(units), donationDate: new Date().toISOString().split('T')[0],
    certificateNo, applicationStatus: 'Collected', screeningStatus: 'Passed'
  };
  inMemoryDonations.unshift(newDonation);
  const invItem = inMemoryInventory.find((i) => i.bloodGroup === bloodGroup && i.component === 'Whole Blood');
  if (invItem) invItem.unitsAvailable += Number(units);
  inMemoryTransactions.push({ bloodGroup, component: 'Whole Blood', type: 'DONATION_IN', units: Number(units), balanceAfter: invItem?.unitsAvailable || Number(units), donationId, ...actor(req), createdAt: new Date().toISOString() });
  return res.status(201).json({ success: true, message: 'Donation recorded and stock credited', data: newDonation });
}
