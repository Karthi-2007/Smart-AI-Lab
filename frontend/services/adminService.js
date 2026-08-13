import api from './api';

export const adminService = {
    getDashboard: () => api.get('/api/business/dashboard/admin'),
    getDashboardAdminSummary: () => api.get('/api/business/dashboard/admin/summary'),
    
    getUsers: async () => {
        try {
            const [authRes, studentsRes, facultyRes] = await Promise.all([
                api.get('/api/auth/admin/users').catch(err => {
                    console.warn("Could not fetch auth users:", err);
                    return { data: [] };
                }),
                api.get('/api/business/students').catch(err => {
                    console.warn("Could not fetch business students:", err);
                    return { data: [] };
                }),
                api.get('/api/business/faculty').catch(err => {
                    console.warn("Could not fetch business faculty:", err);
                    return { data: [] };
                })
            ]);
            
            const authUsers = authRes?.data?.data || authRes?.data || authRes || [];
            const students = studentsRes?.data?.data?.content || studentsRes?.data?.data || studentsRes?.data || studentsRes || [];
            const faculty = facultyRes?.data?.data?.content || facultyRes?.data?.data || facultyRes?.data || facultyRes || [];

            if (Array.isArray(authUsers) && authUsers.length === 0) {
                const combined = [
                    ...students.map(s => ({ ...s, id: s.studentId, role: 'STUDENT', status: s.status || 'Active' })),
                    ...faculty.map(f => ({ ...f, id: f.facultyId, role: 'FACULTY', status: 'Active' }))
                ];
                return combined;
            }
            
            return authUsers.map(user => {
                const email = user.email?.toLowerCase().trim();
                if (user.role === 'STUDENT' || user.role === 'student') {
                    const profile = students.find(s => s.email?.toLowerCase().trim() === email);
                    return {
                        ...user,
                        id: user.userId || user.id,
                        studentId: profile?.studentId,
                        department: profile?.department || '',
                        year: profile?.year || '',
                        status: profile?.status || user.status || 'Active',
                        phone: profile?.phone || '',
                        regNo: profile?.regNo || '',
                        registerNo: profile?.regNo || ''
                    };
                } else if (user.role === 'FACULTY' || user.role === 'faculty') {
                    const profile = faculty.find(f => f.email?.toLowerCase().trim() === email);
                    return {
                        ...user,
                        id: user.userId || user.id,
                        facultyId: profile?.facultyId,
                        department: profile?.department || '',
                        designation: profile?.designation || '',
                        status: profile?.status || user.status || 'ACTIVE',
                        lab: profile?.lab || '',
                        phone: profile?.phone || ''
                    };
                }
                return {
                    ...user,
                    id: user.userId || user.id
                };
            });
        } catch (error) {
            console.error("Error fetching or merging users:", error);
            throw error;
        }
    },
    
    getStudents: (params) => api.get('/api/business/students', { params }),
    getFaculty: (params) => api.get('/api/business/faculty', { params }),
    
    activateStudent: (id) => api.patch(`/api/business/students/${id}/activate`),
    deactivateStudent: (id) => api.patch(`/api/business/students/${id}/deactivate`),
    
    activateFaculty: (id) => api.patch(`/api/business/faculty/${id}/activate`),
    deactivateFaculty: (id) => api.patch(`/api/business/faculty/${id}/deactivate`),
    
    assignLabToFaculty: (facultyId, labId) => api.post(`/api/business/faculty/${facultyId}/laboratories`, { labId }),
    removeLabFromFaculty: (facultyId, labId) => api.delete(`/api/business/faculty/${facultyId}/laboratories/${labId}`),

    getReports: (reportType = '') => api.get(`/api/business/reports/${reportType}`),
    
    // Bookings
    getBookings: () => api.get('/api/business/bookings'),
    approveBooking: (id) => api.post(`/api/business/bookings/${id}/approve`),
    rejectBooking: (id, payload) => api.post(`/api/business/bookings/${id}/reject`, payload),
    approveBookingPost: (id) => api.post(`/api/business/bookings/${id}/approve`),
    rejectBookingPost: (id, reason) => api.post(`/api/business/bookings/${id}/reject`, { reason }),
    cancelBookingPost: (id) => api.post(`/api/business/bookings/${id}/cancel`),
    issueBookingPost: (id) => api.post(`/api/business/bookings/${id}/issue`),
    completeBookingPost: (id) => api.post(`/api/business/bookings/${id}/complete`),
    
    // Laboratories & Departments
    getLaboratories: () => api.get('/api/business/laboratories'),
    createLaboratory: (data) => api.post('/api/business/laboratories', data),
    updateLaboratory: (id, data) => api.put(`/api/business/laboratories/${id}`, data),
    deleteLaboratory: (id) => api.delete(`/api/business/laboratories/${id}`),
    activateLaboratory: (id) => api.patch(`/api/business/laboratories/${id}/activate`),
    deactivateLaboratory: (id) => api.patch(`/api/business/laboratories/${id}/deactivate`),

    getDepartments: () => api.get('/api/business/departments'),
    createDepartment: (data) => api.post('/api/business/departments', data),
    updateDepartment: (id, data) => api.put(`/api/business/departments/${id}`, data),
    deleteDepartment: (id) => api.delete(`/api/business/departments/${id}`),
    activateDepartment: (id) => api.patch(`/api/business/departments/${id}/activate`),
    deactivateDepartment: (id) => api.patch(`/api/business/departments/${id}/deactivate`),
    assignHOD: (deptId, hod) => api.patch(`/api/business/departments/${deptId}/hod`, { hod }),
    removeHOD: (deptId) => api.delete(`/api/business/departments/${deptId}/hod`),
    
    // Maintenance & Faults
    getMaintenance: () => api.get('/api/business/maintenance'),
    scheduleMaintenance: (data) => api.post('/api/business/maintenance', data),
    updateMaintenance: (id, data) => api.put(`/api/business/maintenance/${id}`, data),
    completeMaintenance: (id) => api.post(`/api/business/maintenance/${id}/complete`),
    deleteMaintenance: (id) => api.delete(`/api/business/maintenance/${id}`),
    rescheduleMaintenancePost: (id, date) => api.post(`/api/business/maintenance/${id}/schedule`, { scheduledDate: date }),
    startMaintenancePost: (id) => api.post(`/api/business/maintenance/${id}/start`),
    completeMaintenancePost: (id) => api.post(`/api/business/maintenance/${id}/complete`),
    cancelMaintenancePost: (id) => api.post(`/api/business/maintenance/${id}/cancel`),
    assignMaintenanceTechnician: (id, tech) => api.post(`/api/business/maintenance/${id}/assign`, { technician: tech }),

    getFaults: () => api.get('/api/business/faults'),
    assignFaultTechnician: (id, assignee) => api.post(`/api/business/faults/${id}/assign`, { assignee }),
    resolveFaultPost: (id) => api.post(`/api/business/faults/${id}/resolve`),
    resolveFault: (id) => api.post(`/api/business/faults/${id}/resolve`),
    rejectFaultPost: (id, reason) => api.post(`/api/business/faults/${id}/reject`, { reason }),
    cancelFaultPost: (id) => api.post(`/api/business/faults/${id}/cancel`),
    updateFaultStatus: (id, status) => api.post(`/api/business/faults/${id}/status`, { status }),
    
    // Notifications
    getNotifications: () => api.get('/api/business/notifications'),
    createNotification: (data) => api.post('/api/business/notifications', data),
    markNotificationAsRead: (id) => api.patch(`/api/business/notifications/${id}/read`),
    markNotificationRead: (id) => api.patch(`/api/business/notifications/${id}/read`), // alias
    markAllNotificationsRead: () => api.patch('/api/business/notifications/read-all'),
    clearAllNotifications: () => api.delete('/api/business/notifications/clear-all'),
    deleteNotification: (id) => api.delete(`/api/business/notifications/${id}`),
    
    // Equipment
    getEquipments: () => api.get('/api/business/equipments'),
    createEquipment: (data) => api.post('/api/business/equipments', data),
    updateEquipment: (id, data) => api.put(`/api/business/equipments/${id}`, data),
    deleteEquipment: (id) => api.delete(`/api/business/equipments/${id}`),
    changeEquipmentStatus: (id, status) => api.patch(`/api/business/equipments/${id}/status`, { status }),
    uploadEquipmentImage: (id, imageUrl) => api.put(`/api/business/equipments/${id}/image`, { imageUrl }),
    
    // Student Create/Delete
    createStudent: async (data) => {
        const authRes = await api.post('/api/auth/admin/student', {
            name: data.name,
            email: data.email,
            regNo: data.regNo || data.registerNo,
            dob: data.dob
        });
        
        const newUserId = authRes.data.userId || authRes.data.id;
        
        const bizRes = await api.post('/api/business/students', {
            studentId: newUserId,
            name: data.name,
            email: data.email,
            department: data.department || 'Computer Science & Engineering',
            year: parseInt(data.year) || 3,
            status: 'Active'
        });
        
        return { auth: authRes.data, business: bizRes.data };
    },
    
    deleteStudent: async (authId) => {
        const users = await adminService.getUsers();
        const user = users.find(u => u.id === authId || u.userId === authId);
        
        const promises = [api.delete(`/api/auth/admin/users/${authId}`)];
        if (user && user.studentId) {
            promises.push(api.delete(`/api/business/students/${user.studentId}`));
        }
        await Promise.all(promises);
    },
    
    // Faculty Create/Delete
    createFaculty: async (data) => {
        const authRes = await api.post('/api/auth/admin/faculty', {
            name: data.name,
            email: data.email,
            facultyId: data.facultyId,
            dob: data.dob
        });
        
        const newUserId = authRes.data.userId || authRes.data.id;
        
        const bizRes = await api.post('/api/business/faculty', {
            facultyId: newUserId,
            name: data.name,
            email: data.email,
            department: data.department || 'Computer Science & Engineering',
            designation: data.designation || 'Assistant Professor'
        });
        
        return { auth: authRes.data, business: bizRes.data };
    },
    
    updateStudent: async (authId, data) => {
        const users = await adminService.getUsers();
        const user = users.find(u => u.id === authId || u.userId === authId);
        
        const promises = [
            api.put(`/api/auth/admin/users/${authId}`, {
                name: data.name,
                email: data.email,
                regNo: data.regNo || data.registerNo
            })
        ];
        if (user && user.studentId) {
            promises.push(api.put(`/api/business/students/${user.studentId}`, {
                name: data.name,
                email: data.email,
                department: data.department,
                year: parseInt(data.year) || 3,
                status: data.status || 'Active'
            }));
        }
        await Promise.all(promises);
    },

    updateFaculty: async (authId, data) => {
        const users = await adminService.getUsers();
        const user = users.find(u => u.id === authId || u.userId === authId);
        
        const promises = [
            api.put(`/api/auth/admin/users/${authId}`, {
                name: data.name,
                email: data.email,
                facultyId: data.facultyId
            })
        ];
        if (user && user.facultyId) {
            promises.push(api.put(`/api/business/faculty/${user.facultyId}`, {
                name: data.name,
                email: data.email,
                department: data.department,
                designation: data.designation,
                status: data.status || 'ACTIVE',
                lab: data.lab || '-'
            }));
        }
        await Promise.all(promises);
    },
    
    deleteFaculty: async (authId) => {
        const users = await adminService.getUsers();
        const user = users.find(u => u.id === authId || u.userId === authId);
        
        const promises = [api.delete(`/api/auth/admin/users/${authId}`)];
        if (user && user.facultyId) {
            promises.push(api.delete(`/api/business/faculty/${user.facultyId}`));
        }
        await Promise.all(promises);
    },
    
    // Auth account control
    activateUser: (id) => api.patch(`/api/auth/admin/users/${id}/activate`),
    deactivateUser: (id) => api.patch(`/api/auth/admin/users/${id}/deactivate`),
    resetUserPassword: (id, newPassword) => api.post(`/api/auth/admin/users/${id}/reset-password`, { newPassword }),
    
    // CSV Imports/Exports
    exportStudents: () => api.get('/api/business/students/export'),
    importStudents: (data) => api.post('/api/business/students/import', data),
    exportFaculty: () => api.get('/api/business/faculty/export'),
    importFaculty: (data) => api.post('/api/business/faculty/import', data),
    exportEquipment: () => api.get('/api/business/equipments/export'),
    importEquipment: (data) => api.post('/api/business/equipments/import', data)
};

export default adminService;
