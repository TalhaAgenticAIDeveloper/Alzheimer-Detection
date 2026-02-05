import { STORAGE_KEYS } from "../constants";

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} - Stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
};

/**
 * Clear all storage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

/**
 * Get auth token from storage
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
  return getStorageItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Set auth token in storage
 * @param {string} token - Auth token
 */
export const setAuthToken = (token) => {
  setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Remove auth token from storage
 */
export const removeAuthToken = () => {
  removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get user data from storage
 * @returns {object|null} - User data or null
 */
export const getUserData = () => {
  return getStorageItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Set user data in storage
 * @param {object} userData - User data
 */
export const setUserData = (userData) => {
  setStorageItem(STORAGE_KEYS.USER_DATA, userData);
};

/**
 * Remove user data from storage
 */
export const removeUserData = () => {
  removeStorageItem(STORAGE_KEYS.USER_DATA);
};
