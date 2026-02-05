import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Brain,
  BarChart3,
  TrendingUp,
  Lock,
  CheckCircle,
  Users,
  ArrowRight,
  Upload,
  MessageCircle,
} from "lucide-react";
import { LoginPage, AdminDashboard, DoctorDashboard } from "./pages";

import ApiService from "./services/api";
import { APP_NAME, USER_ROLES } from "./constants";
import { RoleBasedAccess, TokenManager } from "./utils/auth";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // 'home', 'login', 'admin', 'doctor'
  const [authUser, setAuthUser] = useState(null); // null or { email, name }
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = ApiService.getToken();

    if (token && !TokenManager.isTokenExpired(token)) {
      try {
        const result = await ApiService.getProfile();

        if (result.success) {
          const user = result.data;
          setAuthUser(user);

          // Set appropriate dashboard based on role
          const dashboardRoute = RoleBasedAccess.getDashboardRoute(user.role);
          setCurrentPage(dashboardRoute);

          // Setup auto-logout when token expires
          TokenManager.setupAutoLogout(handleLogout);
        } else {
          // Token is invalid, remove it
          ApiService.logout();
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        ApiService.logout();
      }
    } else if (token) {
      // Token is expired
      ApiService.logout();
    }

    setLoading(false);
  };

  const handleLogin = async (user) => {
    // Get full user profile after login
    try {
      const profileResult = await ApiService.getProfile();
      if (profileResult.success) {
        const fullUser = profileResult.data;
        setAuthUser(fullUser);

        // Redirect to appropriate dashboard
        const dashboardRoute = RoleBasedAccess.getDashboardRoute(fullUser.role);
        setCurrentPage(dashboardRoute);

        // Setup auto-logout
        TokenManager.setupAutoLogout(handleLogout);
      } else {
        setAuthUser(user);
        setCurrentPage("admin"); // Fallback
      }
    } catch (error) {
      setAuthUser(user);
      setCurrentPage("admin"); // Fallback
    }
  };

  const handleLogout = () => {
    ApiService.logout();
    setAuthUser(null);
    setCurrentPage("home");
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show appropriate dashboard if user is authenticated
  if (authUser) {
    if (currentPage === "admin" && authUser.role === USER_ROLES.ADMIN) {
      return <AdminDashboard user={authUser} onLogout={handleLogout} />;
    } else if (
      currentPage === "doctor" &&
      authUser.role === USER_ROLES.DOCTOR
    ) {
      return <DoctorDashboard user={authUser} onLogout={handleLogout} />;
    } else if (authUser.role === USER_ROLES.ADMIN) {
      return <AdminDashboard user={authUser} onLogout={handleLogout} />;
    } else if (authUser.role === USER_ROLES.DOCTOR) {
      return <DoctorDashboard user={authUser} onLogout={handleLogout} />;
    } else {
      // Invalid role or access denied
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this application.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
  }

  // Show login page if requested
  if (currentPage === "login") {
    return (
      <LoginPage
        onNavigateHome={() => setCurrentPage("home")}
        onLoginSuccess={handleLogin}
      />
    );
  }

  // Show landing page
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
              <span className="font-bold text-xl text-gray-900 hidden sm:inline">
                {APP_NAME}
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className="text-gray-700 hover:text-green-500 font-medium transition"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-green-500 font-medium transition"
              >
                About
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-green-500 font-medium transition"
              >
                Features
              </a>
             
              <a
                href="#team"
                className="text-gray-700 hover:text-green-500 font-medium transition"
              >
                Research
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-green-500 font-medium transition"
              >
                Contact
              </a>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setCurrentPage("login")}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Login
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
                <a
                  href="#home"
                  className="text-gray-700 hover:text-green-500 font-medium"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-green-500 font-medium"
                >
                  About
                </a>
                <a
                  href="#features"
                  className="text-gray-700 hover:text-green-500 font-medium"
                >
                  Features
                </a>
                
                <a
                  href="#team"
                  className="text-gray-700 hover:text-green-500 font-medium"
                >
                  Research
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-green-500 font-medium"
                >
                  Contact
                </a>
                <button
                  onClick={() => setCurrentPage("login")}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Log In
                </button>
                
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="py-12 md:py-24 bg-linear-to-br from-white via-green-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Early Alzheimer Detection
                <br />
                <span className="text-green-500">Powered by AI</span>
              </h1>

              <p className="text-lg text-gray-600 space-y-3">
                Our advanced AI technology provides:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    AI-based brain MRI analysis with clinical precision
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    Early diagnosis support for better patient outcomes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    Clinical decision support for medical professionals
                  </span>
                </li>
              </ul>

            
            </div>

            {/* Right - Illustration Area */}
            <div className="relative">
              <div className="absolute w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-20 -top-20 -right-20"></div>
              <div className="relative z-10 bg-linear-to-br from-green-400 to-green-500 rounded-full w-80 h-80 md:w-96 md:h-96 flex items-center justify-center mx-auto">
                <div className="text-center">
                  <Brain className="w-32 h-32 text-white mx-auto mb-4" />
                  <p className="text-white text-lg font-semibold">
                    AI Brain Analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
          
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Our AI Medical Services
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Advanced AI technology designed for clinical precision and patient
              care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                AI Diagnosis
              </h3>
              <p className="text-gray-600">
                Our deep learning models analyze brain MRI scans with
                clinical-grade accuracy, providing neurologists with AI-powered
                diagnostic insights and confidence scores.
              </p>
            </div>

            {/* Card 2 - Highlighted */}
            <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white transform md:scale-105 md:z-10">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Cognitive Analysis</h3>
              <p>
                Comprehensive cognitive assessment combining imaging data with
                patient history to generate detailed risk profiles and cognitive
                decline predictions.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor disease progression over time with longitudinal
                analysis. Track cognitive decline patterns and treatment
                response with detailed progress reports.
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
              <div className="relative z-10 bg-linear-to-br from-blue-400 to-green-400 rounded-3xl p-8 text-white text-center h-96 flex flex-col items-center justify-center">
                <Users className="w-24 h-24 mb-4" />
                <p className="text-xl font-semibold">
                  Expert Neurologists & AI Researchers
                </p>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose
                  <br />
                  <span className="text-green-500">NeuroCare AI</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  Built by medical professionals and AI researchers to deliver
                  trustworthy, accurate diagnostic support.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <Lock className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      FDA-Grade Security
                    </h3>
                    <p className="text-gray-600">
                      HIPAA-compliant with enterprise-level encryption for
                      patient data protection
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      High Accuracy AI Model
                    </h3>
                    <p className="text-gray-600">
                      96%+ accuracy validated across independent clinical
                      datasets
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Users className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Trusted by Researchers
                    </h3>
                    <p className="text-gray-600">
                      Used by leading neurology research institutions worldwide
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <TrendingUp className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Secure Data Handling
                    </h3>
                    <p className="text-gray-600">
                      Advanced encryption, anonymization, and audit trails for
                      regulatory compliance
                    </p>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPECIALISTS / RESEARCH TEAM ===== */}
      <section id="team" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 font-semibold text-sm md:text-base">
              OUR TEAM
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Research & Medical Team
            </h2>
            <p className="text-gray-600 mt-4">
              Leading neurologists and AI researchers dedicated to advancing
              diagnosis
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-linear-to-br from-blue-400 to-green-400 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-70" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">
                  Dr. Sarah Johnson
                </h3>
                <p className="text-green-600 font-semibold text-sm">
                  Neurologist
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  20+ years in neurology and cognitive disorders
                </p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  View Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-linear-to-br from-green-400 to-blue-400 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-70" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">
                  Prof. Michael Chen
                </h3>
                <p className="text-green-600 font-semibold text-sm">
                  AI Researcher
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Deep learning and medical imaging expert
                </p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  View Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-linear-to-br from-teal-400 to-green-400 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-70" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">
                  Dr. Emily Rodriguez
                </h3>
                <p className="text-green-600 font-semibold text-sm">
                  Clinical Researcher
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Specializing in AD biomarkers and imaging
                </p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  View Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-linear-to-br from-green-500 to-teal-400 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-70" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">
                  Dr. James Wilson
                </h3>
                <p className="text-green-600 font-semibold text-sm">
                  Neurotechnologist
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Healthcare tech innovation and implementation
                </p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  View Profile <ArrowRight size={16} />
                </button>
              </div>
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
                <span className="font-bold text-xl text-white">
                  NeuroCare AI
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Advancing Alzheimer detection through AI innovation,
                transforming early diagnosis and patient care.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#detection"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#team"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Research Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    HIPAA Compliance
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <p className="text-gray-400 text-sm">
                © 2024 NeuroCare AI. All rights reserved. Advancing medical
                innovation.
              </p>
              <div className="flex gap-6 md:justify-end">
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition"
                >
                  LinkedIn
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition"
                >
                  GitHub
                </a>
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
  );
}

export default App;
