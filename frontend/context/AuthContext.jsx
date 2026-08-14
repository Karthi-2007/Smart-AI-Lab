import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const loginUser = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (!res) return;
      const { token: jwtToken, role, userId, name, regNo } = res.data || res;
      
      // Save token FIRST so subsequent API requests send the Bearer header
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);

      let profileId = userId; // fallback
      
      try {
        if (role === "STUDENT") {
          const studentRes = await api.get(`/api/business/students/email/lookup-email?email=${encodeURIComponent(email.toLowerCase().trim())}`).catch(() => null);
          const profile = studentRes?.data?.data || studentRes?.data;
          if (profile?.studentId || profile?.id) {
            profileId = profile.studentId || profile.id;
          }
        } else if (role === "FACULTY") {
          const facultyRes = await api.get(`/api/business/faculty/email/lookup-email?email=${encodeURIComponent(email.toLowerCase().trim())}`).catch(() => null);
          const profile = facultyRes?.data?.data || facultyRes?.data;
          if (profile?.facultyId || profile?.id) {
            profileId = profile.facultyId || profile.id;
          }
        }
      } catch (err) {
        console.warn("Could not sync profile by email with smartlab-service:", err);
      }
      
      const userData = { id: profileId, userId, role, name, email, regNo };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { ...res.data, id: profileId, userId, role, name, email, regNo };
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (updatedData) => {
    setUser((prevUser) => {
      const updated = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const logoutUser = async () => {
    try {
      await authService.logout().catch(() => null);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role || null,
        login: loginUser,
        logout: logoutUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => React.useContext(AuthContext);
