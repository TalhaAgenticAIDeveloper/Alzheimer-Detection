import { API_BASE_URL, STORAGE_KEYS } from "../constants";

const API_BASE_URL_CONST = API_BASE_URL;

class ApiService {
  // Helper method to get stored token
  static getToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Helper method to store token
  static setToken(token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  // Helper method to remove token
  static removeToken() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Helper method to make API requests
  static async makeRequest(url, options = {}) {
    const config = {
      headers: {},
      ...options,
    };

    // Don't set Content-Type for FormData, let browser handle it
    if (!(options.body instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    // Merge additional headers
    config.headers = {
      ...config.headers,
      ...options.headers,
    };

    // Add authorization header if token exists and not already provided
    const token = this.getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL_CONST}${url}`, config);

      // Handle non-JSON responses (network errors, server errors)
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(
          response.status === 404
            ? "Service not available. Please try again later."
            : "Network error occurred. Please check your connection.",
        );
      }

      if (!response.ok) {
        // Extract specific error message from backend
        const errorMessage =
          data.detail || data.message || data.error || "An error occurred";
        throw new Error(errorMessage);
      }

      return { success: true, data };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: error.message || "Network error occurred",
        status: error.status,
      };
    }
  }

  // Authentication APIs
  static async login(credentials) {
    const result = await this.makeRequest("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Store token if login successful
    if (result.success && result.data.access_token) {
      this.setToken(result.data.access_token);
    }

    return result;
  }

  static async forgotPassword(email) {
    return this.makeRequest("/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(resetData) {
    return this.makeRequest("/reset-password", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  }

  // User Profile API
  static async getProfile() {
    return this.makeRequest("/profile", {
      method: "GET",
    });
  }

  // Admin-Only APIs
  static async getDoctors() {
    return this.makeRequest("/admin/doctors", {
      method: "GET",
    });
  }

  static async createDoctor(doctorData) {
    return this.makeRequest("/admin/create-doctor", {
      method: "POST",
      body: JSON.stringify(doctorData),
    });
  }

  // OTP Verification APIs
  static async sendDoctorVerificationOTP(email) {
    return this.makeRequest("/admin/send-doctor-verification-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  static async verifyDoctorEmail(email, otp) {
    return this.makeRequest("/admin/verify-doctor-email", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  static async deleteDoctor(doctorId) {
    return this.makeRequest(`/admin/doctors/${doctorId}`, {
      method: "DELETE",
    });
  }

  // Doctor-Only APIs
  // Profile Management
  static async getDoctorProfile() {
    return this.makeRequest("/doctor/profile", {
      method: "GET",
    });
  }

  static async updateDoctorProfile(profileData) {
    return this.makeRequest("/doctor/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Patient History
  static async getPatientsHistory() {
    return this.makeRequest("/doctor/patients-history", {
      method: "GET",
    });
  }

  static async getPatientVisits(patientId) {
    return this.makeRequest(`/doctor/patients/${patientId}/visits`, {
      method: "GET",
    });
  }

  // MRI Scanning & AI Detection
  static async scanMRI(patientData, imageFile) {
    const formData = new FormData();
    formData.append("patient_name", patientData.name);
    formData.append("mobile_number", patientData.mobile);
    formData.append("age", patientData.age.toString());
    if (patientData.gender) {
      formData.append("gender", patientData.gender);
    }
    formData.append("file", imageFile);

    return this.makeRequest("/doctor/scan-mri", {
      method: "POST",
      body: formData,
    });
  }

  static async getScanResults(scanId) {
    return this.makeRequest(`/doctor/scans/${scanId}`, {
      method: "GET",
    });
  }

  // Legacy APIs (keeping for backward compatibility)
  static async createPatient(patientData) {
    return this.makeRequest("/doctor/patients", {
      method: "POST",
      body: JSON.stringify(patientData),
    });
  }

  // Legacy APIs (continued - keeping for backward compatibility)
  static async getPatients() {
    return this.makeRequest("/doctor/patients", {
      method: "GET",
    });
  }

  static async uploadMRIImage(patientId, file, description = "") {
    const formData = new FormData();
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    return this.makeRequest(`/doctor/patients/${patientId}/upload-mri`, {
      method: "POST",
      body: formData,
    });
  }

  static async uploadEEGImage(patientId, file, description = "") {
    const formData = new FormData();
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    return this.makeRequest(`/doctor/patients/${patientId}/upload-eeg`, {
      method: "POST",
      body: formData,
    });
  }

  static async getPatientImages(patientId) {
    return this.makeRequest(`/doctor/patients/${patientId}/images`, {
      method: "GET",
    });
  }

  static async deletePatient(patientId) {
    return this.makeRequest(`/doctor/patients/${patientId}`, {
      method: "DELETE",
    });
  }

  // Statistics APIs
  static async getDementiaStatistics() {
    return this.makeRequest("/admin/statistics/dementia-classification", {
      method: "GET",
    });
  }

  // Role-based access control helper
  static async requireRole(requiredRole) {
    const profileResult = await this.getProfile();

    if (!profileResult.success) {
      throw new Error("Authentication required");
    }

    const userRole = profileResult.data.role;

    if (requiredRole === "admin" && userRole !== "admin") {
      throw new Error("Admin access required");
    }

    if (requiredRole === "doctor" && !["admin", "doctor"].includes(userRole)) {
      throw new Error("Doctor access required");
    }

    return profileResult.data;
  }

  // Logout method
  static logout() {
    this.removeToken();
    localStorage.removeItem("userData");
  }
}

export default ApiService;
