import api from './api';

export const studentService = {
    getEquipmentList: () => api.get('/api/business/equipments/available-for-student'),
    createBooking: (bookingData) => api.post('/api/business/bookings', bookingData),
    getMyBookings: (arg, params = {}) => {
        if (arg && typeof arg === 'object') {
            return api.get('/api/business/bookings/my-bookings', { params: arg });
        }
        return api.get('/api/business/bookings/my-bookings', { params });
    },
    getMyBookingsAll: () => api.get('/api/business/bookings/my-bookings/all'),
    getMyBookingsPending: () => api.get('/api/business/bookings/my-bookings/pending'),
    getMyBookingsApproved: () => api.get('/api/business/bookings/my-bookings/approved'),
    getMyBookingsRejected: () => api.get('/api/business/bookings/my-bookings/rejected'),
    getMyBookingsCompleted: () => api.get('/api/business/bookings/my-bookings/completed'),
    getMyBookingsCancelled: () => api.get('/api/business/bookings/my-bookings/cancelled'),
    reportFault: (faultData) => api.post('/api/business/faults', faultData),
    getMyFaultReports: (id) => api.get(`/api/business/faults/student/${id}/faults-list`),
    
    // Action-specific cancellation endpoints
    cancelBooking: (id) => api.post(`/api/business/bookings/${id}/cancel`),
    cancelBookingPost: (id) => api.post(`/api/business/bookings/${id}/cancel`),
    cancelFaultReport: (id) => api.post(`/api/business/faults/${id}/cancel`),
    cancelFaultReportPost: (id) => api.post(`/api/business/faults/${id}/cancel`),
    
    getProfile: (id) => api.get(`/api/business/students/${id}`),
    updateProfile: (id, data) => api.put(`/api/business/students/${id}`, data),
    
    // Notifications
    getMyNotifications: (id) => api.get(`/api/business/notifications/user/${id}/notifications-list`),
    getUnreadNotifications: () => api.get('/api/business/notifications/unread'),
    getUnreadCount: () => api.get('/api/business/notifications/count'),
    markNotificationRead: (id) => api.patch(`/api/business/notifications/${id}/read`),
    markAllNotificationsRead: () => api.patch('/api/business/notifications/read-all'),
    clearAllNotifications: () => api.delete('/api/business/notifications/clear-all'),
    deleteNotification: (id) => api.delete(`/api/business/notifications/${id}`),
    
    // Dashboard & Details
    getDashboard: () => api.get('/api/business/dashboard/student'),
    getDashboardStudentSummary: () => api.get('/api/business/dashboard/student/summary'),
    getDashboardStudentBookings: () => api.get('/api/business/dashboard/student/bookings'),
    getDashboardStudentFaults: () => api.get('/api/business/dashboard/student/faults'),
    
    getSlotAvailability: (equipmentId, date) => api.get(`/api/business/bookings/availability`, { params: { equipmentId, date } })
};

export default studentService;
