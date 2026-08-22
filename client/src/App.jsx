import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AssistantFloatingButton from './components/AssistantFloatingButton';

// Pages
import LandingPage from './pages/LandingPage';
import DoctorSearchPage from './pages/DoctorSearchPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import PatientQueuePage from './pages/PatientQueuePage';
import PatientProfilePage from './pages/PatientProfilePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import DoctorQueueManagerPage from './pages/DoctorQueueManagerPage';
import DoctorProfileEditPage from './pages/DoctorProfileEditPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AssistantPage from './pages/AssistantPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Patient Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/patient/search" element={<DoctorSearchPage />} />
                <Route path="/patient/doctors" element={<DoctorSearchPage />} />
                <Route path="/patient/doctors/:id" element={<DoctorProfilePage />} />
                <Route path="/patient/queue" element={<PatientQueuePage />} />
                <Route path="/patient/profile" element={<PatientProfilePage />} />

                {/* Assistant Route */}
                <Route path="/assistant" element={<AssistantPage />} />

                {/* Doctor Routes */}
                <Route path="/doctor/login" element={<DoctorLoginPage />} />
                <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
                <Route path="/doctor/queue" element={<DoctorQueueManagerPage />} />
                <Route path="/doctor/profile" element={<DoctorProfileEditPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <AssistantFloatingButton />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
