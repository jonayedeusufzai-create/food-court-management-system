/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid flag and message
 */
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const maxLength = 128;
  
  // Check length
  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }
  
  if (password.length > maxLength) {
    return {
      isValid: false,
      message: `Password must be no more than ${maxLength} characters long`
    };
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  // Check for number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  // Check for common passwords (simplified check)
  const commonPasswords = [
    'password', '12345678', 'qwerty123', 'admin123', 'welcome123'
  ];
  
  const lowerPassword = password.toLowerCase();
  for (const common of commonPasswords) {
    if (lowerPassword.includes(common)) {
      return {
        isValid: false,
        message: 'Password is too common. Please choose a stronger password.'
      };
    }
  }
  
  return {
    isValid: true,
    message: 'Password is strong'
  };
};

module.exports = {
  validatePasswordStrength
};