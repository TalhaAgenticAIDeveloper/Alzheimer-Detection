import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  LogOut,
  Plus,
  Users,
  Upload,
  Eye,
  Calendar,
  User,
  Activity,
  Image as ImageIcon,
  FileText,
  Search,
  Trash2,
} from "lucide-react";
import ApiService from "../../services/api";
import PatientFormModal from "../../components/modals/PatientFormModal";
import ImageUploadModal from "../../components/modals/ImageUploadModal";
import { IMAGE_TYPES } from "../../constants";

function DoctorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(() => {
    // Load active tab from localStorage on mount
    return localStorage.getItem("doctorDashboardActiveTab") || "profile";
  });

  // Profile Management
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Patient History
  const [patientsHistory, setPatientsHistory] = useState([]);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // MRI Scanning
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  // Legacy patient management (keeping for backward compatibility)
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientImages, setPatientImages] = useState([]);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalType, setImageModalType] = useState("mri");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDoctorProfile();
    loadPatientsHistory();
    fetchPatients(); // Legacy
  }, []);

  // Refresh patient history when history tab is visited
  useEffect(() => {
    if (activeTab === "history" && !selectedPatientHistory) {
      loadPatientsHistory();
    }
  }, [activeTab, selectedPatientHistory]);

  // Persist active tab to localStorage on change
  useEffect(() => {
    localStorage.setItem("doctorDashboardActiveTab", activeTab);
  }, [activeTab]);

  // Profile Management Functions
  const loadDoctorProfile = async () => {
    setProfileLoading(true);
    setProfileError("");

    try {
      const result = await ApiService.getDoctorProfile();

      if (result.success) {
        setDoctorProfile(result.data);
      } else {
        setProfileError(result.error || "Failed to load profile");
      }
    } catch (error) {
      setProfileError("Network error occurred");
      console.error("Error loading profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setProfileLoading(true);
    setProfileError("");

    try {
      const result = await ApiService.updateDoctorProfile(profileData);

      if (result.success) {
        await loadDoctorProfile(); // Reload profile
        setError(""); // Clear any previous errors
      } else {
        setProfileError(result.error || "Failed to update profile");
      }
    } catch (error) {
      setProfileError("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Patient History Functions
  const loadPatientsHistory = async () => {
    setHistoryLoading(true);
    setError("");

    try {
      const result = await ApiService.getPatientsHistory();

      if (result.success) {
        setPatientsHistory(result.data || []);
      } else {
        setError(result.error || "Failed to load patient history");
      }
    } catch (error) {
      setError("Network error occurred");
      console.error("Error loading patient history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadPatientVisits = async (patientId) => {
    setHistoryLoading(true);

    try {
      const result = await ApiService.getPatientVisits(patientId);

      if (result.success) {
        setPatientVisits(result.data || []);
      } else {
        setError(result.error || "Failed to load patient visits");
      }
    } catch (error) {
      setError("Failed to load patient visits");
      console.error("Error loading patient visits:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this patient? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const result = await ApiService.deletePatient(patientId);

      if (result.success) {
        setError(""); // Clear any previous errors
        setSelectedPatientHistory(null); // Close patient details if viewing them
        await loadPatientsHistory(); // Reload the patient history
      } else {
        setError(result.error || "Failed to delete patient");
      }
    } catch (error) {
      setError("Failed to delete patient");
      console.error("Error deleting patient:", error);
    }
  };

  // MRI Scanning Function
  const handleMRIScan = async (patientData, imageFile) => {
    setScanLoading(true);
    setScanResult(null);
    setError("");

    try {
      const result = await ApiService.scanMRI(patientData, imageFile);

      if (result.success) {
        setScanResult(result.data);
      } else {
        setError(result.error || "Failed to process MRI scan");
      }
    } catch (error) {
      setError("Failed to process MRI scan");
      console.error("Error processing MRI scan:", error);
    } finally {
      setScanLoading(false);
    }
  };

  // Legacy Functions (keeping for backward compatibility)
  const fetchPatients = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await ApiService.getPatients();

      if (result.success) {
        setPatients(result.data || []);
      } else {
        setError(result.error || "Failed to fetch patients");
      }
    } catch (error) {
      setError("Network error occurred");
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientImages = async (patientId) => {
    try {
      const result = await ApiService.getPatientImages(patientId);

      if (result.success) {
        setPatientImages(result.data || []);
      } else {
        setError(result.error || "Failed to fetch patient images");
      }
    } catch (error) {
      setError("Failed to fetch patient images");
      console.error("Error fetching patient images:", error);
    }
  };

  const handleCreatePatient = async (patientData) => {
    try {
      const result = await ApiService.createPatient(patientData);

      if (result.success) {
        await fetchPatients();
        setShowPatientModal(false);
        setError("");
      } else {
        setError(result.error || "Failed to create patient");
      }
    } catch (error) {
      setError("Failed to create patient");
      console.error("Error creating patient:", error);
    }
  };

  const handleImageUpload = async (file, description) => {
    if (!selectedPatient) return;

    try {
      let result;
      if (imageModalType === IMAGE_TYPES.MRI) {
        result = await ApiService.uploadMRIImage(
          selectedPatient.id,
          file,
          description,
        );
      } else {
        result = await ApiService.uploadEEGImage(
          selectedPatient.id,
          file,
          description,
        );
      }

      if (result.success) {
        await fetchPatientImages(selectedPatient.id);
        setShowImageModal(false);
        setError("");
      } else {
        setError(result.error || "Failed to upload image");
      }
    } catch (error) {
      setError("Failed to upload image");
      console.error("Error uploading image:", error);
    }
  };

  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    setActiveTab("details");
    await fetchPatientImages(patient.id);
  };

  const openImageUploadModal = (type) => {
    setImageModalType(type);
    setShowImageModal(true);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toString().includes(searchTerm),
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Doctor Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, Dr. {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            My Profile
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "history"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Patient History
          </button>

          <button
            onClick={() => setActiveTab("scan")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "scan"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            MRI Scan
          </button>

          {selectedPatient && (
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              {selectedPatient.name}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {activeTab === "profile" && (
          <ProfileTab
            doctorProfile={doctorProfile}
            profileLoading={profileLoading}
            profileError={profileError}
            onUpdateProfile={updateProfile}
          />
        )}

        {activeTab === "history" && (
          <HistoryTab
            patientsHistory={patientsHistory}
            selectedPatientHistory={selectedPatientHistory}
            patientVisits={patientVisits}
            historyLoading={historyLoading}
            onSelectPatient={(patient) => {
              setSelectedPatientHistory(patient);
              loadPatientVisits(patient.id);
            }}
            onBackToHistory={() => setSelectedPatientHistory(null)}
            onDeletePatient={handleDeletePatient}
          />
        )}

        {activeTab === "scan" && (
          <MRIScanTab
            scanResult={scanResult}
            scanLoading={scanLoading}
            onScanMRI={handleMRIScan}
            onClearResult={() => setScanResult(null)}
          />
        )}

        {selectedPatient && activeTab === "details" && (
            <div>
              {/* Patient Details Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPatient.name}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openImageUploadModal(IMAGE_TYPES.MRI)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload MRI
                  </button>
                  <button
                    onClick={() => openImageUploadModal(IMAGE_TYPES.EEG)}
                    className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload EEG
                  </button>
                </div>
              </div>

              {/* Patient Information Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Patient ID
                    </label>
                    <p className="text-sm text-gray-900">
                      #{selectedPatient.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Age
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.age}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Gender
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.gender}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Date Added
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedPatient.created_at)}
                    </p>
                  </div>
                </div>
                {selectedPatient.medical_history && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Medical History
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedPatient.medical_history}
                    </p>
                  </div>
                )}
              </div>

              {/* Images Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Medical Images
                </h3>

                {patientImages.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No images uploaded
                    </h4>
                    <p className="text-gray-500 mb-4">
                      Upload MRI or EEG images for this patient to begin
                      analysis
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patientImages.map((image) => (
                      <div
                        key={image.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              image.image_type === IMAGE_TYPES.MRI
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {image.image_type.toUpperCase()}
                          </span>
                          <Activity className="w-4 h-4 text-gray-400" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          {image.filename}
                        </h4>
                        {image.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {image.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Uploaded: {formatDate(image.uploaded_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
        )}
      </div>

      {/* Modals */}
      {showPatientModal && (
        <PatientFormModal
          onClose={() => setShowPatientModal(false)}
          onSubmit={handleCreatePatient}
        />
      )}

      {showImageModal && selectedPatient && (
        <ImageUploadModal
          patientName={selectedPatient.name}
          imageType={imageModalType}
          onClose={() => setShowImageModal(false)}
          onSubmit={handleImageUpload}
        />
      )}
    </div>
  );
}

// Profile Tab Component
function ProfileTab({
  doctorProfile,
  profileLoading,
  profileError,
  onUpdateProfile,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (doctorProfile) {
      setFormData({
        firstName: doctorProfile.firstName || "",
        lastName: doctorProfile.lastName || "",
        age: doctorProfile.age || "",
        gender: doctorProfile.gender || "",
        degree: doctorProfile.degree || "",
        experience: doctorProfile.experience || "",
        hospital: doctorProfile.hospital || "",
      });
    }
  }, [doctorProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateProfile(formData);
    setIsEditing(false);
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {profileError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{profileError}</p>
        </div>
      )}

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="mt-1 text-gray-900">
              {doctorProfile?.firstName} {doctorProfile?.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-gray-900">{doctorProfile?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <p className="mt-1 text-gray-900">{doctorProfile?.age}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <p className="mt-1 text-gray-900">{doctorProfile?.gender}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Degree
            </label>
            <p className="mt-1 text-gray-900">{doctorProfile?.degree}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience
            </label>
            <p className="mt-1 text-gray-900">{doctorProfile?.experience}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Hospital
            </label>
            <p className="mt-1 text-gray-900">{doctorProfile?.hospital}</p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Degree
            </label>
            <select
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Degree</option>
              <option value="MD">MD</option>
              <option value="MBBS">MBBS</option>
              <option value="DM">DM</option>
              <option value="DNB">DNB</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience
            </label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              placeholder="e.g., 15 years"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Hospital
            </label>
            <input
              type="text"
              value={formData.hospital}
              onChange={(e) =>
                setFormData({ ...formData, hospital: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// History Tab Component
function HistoryTab({
  patientsHistory,
  selectedPatientHistory,
  patientVisits,
  historyLoading,
  onSelectPatient,
  onBackToHistory,
  onDeletePatient,
}) {
  if (historyLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading patient history...</p>
      </div>
    );
  }

  if (selectedPatientHistory) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Visit History - {selectedPatientHistory.name}
          </h2>
          <button
            onClick={onBackToHistory}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Patients
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Patient:</span>{" "}
              {selectedPatientHistory.name}
            </div>
            <div>
              <span className="font-medium">Age:</span>{" "}
              {selectedPatientHistory.age}
            </div>
            <div>
              <span className="font-medium">Total Visits:</span>{" "}
              {selectedPatientHistory.total_visits}
            </div>
            <div>
              <span className="font-medium">Last Visit:</span>{" "}
              {new Date(
                selectedPatientHistory.last_visit_date,
              ).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {patientVisits.length > 0 ? (
            patientVisits.map((visit) => (
              <div
                key={visit.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {visit.condition_detected}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(visit.visit_date).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        visit.confidence_score > 0.9
                          ? "bg-green-100 text-green-800"
                          : visit.confidence_score > 0.8
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(visit.confidence_score * 100).toFixed(1)}% Confidence
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{visit.notes}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No visit history available for this patient.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient History</h2>

      <div className="grid gap-4">
        {patientsHistory.length > 0 ? (
          patientsHistory.map((patient) => (
            <div
              key={patient.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectPatient(patient)}
                >
                  <h3 className="font-semibold text-gray-900">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Age: {patient.age} • Gender: {patient.gender}
                  </p>
                  <p className="text-sm text-gray-600">
                    Mobile: {patient.mobile_number}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {patient.total_visits} visits
                    </div>
                    <p className="text-xs text-gray-500">
                      Last:{" "}
                      {new Date(patient.last_visit_date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePatient(patient.id);
                    }}
                    className="flex items-center px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No patient history available.
          </p>
        )}
      </div>
    </div>
  );
}

// MRI Scan Tab Component
function MRIScanTab({ scanResult, scanLoading, onScanMRI, onClearResult }) {
  const fileInputRef = useRef(null);
  const [patientData, setPatientData] = useState({
    name: "",
    mobile: "",
    age: "",
    gender: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an MRI image file");
      return;
    }
    if (!patientData.name || !patientData.mobile || !patientData.age) {
      alert("Please fill in all required fields");
      return;
    }
    await onScanMRI(patientData, selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const getSeverityColor = (condition) => {
    if (condition?.includes("No Alzheimer's"))
      return "text-green-600 bg-green-50 border-green-200";
    if (condition?.includes("Mild"))
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (condition?.includes("Moderate"))
      return "text-orange-600 bg-orange-50 border-orange-200";
    if (condition?.includes("Severe"))
      return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {scanResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              AI Detection Results
            </h3>
            <button
              onClick={onClearResult}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              New Scan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Patient Information</h4>
              <p>
                <span className="font-medium">Name:</span>{" "}
                {scanResult.patient_name}
              </p>
              <p>
                <span className="font-medium">Patient ID:</span> #
                {scanResult.patient_id}
              </p>
              <p>
                <span className="font-medium">Scan ID:</span> #
                {scanResult.scan_id}
              </p>
              <p>
                <span className="font-medium">Image:</span>{" "}
                {scanResult.image_filename}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Analysis Results</h4>
              <div
                className={`p-4 rounded-lg border ${getSeverityColor(scanResult.detection_result.condition)}`}
              >
                <p className="font-bold text-lg">
                  {scanResult.detection_result.condition}
                </p>
                {/* <p className="text-sm">
                  Confidence:{" "}
                  {(scanResult.detection_result.confidence * 100).toFixed(1)}%
                </p> */}
                {/* <p className="text-sm">
                  Severity: {scanResult.detection_result.severity}
                </p> */}
                <p className="text-sm mt-2">
                  {scanResult.detection_result.details}
                </p>
              </div>
              {/* <p className="text-xs text-gray-500 mt-2">
                Analysis completed on{" "}
                {new Date(
                  scanResult.detection_result.analysis_date,
                ).toLocaleString()}
              </p> */}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          MRI Scan & AI Detection
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={patientData.name}
                onChange={(e) =>
                  setPatientData({ ...patientData, name: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter patient's full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={patientData.mobile}
                onChange={(e) =>
                  setPatientData({ ...patientData, mobile: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age *
              </label>
              <input
                type="number"
                required
                min="1"
                value={patientData.age}
                onChange={(e) =>
                  setPatientData({ ...patientData, age: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={patientData.gender}
                onChange={(e) =>
                  setPatientData({ ...patientData, gender: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MRI Image *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setSelectedFile(e.target.files[0])
              }
            />
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
            >
              {selectedFile ? (
                <div>
                  <p className="text-green-600 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">
                    Drag and drop your MRI image here, or click to browse
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supported: JPEG, PNG, BMP, TIFF
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={scanLoading}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {scanLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing MRI Scan...
              </div>
            ) : (
              "Scan MRI & Detect"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorDashboard;
