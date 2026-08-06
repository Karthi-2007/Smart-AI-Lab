export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

export const validateRegNo = (regNo) => {
  if (!regNo) return 'Registration number is required';
  if (regNo.trim().length < 3) return 'Registration number is too short';
  return '';
};

export const validateFacultyId = (facultyId) => {
  if (!facultyId) return 'Faculty ID is required';
  if (facultyId.trim().length < 3) return 'Faculty ID is too short';
  return '';
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};
