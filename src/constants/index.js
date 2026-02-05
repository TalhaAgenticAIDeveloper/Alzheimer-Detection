// API Configuration
export const API_BASE_URL = "http://localhost:8000";

// Application Constants
export const APP_NAME = "NeuroCare AI";
export const APP_DESCRIPTION =
  "Advanced AI technology for early Alzheimer detection";

// Validation Constants
export const MIN_PASSWORD_LENGTH = 8;
export const OTP_LENGTH = 6;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User Roles (2-role system: only admin and doctor)
export const USER_ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  // USER role removed - public signup disabled
};

// Image Types
export const IMAGE_TYPES = {
  MRI: "mri",
  EEG: "eeg",
};

// Medical Degrees
export const MEDICAL_DEGREES = [
  { value: "MD", label: "MD" },
  { value: "MBBS", label: "MBBS" },
  { value: "DM", label: "DM" },
  { value: "DNB", label: "DNB" },
];

// Gender Options
export const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  REMEMBER_ME: "rememberMe",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  INVALID_EMAIL: "Please provide a valid email address",
  EMPTY_PASSWORD: "Password cannot be empty",
  PASSWORD_TOO_SHORT:
    "Password must be at least 8 characters long for security purposes.",
  PASSWORDS_DONT_MATCH:
    "Password and confirm password do not match. Please ensure both passwords are identical.",
  REQUIRED_FIELD: "This field is required",
  SIGNUP_DISABLED:
    "Public signup is disabled. Only administrators can create accounts in this system.",
  ACCOUNT_NOT_FOUND: "Contact an administrator to create your account",
};

export default {
  API_BASE_URL,
  APP_NAME,
  APP_DESCRIPTION,
  MIN_PASSWORD_LENGTH,
  OTP_LENGTH,
  EMAIL_REGEX,
  USER_ROLES,
  IMAGE_TYPES,
  MEDICAL_DEGREES,
  GENDER_OPTIONS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
};
