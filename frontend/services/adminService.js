import api from './api';

export const adminService = {
    getDashboard: () => api.get('/api/business/dashboard/admin'),
    
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
            
            const authUsers = authRes?.data || authRes || [];
            const students = studentsRes?.data || studentsRes || [];
            const faculty = facultyRes?.data || facultyRes || [];

            // If authUsers is empty (e.g. non-admin or auth service endpoint issue), fallback to combining business students and faculty
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
    
    getReports: (reportType = '') => api.get(`/api/business/reports/${reportType}`),
    
    // Bookings
    getBookings: () => api.get('/api/business/bookings'),
    approveBooking: (id) => api.put(`/api/business/bookings/${id}/approve`),
    rejectBooking: (id) => api.put(`/api/business/bookings/${id}/reject`),
    
    // Laboratories & Departments
    getLaboratories: () => api.get('/api/business/laboratories'),
    createLaboratory: (data) => api.post('/api/business/laboratories', data),
    updateLaboratory: (id, data) => api.put(`/api/business/laboratories/${id}`, data),
    deleteLaboratory: (id) => api.delete(`/api/business/laboratories/${id}`),

    getDepartments: () => api.get('/api/business/departments'),
    createDepartment: (data) => api.post('/api/business/departments', data),
    updateDepartment: (id, data) => api.put(`/api/business/departments/${id}`, data),
    deleteDepartment: (id) => api.delete(`/api/business/departments/${id}`),
    
    // Maintenance & Faults
    getMaintenance: () => api.get('/api/business/maintenance'),
    scheduleMaintenance: (data) => api.post('/api/business/maintenance', data),
    updateMaintenance: (id, data) => api.put(`/api/business/maintenance/${id}`, data),
    completeMaintenance: (id) => api.put(`/api/business/maintenance/${id}/complete`),
    deleteMaintenance: (id) => api.delete(`/api/business/maintenance/${id}`),
    getFaults: () => api.get('/api/business/faults'),
    
    // Notifications
    getNotifications: () => api.get('/api/business/notifications'),
    createNotification: (data) => api.post('/api/business/notifications', data),
    markNotificationAsRead: (id) => api.put(`/api/business/notifications/${id}/read`),
    deleteNotification: (id) => api.delete(`/api/business/notifications/${id}`),
    
    // Equipment
    getEquipments: () => api.get('/api/business/equipments'),
    createEquipment: (data) => api.post('/api/business/equipments', data),
    updateEquipment: (id, data) => api.put(`/api/business/equipments/${id}`, data),
    deleteEquipment: (id) => api.delete(`/api/business/equipments/${id}`),
    
    // Student
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
    
    // Faculty
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
    }
};

export default adminService;
