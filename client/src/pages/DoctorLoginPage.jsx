import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Sparkles, ArrowRight } from 'lucide-react';

export default function DoctorLoginPage() {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleInstantDoctorLogin = async () => {
    await switchRole('doctor');
    navigate('/doctor/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Stethoscope className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Doctor Portal Login</h1>
        <p className="text-xs text-slate-500">Access your clinic dashboard and live patient queue manager.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
          <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Verified Demo Practitioner
          </span>
          <p className="text-xs text-teal-800">
            <strong>Dr. Raj Sharma</strong> (MD Dermatology)<br />
            Apex Skin & Laser Clinic
          </p>
        </div>

        <button
          onClick={handleInstantDoctorLogin}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Open Doctor Dashboard (1-Click)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
