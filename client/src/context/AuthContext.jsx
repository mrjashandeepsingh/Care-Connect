import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careconnect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(user?.role?.toLowerCase() || 'patient');
  const [doctorInfo, setDoctorInfo] = useState(() => {
    const saved = localStorage.getItem('careconnect_doctor');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('careconnect_user', JSON.stringify(user));
      setRole(user.role?.toLowerCase());
    } else {
      localStorage.removeItem('careconnect_user');
    }
  }, [user]);

  useEffect(() => {
    if (doctorInfo) {
      localStorage.setItem('careconnect_doctor', JSON.stringify(doctorInfo));
    } else {
      localStorage.removeItem('careconnect_doctor');
    }
  }, [doctorInfo]);

  const loginUser = (userData, doctorData = null) => {
    setUser(userData);
    setRole(userData.role?.toLowerCase());
    if (doctorData) {
      setDoctorInfo(doctorData);
    }
  };

  const logout = () => {
    setUser(null);
    setDoctorInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        doctorInfo,
        loginUser,
        logout,
        isDoctor: role === 'doctor',
        isPatient: role === 'patient'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
