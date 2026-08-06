import api from './api';

export const facultyService = {
    approveBooking: (id) => api.put(`/api/business/bookings/${id}/approve`),
    rejectBooking: (id) => api.put(`/api/business/bookings/${id}/reject`),
    updateFaultStatus: (id, status) => api.put(`/api/business/faults/${id}/status`, { status }),
    getMaintenance: () => api.get('/api/business/maintenance'),
    getDashboard: (id) => api.get(`/api/business/dashboard/faculty/${id}`),
    getBookings: () => api.get('/api/business/bookings'),
    getEquipments: () => api.get('/api/business/equipments'),
    getReportsSummary: () => api.get('/api/business/reports/summary'),
    getNotifications: (id) => api.get(`/api/business/notifications/user/${id}?role=FACULTY`),
    markNotificationRead: (id) => api.put(`/api/business/notifications/${id}/read`),
    getProfile: (id) => api.get(`/api/business/faculty/${id}`),
    updateProfile: (id, data) => api.put(`/api/business/faculty/${id}`, data),
    getLabs: () => api.get('/api/business/laboratories'),
    createLab: (data) => api.post('/api/business/laboratories', data),
    updateLab: (id, data) => api.put(`/api/business/laboratories/${id}`, data),
    deleteLab: (id) => api.delete(`/api/business/laboratories/${id}`),
    // Equipment
    getAllEquipments: () => api.get('/api/business/equipments'),
    createEquipment: (data) => api.post('/api/business/equipments', data),
    updateEquipment: (id, data) => api.put(`/api/business/equipments/${id}`, data),
    deleteEquipment: (id) => api.delete(`/api/business/equipments/${id}`),
    // Maintenance
    getAllMaintenance: () => api.get('/api/business/maintenance'),
    createMaintenance: (data) => api.post('/api/business/maintenance', data),
    updateMaintenance: (id, data) => api.put(`/api/business/maintenance/${id}`, data),
    completeMaintenance: (id) => api.put(`/api/business/maintenance/${id}/complete`),
    // Reports
    getReportSummary: () => api.get('/api/business/reports/summary'),
    getEquipmentUsageReport: () => api.get('/api/business/reports/equipment-usage'),
    getAnalyticsReport: () => api.get('/api/business/reports/analytics')
};

export default facultyService;
