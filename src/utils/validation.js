import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from "../constants";

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  let isValid = true;

  if (!password) {
    errors.push("Password is required");
    isValid = false;
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    );
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * Validates if two passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean} - True if passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validates OTP format (6 digits)
 * @param {string} otp - OTP to validate
 * @returns {boolean} - True if valid OTP format
 */
export const isValidOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validates required field
 * @param {string} value - Value to validate
 * @returns {boolean} - True if not empty
 */
export const isRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

/**
 * Validates age (must be positive number)
 * @param {number|string} age - Age to validate
 * @returns {boolean} - True if valid age
 */
export const isValidAge = (age) => {
  const numAge = parseInt(age, 10);
  return !isNaN(numAge) && numAge > 0 && numAge < 150;
};

/**
 * Validates experience years (must be non-negative number)
 * @param {number|string} years - Years to validate
 * @returns {boolean} - True if valid experience
 */
export const isValidExperience = (years) => {
  const numYears = parseInt(years, 10);
  return !isNaN(numYears) && numYears >= 0 && numYears < 100;
};
