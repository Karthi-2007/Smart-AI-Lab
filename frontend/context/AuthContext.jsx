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
          const studentProfile = await api.get(`/api/business/students/email/${email.toLowerCase().trim()}`).catch(() => null);
          if (studentProfile?.data?.studentId) {
            profileId = studentProfile.data.studentId;
            // Synchronize name in business service if missing or mismatched
            if (name && studentProfile.data.name !== name) {
              await api.put(`/api/business/students/${profileId}`, {
                name: name,
                email: email,
                regNo: regNo || studentProfile.data.regNo
              }).catch(() => null);
            }
          } else {
            // Auto-sync new student into business DB
            const newStudentRes = await api.post('/api/business/students', {
              studentId: userId,
              name: name || "Student",
              email: email,
              department: "Computer Science & Engineering",
              year: 3,
              status: "Active"
            }).catch(() => null);
            if (newStudentRes?.data?.studentId) {
              profileId = newStudentRes.data.studentId;
            }
          }
        } else if (role === "FACULTY") {
          const facultyProfile = await api.get(`/api/business/faculty/email/${email.toLowerCase().trim()}`).catch(() => null);
          if (facultyProfile?.data?.facultyId) {
            profileId = facultyProfile.data.facultyId;
            if (name && facultyProfile.data.name !== name) {
              await api.put(`/api/business/faculty/${profileId}`, {
                name: name,
                email: email
              }).catch(() => null);
            }
          } else {
            // Auto-sync new faculty into business DB
            const newFacultyRes = await api.post('/api/business/faculty', {
              facultyId: userId,
              name: name || "Faculty",
              email: email,
              department: "Computer Science & Engineering",
              designation: "Assistant Professor"
            }).catch(() => null);
            if (newFacultyRes?.data?.facultyId) {
              profileId = newFacultyRes.data.facultyId;
            }
          }
        }
      } catch (err) {
        console.warn("Could not sync profile by email with business-service:", err);
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

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
