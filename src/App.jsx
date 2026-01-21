import React, { useState } from 'react'
import { Menu, X, Brain, BarChart3, TrendingUp, Lock, CheckCircle, Users, ArrowRight, Upload, MessageCircle } from 'lucide-react'
import LoginPage from './LoginPage'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = useState('home') // 'home' or 'login'

  if (currentPage === 'login') {
    return <LoginPage onNavigateHome={() => setCurrentPage('home')} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HEADER / NAVBAR ===== */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:inline">NeuroCare AI</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-green-500 font-medium transition">Home</a>
              <a href="#about" className="text-gray-700 hover:text-green-500 font-medium transition">About</a>
              <a href="#features" className="text-gray-700 hover:text-green-500 font-medium transition">Features</a>
              <a href="#detection" className="text-gray-700 hover:text-green-500 font-medium transition">Detection</a>
              <a href="#team" className="text-gray-700 hover:text-green-500 font-medium transition">Research</a>
              <a href="#contact" className="text-gray-700 hover:text-green-500 font-medium transition">Contact</a>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('login')}
                className="text-gray-700 hover:text-gray-900 font-medium transition"
              >
                Log In
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition">
                Start Screening
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t">
              <div className="flex flex-col gap-4 pt-4">
                <a href="#home" className="text-gray-700 hover:text-green-500 font-medium">Home</a>
                <a href="#about" className="text-gray-700 hover:text-green-500 font-medium">About</a>
                <a href="#features" className="text-gray-700 hover:text-green-500 font-medium">Features</a>
                <a href="#detection" className="text-gray-700 hover:text-green-500 font-medium">Detection</a>
                <a href="#team" className="text-gray-700 hover:text-green-500 font-medium">Research</a>
                <a href="#contact" className="text-gray-700 hover:text-green-500 font-medium">Contact</a>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Log In
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium w-full">
                  Start Screening
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section id="home" className="py-12 md:py-24 bg-gradient-to-br from-white via-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Early Alzheimer Detection<br />
                <span className="text-green-500">Powered by AI</span>
              </h1>

              <p className="text-lg text-gray-600 space-y-3">
                Our advanced AI technology provides:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>AI-based brain MRI analysis with clinical precision</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Early diagnosis support for better patient outcomes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Clinical decision support for medical professionals</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition">
                  <Upload size={20} />
                  Upload MRI Scan
                </button>
                <button className="border-2 border-green-500 text-green-500 hover:bg-green-50 px-8 py-3 rounded-lg font-medium transition">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right - Illustration Area */}
            <div className="relative">
              <div className="absolute w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-20 -top-20 -right-20"></div>
              <div className="relative z-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full w-80 h-80 md:w-96 md:h-96 flex items-center justify-center mx-auto">
                <div className="text-center">
                  <Brain className="w-32 h-32 text-white mx-auto mb-4" />
                  <p className="text-white text-lg font-semibold">AI Brain Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SMART SCREENING BAR ===== */}
      <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Quick AI Screening</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scan Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>MRI Scan</option>
                  <option>CT Scan</option>
                  <option>PET Scan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Age</label>
                <input type="number" placeholder="e.g., 65" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scan Date</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Scan</label>
                <button className="w-full border-2 border-dashed border-green-300 rounded-lg px-4 py-3 text-green-600 hover:bg-green-50 font-medium transition flex items-center justify-center gap-2">
                  <Upload size={18} />
                  Choose File
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                Analyze Now
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 font-semibold text-sm md:text-base">OUR CAPABILITIES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Our AI Medical Services</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Advanced AI technology designed for clinical precision and patient care</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Diagnosis</h3>
              <p className="text-gray-600">
                Our deep learning models analyze brain MRI scans with clinical-grade accuracy, providing neurologists with AI-powered diagnostic insights and confidence scores.
              </p>
            </div>

            {/* Card 2 - Highlighted */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white transform md:scale-105 md:z-10">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Cognitive Analysis</h3>
              <p>
                Comprehensive cognitive assessment combining imaging data with patient history to generate detailed risk profiles and cognitive decline predictions.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor disease progression over time with longitudinal analysis. Track cognitive decline patterns and treatment response with detailed progress reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US SECTION ===== */}
      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="absolute w-72 h-72 bg-green-200 rounded-full blur-2xl opacity-20"></div>
              <div className="relative z-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-3xl p-8 text-white text-center h-96 flex flex-col items-center justify-center">
                <Users className="w-24 h-24 mb-4" />
                <p className="text-xl font-semibold">Expert Neurologists & AI Researchers</p>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose<br />
                  <span className="text-green-500">NeuroCare AI</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  Built by medical professionals and AI researchers to deliver trustworthy, accurate diagnostic support.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <Lock className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">FDA-Grade Security</h3>
                    <p className="text-gray-600">HIPAA-compliant with enterprise-level encryption for patient data protection</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">High Accuracy AI Model</h3>
                    <p className="text-gray-600">96%+ accuracy validated across independent clinical datasets</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Users className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Trusted by Researchers</h3>
                    <p className="text-gray-600">Used by leading neurology research institutions worldwide</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <TrendingUp className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Secure Data Handling</h3>
                    <p className="text-gray-600">Advanced encryption, anonymization, and audit trails for regulatory compliance</p>
                  </div>
                </div>
              </div>

              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition inline-flex items-center gap-2">
                Learn Our Technology
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPECIALISTS / RESEARCH TEAM ===== */}
      <section id="team" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 font-semibold text-sm md:text-base">OUR TEAM</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Research & Medical Team</h2>
            <p className="text-gray-600 mt-4">Leading neurologists and AI researchers dedicated to advancing diagnosis</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-70" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">Dr. Sarah Johnson</h3>
                <p className="text-green-600 font-semibold text-sm">Neurologist</p>
                <p className="text-gray-600 text-sm mt-2">20+ years in neurology and cognitive disorders</p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  View Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-70" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">Prof. Michael Chen</h3>
                <p className="text-green-600 font-semibold text-sm">AI Researcher</p>
                <p className="text-gray-600 text-sm mt-2">Deep learning and medical imaging expert</p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  View Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-70" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">Dr. Emily Rodriguez</h3>
                <p className="text-green-600 font-semibold text-sm">Clinical Researcher</p>
                <p className="text-gray-600 text-sm mt-2">Specializing in AD biomarkers and imaging</p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  View Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-70" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">Dr. James Wilson</h3>
                <p className="text-green-600 font-semibold text-sm">Neurotechnologist</p>
                <p className="text-gray-600 text-sm mt-2">Healthcare tech innovation and implementation</p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  View Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="detection" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 font-semibold text-sm md:text-base">PRICING PLANS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 mt-4">Choose the right plan for your healthcare needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-gray-50 rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Screening</h3>
              <p className="text-gray-600 text-sm mb-4">For individual patients</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$299</span>
                <span className="text-gray-600 text-sm">/per scan</span>
              </div>
              <button className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition mb-6">
                Get Started
              </button>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Single MRI scan analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>AI diagnosis report</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Standard support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>30-day result access</span>
                </li>
              </ul>
            </div>

            {/* Pro Clinical Plan - Highlighted */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white transform md:scale-105 md:z-10 border-2 border-green-600">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Pro Clinical</h3>
                  <p className="text-green-100 text-sm">For clinics & practices</p>
                </div>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold">POPULAR</span>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold">$999</span>
                <span className="text-green-100 text-sm">/month</span>
              </div>
              <button className="w-full bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition mb-6">
                Start Free Trial
              </button>
              <ul className="space-y-3 text-green-50 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Unlimited scans</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Multi-patient dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>HIPAA compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Unlimited storage</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-50 rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Research Enterprise</h3>
              <p className="text-gray-600 text-sm mb-4">For research institutions</p>
              <div className="mb-6">
                <span className="text-2xl font-bold text-gray-900">Custom</span>
                <span className="text-gray-600 text-sm">/pricing</span>
              </div>
              <button className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition mb-6">
                Contact Sales
              </button>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Custom API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Dedicated infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Research support team</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Data integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Training & onboarding</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-white">NeuroCare AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advancing Alzheimer detection through AI innovation, transforming early diagnosis and patient care.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-green-400 transition">Features</a></li>
                <li><a href="#detection" className="text-gray-400 hover:text-green-400 transition">Pricing</a></li>
                <li><a href="#team" className="text-gray-400 hover:text-green-400 transition">Research Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Documentation</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-gray-400 hover:text-green-400 transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">HIPAA Compliance</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <p className="text-gray-400 text-sm">
                © 2024 NeuroCare AI. All rights reserved. Advancing medical innovation.
              </p>
              <div className="flex gap-6 md:justify-end">
                <a href="#" className="text-gray-400 hover:text-green-400 transition">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== STICKY WHATSAPP BUTTON ===== */}
      <div className="fixed bottom-8 right-8 z-40">
        <a
          href="https://wa.me/?text=Hello%20NeuroCare%20AI%20team"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </a>
      </div>
    </div>
  )
}

export default App
