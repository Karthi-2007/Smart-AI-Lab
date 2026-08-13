import api from './api';

export const facultyService = {
    approveBooking: (id) => api.post(`/api/business/bookings/${id}/approve`),
    rejectBooking: (id, payload) => api.post(`/api/business/bookings/${id}/reject`, payload),
    updateFaultStatus: (id, status) => api.patch(`/api/business/faults/${id}/status`, { status }),
    
    // Detailed POST mapping events
    approveBookingPost: (id) => api.post(`/api/business/bookings/${id}/approve`),
    rejectBookingPost: (id, reason) => api.post(`/api/business/bookings/${id}/reject`, { reason }),
    issueBookingPost: (id) => api.post(`/api/business/bookings/${id}/issue`),
    completeBookingPost: (id) => api.post(`/api/business/bookings/${id}/complete`),
    cancelBookingPost: (id) => api.post(`/api/business/bookings/${id}/cancel`),
    
    // Fault events
    assignFaultTechnician: (id, assignee) => api.post(`/api/business/faults/${id}/assign`, { assignee }),
    resolveFaultPost: (id) => api.post(`/api/business/faults/${id}/resolve`),
    rejectFaultPost: (id, reason) => api.post(`/api/business/faults/${id}/reject`, { reason }),
    cancelFaultPost: (id) => api.post(`/api/business/faults/${id}/cancel`),
    
    // Maintenance events
    rescheduleMaintenancePost: (id, date) => api.post(`/api/business/maintenance/${id}/schedule`, { scheduledDate: date }),
    startMaintenancePost: (id) => api.post(`/api/business/maintenance/${id}/start`),
    completeMaintenancePost: (id) => api.post(`/api/business/maintenance/${id}/complete`),
    cancelMaintenancePost: (id) => api.post(`/api/business/maintenance/${id}/cancel`),
    assignMaintenanceTechnician: (id, tech) => api.post(`/api/business/maintenance/${id}/assign`, { technician: tech }),
    
    // Dashboard & Details
    getDashboard: () => api.get('/api/business/dashboard/faculty'),
    getDashboardFacultySummary: () => api.get('/api/business/dashboard/faculty/summary'),
    getDashboardFacultyBookings: () => api.get('/api/business/dashboard/faculty/bookings'),
    getDashboardFacultyEquipment: () => api.get('/api/business/dashboard/faculty/equipment'),
    getDashboardFacultyFaults: () => api.get('/api/business/dashboard/faculty/faults'),
    getDashboardFacultyMaintenance: () => api.get('/api/business/dashboard/faculty/maintenance'),
    
    getMaintenance: () => api.get('/api/business/maintenance'),
    getMaintenanceAll: () => api.get('/api/business/maintenance/all'),
    getMaintenanceScheduled: () => api.get('/api/business/maintenance/scheduled'),
    getMaintenanceInProgress: () => api.get('/api/business/maintenance/in-progress'),
    getMaintenanceCompleted: () => api.get('/api/business/maintenance/completed'),
    getBookings: () => api.get('/api/business/bookings'),
    getReviewQueueAll: () => api.get('/api/business/bookings/my-review-queue/all'),
    getReviewQueuePending: () => api.get('/api/business/bookings/my-review-queue/pending'),
    getReviewQueueApproved: () => api.get('/api/business/bookings/my-review-queue/approved'),
    getReviewQueueRejected: () => api.get('/api/business/bookings/my-review-queue/rejected'),
    getReviewQueueCompleted: () => api.get('/api/business/bookings/my-review-queue/completed'),
    getEquipments: () => api.get('/api/business/equipments'),
    getEquipmentsAll: () => api.get('/api/business/equipments/all'),
    getEquipmentsAvailable: () => api.get('/api/business/equipments/available'),
    getEquipmentsUnderMaintenance: () => api.get('/api/business/equipments/under-maintenance'),
    getEquipmentsFaulty: () => api.get('/api/business/equipments/faulty'),
    markEquipmentAvailable: (id) => api.put(`/api/business/equipments/${id}/mark-available`),
    markEquipmentBooked: (id) => api.put(`/api/business/equipments/${id}/mark-booked`),
    markEquipmentMaintenance: (id) => api.put(`/api/business/equipments/${id}/mark-maintenance`),
    markEquipmentFaulty: (id) => api.put(`/api/business/equipments/${id}/mark-faulty`),
    getReportsSummary: () => api.get('/api/business/reports/summary'),
    
    // Notifications
    getNotifications: (id) => api.get(`/api/business/notifications/user/${id}/notifications-list`),
    getNotificationsAll: () => api.get('/api/business/notifications/all'),
    getNotificationsBooking: () => api.get('/api/business/notifications/booking'),
    getNotificationsEquipment: () => api.get('/api/business/notifications/equipment'),
    getNotificationsMaintenance: () => api.get('/api/business/notifications/maintenance'),
    getUnreadNotifications: () => api.get('/api/business/notifications/unread'),
    getUnreadCount: () => api.get('/api/business/notifications/count'),
    markNotificationRead: (id) => api.patch(`/api/business/notifications/${id}/read`),
    markAllNotificationsRead: () => api.patch('/api/business/notifications/read-all'),
    clearAllNotifications: () => api.delete('/api/business/notifications/clear-all'),
    deleteNotification: (id) => api.delete(`/api/business/notifications/${id}`),
    
    getProfile: (id) => api.get(`/api/business/faculty/${id}`),
    updateProfile: (id, data) => api.put(`/api/business/faculty/${id}`, data),
    
    // Labs CRUD
    getLabs: () => api.get('/api/business/laboratories'),
    getMyLabs: (search) => api.get('/api/business/laboratories/my-labs', { params: search ? { search } : {} }),
    createLab: (data) => api.post('/api/business/laboratories', data),
    updateLab: (id, data) => api.put(`/api/business/laboratories/${id}`, data),
    deleteLab: (id) => api.delete(`/api/business/laboratories/${id}`),
    
    // Equipment CRUD
    getAllEquipments: () => api.get('/api/business/equipments'),
    createEquipment: (data) => api.post('/api/business/equipments', data),
    updateEquipment: (id, data) => api.put(`/api/business/equipments/${id}`, data),
    deleteEquipment: (id) => api.delete(`/api/business/equipments/${id}`),
    changeEquipmentStatus: (id, status) => api.patch(`/api/business/equipments/${id}/status`, { status }),
    uploadEquipmentImage: (id, imageUrl) => api.put(`/api/business/equipments/${id}/image`, { imageUrl }),
    
    // Maintenance CRUD
    getAllMaintenance: () => api.get('/api/business/maintenance'),
    createMaintenance: (data) => api.post('/api/business/maintenance', data),
    updateMaintenance: (id, data) => api.put(`/api/business/maintenance/${id}`, data),
    completeMaintenance: (id) => api.post(`/api/business/maintenance/${id}/complete`),
    
    // Reports
    getReportSummary: () => api.get('/api/business/reports/summary'),
    getEquipmentUsageReport: () => api.get('/api/business/reports/equipment-usage'),
    getAnalyticsReport: () => api.get('/api/business/reports/analytics'),
    getFacultyFaultReports: (params) => api.get('/api/business/faults/faculty/my-reports', { params }),
    getFacultyFaultSummary: () => api.get('/api/business/faults/faculty/summary')
};

export default facultyService;
