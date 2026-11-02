import { Department } from '../models/Department.js';
import { departmentsData } from '../data/seedData.js';
import { isMongoConnected } from '../config/db.js';

let inMemoryDepartments = [...departmentsData];

export const getDepartments = async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const dbDepartments = await Department.find().sort({ name: 1 });
      if (dbDepartments && dbDepartments.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbDepartments.length,
          data: dbDepartments
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: inMemoryDepartments.length,
      data: inMemoryDepartments
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (isMongoConnected) {
      const dept = await Department.findOne({
        $or: [{ id }, { code: id.toUpperCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (dept) {
        return res.status(200).json({ success: true, data: dept });
      }
    }

    const dept = inMemoryDepartments.find((d) => d.id === id || d.code.toLowerCase() === id.toLowerCase());
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    return res.status(200).json({ success: true, data: dept });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, category, shortDescription, opdTimings, consultationCharges, headOfDepartment, services } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Department name and code are required.' });
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newDept = {
      id,
      code: code.toUpperCase(),
      name,
      category: category || 'Specialty Care',
      shortDescription: shortDescription || `${name} clinical service.`,
      description: req.body.description || shortDescription || '',
      headOfDepartment: headOfDepartment || 'Senior Clinical Director',
      opdTimings: opdTimings || 'Mon - Sat: 09:00 AM - 05:00 PM',
      consultationCharges: Number(consultationCharges) || 800,
      services: services || ['Clinical Consultations', 'Diagnostic Follow-up'],
      image: req.body.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
    };

    if (isMongoConnected) {
      const created = await Department.create(newDept);
      return res.status(201).json({ success: true, message: 'Department added successfully', data: created });
    }

    inMemoryDepartments.push(newDept);
    return res.status(201).json({ success: true, message: 'Department added successfully', data: newDept });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const updated = await Department.findOneAndUpdate(
        { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        req.body,
        { new: true }
      );
      if (updated) {
        return res.status(200).json({ success: true, message: 'Department updated successfully', data: updated });
      }
    }

    const idx = inMemoryDepartments.findIndex(d => d.id === id || d._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Department not found' });
    inMemoryDepartments[idx] = { ...inMemoryDepartments[idx], ...req.body };
    return res.status(200).json({ success: true, message: 'Department updated successfully', data: inMemoryDepartments[idx] });
  } catch (error) {
    next(error);
  }
};
