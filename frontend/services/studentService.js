import api from './api';

export const studentService = {
    getEquipmentList: () => api.get('/api/business/equipments'),
    createBooking: (bookingData) => api.post('/api/business/bookings', bookingData),
    getMyBookings: (id) => api.get(`/api/business/bookings/student/${id}`),
    reportFault: (faultData) => api.post('/api/business/faults', faultData),
    getMyFaultReports: (id) => api.get(`/api/business/faults/student/${id}`),
    cancelBooking: (id) => api.delete(`/api/business/bookings/${id}`),
    getProfile: (id) => api.get(`/api/business/students/${id}`),
    getMyNotifications: (id) => api.get(`/api/business/notifications/user/${id}?role=STUDENT`),
    markNotificationRead: (id) => api.put(`/api/business/notifications/${id}/read`),
    getDashboard: (id) => api.get(`/api/business/dashboard/student/${id}`),
    updateProfile: (id, data) => api.put(`/api/business/students/${id}`, data)
};

export default studentService;
