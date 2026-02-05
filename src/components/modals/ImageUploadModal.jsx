import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  AlertCircle,
} from "lucide-react";
import { IMAGE_TYPES } from "../../constants";

function ImageUploadModal({ patientName, imageType, onClose, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const acceptedFileTypes =
    imageType === IMAGE_TYPES.MRI
      ? ".jpg,.jpeg,.png,.dcm,.nii,.nii.gz"
      : ".jpg,.jpeg,.png,.edf,.bdf";

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file) => {
    if (!file) {
      return "Please select a file";
    }

    if (file.size > maxFileSize) {
      return "File size must be less than 50MB";
    }

    const validExtensions =
      imageType === IMAGE_TYPES.MRI
        ? [".jpg", ".jpeg", ".png", ".dcm", ".nii", ".gz"]
        : [".jpg", ".jpeg", ".png", ".edf", ".bdf"];

    const fileName = file.name.toLowerCase();
    const isValidExtension = validExtensions.some((ext) =>
      fileName.endsWith(ext),
    );

    if (!isValidExtension) {
      return `Invalid file type. Accepted formats: ${acceptedFileTypes}`;
    }

    return null;
  };

  const handleFileSelect = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError("");
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(selectedFile, description);
    } catch (error) {
      setError("Failed to upload image. Please try again.");
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getImageTypeInfo = () => {
    if (imageType === IMAGE_TYPES.MRI) {
      return {
        title: "MRI Image Upload",
        icon: "🧠",
        color: "blue",
        description:
          "Upload MRI scans in DICOM, NIfTI, or standard image formats",
      };
    } else {
      return {
        title: "EEG Image Upload",
        icon: "⚡",
        color: "purple",
        description: "Upload EEG recordings or images in supported formats",
      };
    }
  };

  const typeInfo = getImageTypeInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 bg-${typeInfo.color}-100 rounded-lg flex items-center justify-center mr-3`}
            >
              <span className="text-lg">{typeInfo.icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {typeInfo.title}
              </h2>
              <p className="text-sm text-gray-500">
                For patient: {patientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              {imageType.toUpperCase()} File *
            </label>
            <p className="text-xs text-gray-500 mb-3">{typeInfo.description}</p>

            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-green-400 bg-green-50"
                  : selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setError("");
                    }}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Drop file here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Accepted formats: {acceptedFileTypes}
                    </p>
                    <p className="text-xs text-gray-500">Maximum size: 50MB</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-2 flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add any notes about this image (e.g., scanning parameters, patient condition, etc.)"
            />
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                typeInfo.color === "blue"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                `Upload ${imageType.toUpperCase()}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImageUploadModal;
