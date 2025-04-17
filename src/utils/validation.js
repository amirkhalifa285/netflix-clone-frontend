// Email validation with regex
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Phone number validation
  export const isValidPhone = (phone) => {
    // Basic phone validation - could be enhanced based on specific requirements
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone.replace(/[-()\s]/g, ''));
  };
  
  // Password validation
  export const isValidPassword = (password) => {
    // At least 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  
  // Check if email or phone
  export const isEmailOrPhone = (value) => {
    if (isValidEmail(value)) return 'email';
    if (isValidPhone(value)) return 'phone';
    return null;
  };
  
  // Validate registration form
  export const validateRegistration = (values) => {
    const errors = {};
    
    // Email or phone validation
    if (!values.emailOrPhone) {
      errors.emailOrPhone = 'Email or phone number is required';
    } else {
      const type = isEmailOrPhone(values.emailOrPhone);
      if (!type) {
        errors.emailOrPhone = 'Please enter a valid email or phone number';
      }
    }
    
    // Password validation
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(values.password)) {
      errors.password = 'Password must be at least 8 characters and include at least one letter and one number';
    }
    
    // Role validation (if applicable)
    if (values.role && !['admin', 'user'].includes(values.role)) {
      errors.role = 'Please select a valid role';
    }
    
    return errors;
  };
  
  // Validate login form
  export const validateLogin = (values) => {
    const errors = {};
    
    if (!values.emailOrPhone) {
      errors.emailOrPhone = 'Email or phone number is required';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };