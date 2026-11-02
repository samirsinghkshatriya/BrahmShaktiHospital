import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem('bsh_token');
    const savedUser = localStorage.getItem('bsh_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('bsh_token');
        localStorage.removeItem('bsh_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: jwtToken, user: userData } = response.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('bsh_token', jwtToken);
        localStorage.setItem('bsh_user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        const { token: jwtToken, user: newUser } = response.data;
        setToken(jwtToken);
        setUser(newUser);
        localStorage.setItem('bsh_token', jwtToken);
        localStorage.setItem('bsh_user', JSON.stringify(newUser));
        toast.success('Registration successful!');
        return { success: true, user: newUser };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bsh_token');
    localStorage.removeItem('bsh_user');
    toast.success('Logged out successfully');
  };

  const switchDemoRole = async (targetRole) => {
    const roleCredentials = {
      superadmin: { email: 'superadmin@brahmshaktihospital.com', password: 'SuperAdmin@123' },
      admin: { email: 'admin@brahmshaktihospital.com', password: 'Admin@123' },
      doctor: { email: 'doctor@brahmshaktihospital.com', password: 'Doctor@123' },
      pharmacist: { email: 'pharmacist@brahmshaktihospital.com', password: 'Pharmacist@123' },
      supplier: { email: 'supplier@brahmshaktihospital.com', password: 'Supplier@123' },
      receptionist: { email: 'receptionist@brahmshaktihospital.com', password: 'Receptionist@123' },
      patient: { email: 'patient@brahmshaktihospital.com', password: 'Patient@123' }
    };

    const creds = roleCredentials[targetRole];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
