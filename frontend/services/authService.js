import api from './api';

export const authService = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    registerStudent: (data) => api.post('/api/auth/student/register', data),
    registerFaculty: (data) => api.post('/api/auth/faculty/register', data),
    verifyOtp: (email, otp, newPassword) => api.post('/api/auth/verify-otp', { email, otp, newPassword }),
    resendOtp: (email) => api.post('/api/auth/resend-otp', { email }),
    requestForgotPassword: (email) => api.post('/api/auth/forgot-password/request-otp', { email }),
    verifyForgotPasswordOtp: (email, otp) => api.post('/api/auth/forgot-password/verify-otp', { email, otp }),
    resendForgotPasswordOtp: (email) => api.post('/api/auth/forgot-password/resend-otp', { email }),
    resetPassword: (email, newPassword) => api.post('/api/auth/forgot-password/reset', { email, newPassword }),
    changePassword: (email, currentPassword, newPassword) =>
        api.post('/api/auth/change-password', { email, currentPassword, newPassword }),
    updateProfile: (currentEmail, newEmail, name, phone, designation) =>
        api.post('/api/auth/update-profile', { currentEmail, newEmail, name, phone, designation }),
    logout: () => api.post('/api/auth/logout')
};

export default authService;
