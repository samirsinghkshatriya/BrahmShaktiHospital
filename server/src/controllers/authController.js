import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { usersData } from '../data/seedData.js';

const JWT_SECRET = process.env.JWT_SECRET || 'brahm_shakti_hospital_jwt_secret_key_2026_secured';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id || user.email,
      email: user.email,
      name: user.name,
      role: user.role,
      doctorId: user.doctorId || null,
      patientId: user.patientId || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    // Public self-registration is exclusively for patients.
    // Doctors, admins and all staff accounts are created internally by the Admin / Super Admin.
    const { name, email, password, phone = '' } = req.body;
    const role = 'patient';

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (isMongoConnected) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        phone,
        status: 'active'
      });

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          status: user.status
        }
      });
    } else {
      // In-memory fallback
      const token = jwt.sign(
        { id: `user-${Date.now()}`, email, name, role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.status(201).json({
        success: true,
        token,
        user: { id: `user-${Date.now()}`, name, email, role, phone, status: 'active' }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. User not found.'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Incorrect password.'
        });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          status: user.status,
          doctorId: user.doctorId,
          patientId: user.patientId,
          avatar: user.avatar,
          mustChangePassword: user.mustChangePassword || false
        }
      });
    } else {
      // Fallback matching against usersData
      const found = usersData.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (found) {
        const token = generateToken(found);
        return res.status(200).json({
          success: true,
          token,
          user: {
            id: found.email,
            name: found.name,
            email: found.email,
            role: found.role,
            phone: found.phone,
            status: found.status,
            doctorId: found.doctorId,
            patientId: found.patientId,
            avatar: found.avatar,
            mustChangePassword: found.mustChangePassword || false
          }
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: error.message
    });
  }
};

export const getDemoAccounts = (req, res) => {
  // Staff & admin credentials are issued privately by the Super Admin.
  // Only the patient demo account remains publicly available for evaluation.
  const accounts = [
    { role: 'patient', label: 'Patient', email: 'patient@brahmshaktihospital.com', password: 'Patient@123', scope: 'My Appointments & Bills' }
  ];

  res.status(200).json({
    success: true,
    accounts
  });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from the current password.' });
    }

    if (isMongoConnected) {
      const user = await User.findById(req.user._id || req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User account not found.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      }
      user.password = newPassword; // pre-save hook hashes it
      user.mustChangePassword = false;
      await user.save();
      return res.status(200).json({ success: true, message: 'Password updated successfully.' });
    }

    // In-memory fallback (demo mode)
    const found = usersData.find((u) => u.email.toLowerCase() === (req.user.email || '').toLowerCase());
    if (!found) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }
    if (found.password !== currentPassword) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }
    found.password = newPassword;
    found.mustChangePassword = false;
    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Password change failed', error: error.message });
  }
};
