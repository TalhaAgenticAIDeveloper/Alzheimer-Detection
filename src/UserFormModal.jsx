import React, { useState } from 'react'
import { X, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

function UserFormModal({ onClose, onAddUser }) {
  const [step, setStep] = useState('form') // 'form', 'email-verify', 'otp-verify', 'success'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    degree: '',
    experience: '',
    hospital: ''
  })

  const [otp, setOtp] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleEmailVerification = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email) {
      setError('Please enter email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false)
      setStep('otp-verify')
    }, 1500)
  }

  const handleOtpVerification = async (e) => {
    e.preventDefault()
    setError('')

    if (!otp) {
      setError('Please enter OTP')
      return
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits')
      return
    }

    setLoading(true)
    // Simulate API call to verify OTP
    setTimeout(() => {
      setLoading(false)
      setEmailVerified(true)
      setStep('form')
    }, 1500)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return
    }
    if (!emailVerified) {
      setError('Please verify your email first')
      return
    }
    if (!formData.password) {
      setError('Password is required')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!formData.age) {
      setError('Age is required')
      return
    }
    if (!formData.gender) {
      setError('Gender is required')
      return
    }
    if (!formData.degree) {
      setError('Degree is required')
      return
    }
    if (!formData.experience) {
      setError('Years of experience is required')
      return
    }
    if (!formData.hospital.trim()) {
      setError('Hospital name is required')
      return
    }

    setLoading(true)
    // Simulate API call to create user
    setTimeout(() => {
      setLoading(false)
      onAddUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: parseInt(formData.age),
        gender: formData.gender,
        degree: formData.degree,
        experience: parseInt(formData.experience),
        hospital: formData.hospital
      })
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'form' && 'Create New User'}
            {step === 'otp-verify' && 'Verify Email'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Email Verification Step */}
          {step === 'otp-verify' && (
            <form onSubmit={handleOtpVerification} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm">
                  We've sent a verification code to<br />
                  <span className="font-semibold text-gray-900">{formData.email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <ArrowLeft size={18} />
                Back to Email
              </button>
            </form>
          )}

          {/* User Form Step */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Email Verification Badge */}
              {emailVerified && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Email Verified</p>
                    <p className="text-green-700 text-sm">{formData.email}</p>
                  </div>
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-900">Email Address</label>
                  {emailVerified && <CheckCircle size={16} className="text-green-500" />}
                </div>
                {!emailVerified ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@hospital.com"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={handleEmailVerification}
                      disabled={!formData.email || loading}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition text-sm"
                    >
                      {loading ? 'Sending...' : 'Verify'}
                    </button>
                  </div>
                ) : (
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full border border-green-300 bg-green-50 rounded-lg px-3 py-2 text-gray-900"
                  />
                )}
              </div>

              {/* Password Fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="30"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Degree & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Degree</label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Degree</option>
                    <option value="MD">MD</option>
                    <option value="MBBS">MBBS</option>
                    <option value="DM">DM</option>
                    <option value="DNB">DNB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Experience (yrs)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Hospital */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Hospital Name</label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  placeholder="Central Hospital"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !emailVerified}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition disabled:cursor-not-allowed"
              >
                {loading ? 'Creating User...' : 'Create User'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserFormModal
