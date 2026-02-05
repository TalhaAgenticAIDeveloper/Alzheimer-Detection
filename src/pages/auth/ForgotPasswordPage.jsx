import React, { useState } from "react";
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ApiService from "../../services/api";

function ForgotPasswordPage({ onNavigateLogin }) {
  const [step, setStep] = useState("email"); // 'email', 'otp', 'password', 'success'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please provide a valid email address");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please provide a valid email address");
      return;
    }

    setLoading(true);

    try {
      const result = await ApiService.forgotPassword(email);

      if (result.success) {
        setOtpSent(true);
        setStep("otp");
      } else {
        // Display the specific error message from backend
        setError(result.error);
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
    setLoading(true);
    // Move to password step - OTP will be validated during password reset
    setTimeout(() => {
      setLoading(false);
      setStep("password");
    }, 500);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters long for security purposes.",
      );
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(
        "Password and confirm password do not match. Please ensure both passwords are identical.",
      );
      return;
    }
    setLoading(true);

    try {
      const result = await ApiService.resetPassword({
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (result.success) {
        setStep("success");
      } else {
        // Display the specific error message from backend
        setError(result.error);
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onNavigateLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <button
            onClick={() => onNavigateLogin()}
            className="flex items-center gap-2 text-gray-700 hover:text-green-500 font-medium transition"
          >
            <ArrowLeft size={20} />
            Back to Login
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Branding */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="font-bold text-2xl text-gray-900">
                NeuroCare AI
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              {step === "email" &&
                "Enter your email address to receive a verification code"}
              {step === "otp" &&
                "Enter the verification code sent to your email"}
              {step === "password" && "Create a strong new password"}
              {step === "success" &&
                "Your password has been reset successfully"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${step !== "email" ? "bg-green-500 text-white" : "bg-green-500 text-white"}`}
              >
                {step !== "email" && step !== "success" ? (
                  <CheckCircle size={24} />
                ) : (
                  "1"
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700">Email</span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 mb-8 ${["otp", "password", "success"].includes(step) ? "bg-green-500" : "bg-gray-300"}`}
            ></div>

            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${step !== "otp" && step !== "email" ? "bg-green-500 text-white" : step === "otp" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
              >
                {step !== "otp" && step !== "email" && step !== "success" ? (
                  <CheckCircle size={24} />
                ) : (
                  "2"
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700">OTP</span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 mb-8 ${["password", "success"].includes(step) ? "bg-green-500" : "bg-gray-300"}`}
            ></div>

            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${step === "success" ? "bg-green-500 text-white" : step === "password" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
              >
                {step === "success" ? <CheckCircle size={24} /> : "3"}
              </div>
              <span className="text-xs font-semibold text-gray-700">
                Password
              </span>
            </div>
          </div>

          {/* Success Screen */}
          {step === "success" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={48} className="text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-8">
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
              >
                Back to Login
              </button>
            </div>
          )}

          {/* Email Step */}
          {step === "email" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@neurohealthcare.com"
                      className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We'll send a verification code to this email address
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? "Sending Code..." : "Send Verification Code"}
                </button>
              </form>
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              {otpSent && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle
                    size={20}
                    className="text-green-500 flex-shrink-0 mt-0.5"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-green-900">
                      Code sent successfully!
                    </p>
                    <p className="text-green-700">
                      Check your email at{" "}
                      <span className="font-medium">{email}</span>
                    </p>
                  </div>
                </div>
              )}
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="000000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition font-semibold"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying Code..." : "Verify Code"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?{" "}
                  <button
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError("");
                    }}
                    className="font-semibold text-green-600 hover:text-green-700 transition"
                  >
                    Try another email
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Password Step */}
          {step === "password" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-lg pl-12 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-gray-600 font-medium">
                      Password requirements:
                    </p>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li
                        className={`flex items-center gap-2 ${newPassword.length >= 8 ? "text-green-600" : ""}`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${newPassword.length >= 8 ? "bg-green-500 text-white" : "border border-gray-300"}`}
                        >
                          {newPassword.length >= 8 && "✓"}
                        </span>
                        At least 8 characters
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-lg pl-12 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                      <CheckCircle size={14} /> Passwords match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2024 NeuroCare AI. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ForgotPasswordPage;
