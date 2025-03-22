import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LearnMorePage from './pages/LearnMorePage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Features from './pages/Features';
import ChatWidget from './components/chat/ChatWidget';
import PatientRecords from './pages/PatientRecords';
import HowItWorks from './components/common/HowItWorks';
import UploadReport from './pages/UploadReport';
import HospitalLoginPage from './pages/HospitalLoginPage';
import HospitalSignupPage from './pages/HospitalSignupPage';
import HospitalDashboardLayout from './components/hospital/HospitalDashboardLayout';
import HospitalDashboard from './components/hospital/HospitalDashboard';
import PatientsPage from './pages/hospital/PatientsPage';
import AppointmentsPage from './pages/hospital/AppointmentsPage';
import AnalyticsPage from './pages/hospital/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PatientDashboard from './components/patient/PatientDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';

const App: React.FC = () => {
  useEffect(() => {
    emailjs.init('xCbTuEx5MxXl6fTku');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <ChatWidget />
          <HowItWorks />
          <ToastContainer position="top-right" />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <main className="flex-grow">
                    <HomePage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/hospital-login" element={<HospitalLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/hospital-signup" element={<HospitalSignupPage />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/features" element={<Features />} />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/patient-records" element={<PatientRecords />} />
            <Route path="/upload-report" element={<UploadReport />} />
            
            <Route path="/hospital" element={
              <ProtectedRoute>
                <HospitalDashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<HospitalDashboard />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;