import ApiService from "../services/api";
import { USER_ROLES } from "../constants";

// Role-based access control utility
export class RoleBasedAccess {
  /**
   * Check if user has required role
   * @param {string} userRole - Current user's role
   * @param {string} requiredRole - Required role for access
   * @returns {boolean} - Whether user has access
   */
  static hasAccess(userRole, requiredRole) {
    if (!userRole || !requiredRole) return false;

    // Admin has access to everything
    if (userRole === USER_ROLES.ADMIN) return true;

    // Check specific role requirements
    switch (requiredRole) {
      case USER_ROLES.ADMIN:
        return userRole === USER_ROLES.ADMIN;
      case USER_ROLES.DOCTOR:
        return [USER_ROLES.ADMIN, USER_ROLES.DOCTOR].includes(userRole);
      default:
        return false;
    }
  }

  /**
   * Get user profile and validate authentication
   * @returns {Promise<Object>} - User profile data
   */
  static async getCurrentUser() {
    try {
      const result = await ApiService.getProfile();

      if (result.success) {
        return {
          success: true,
          user: result.data,
          isAuthenticated: true,
        };
      } else {
        return {
          success: false,
          error: result.error,
          isAuthenticated: false,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to get user profile",
        isAuthenticated: false,
      };
    }
  }

  /**
   * Redirect user to appropriate dashboard based on role
   * @param {string} userRole - User's role
   * @returns {string} - Dashboard route
   */
  static getDashboardRoute(userRole) {
    switch (userRole) {
      case USER_ROLES.ADMIN:
        return "admin";
      case USER_ROLES.DOCTOR:
        return "doctor";
      default:
        return "login";
    }
  }

  /**
   * Check if user can perform specific actions
   * @param {string} userRole - User's role
   * @param {string} action - Action to perform
   * @returns {boolean} - Whether user can perform action
   */
  static canPerformAction(userRole, action) {
    const permissions = {
      [USER_ROLES.ADMIN]: [
        "create_doctor",
        "delete_doctor",
        "view_doctors",
        "manage_users",
      ],
      [USER_ROLES.DOCTOR]: [
        "create_patient",
        "view_patients",
        "upload_mri",
        "upload_eeg",
        "view_patient_images",
      ],
    };

    return permissions[userRole]?.includes(action) || false;
  }
}

// Error handling for authentication
export class AuthError extends Error {
  constructor(message, code = "AUTH_ERROR") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

// Token management utilities
export class TokenManager {
  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} - Whether token is expired
   */
  static isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {Date|null} - Expiration date or null
   */
  static getTokenExpiration(token) {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Auto-logout when token expires
   */
  static setupAutoLogout(onLogout) {
    const token = ApiService.getToken();
    if (!token) return;

    const expiration = this.getTokenExpiration(token);
    if (!expiration) return;

    const timeUntilExpiry = expiration.getTime() - Date.now();

    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        ApiService.logout();
        if (onLogout) onLogout();
      }, timeUntilExpiry);
    }
  }
}

// Route protection hook
export const useRouteProtection = (requiredRole, currentUser) => {
  const hasAccess = RoleBasedAccess.hasAccess(currentUser?.role, requiredRole);
  const isAuthenticated = !!currentUser;

  return {
    hasAccess,
    isAuthenticated,
    shouldRedirect: !isAuthenticated || !hasAccess,
    redirectTo: !isAuthenticated ? "login" : "unauthorized",
  };
};

export default {
  RoleBasedAccess,
  AuthError,
  TokenManager,
  useRouteProtection,
};
