import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  Power,
  ArrowRight,
  TrendingUp,
  Settings,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DoctorDashboardPage() {
  const { user, isDoctor, switchRole } = useAuth();
  const navigate = useNavigate();

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const doctorId = 'doc-1'; // Dr. Raj Sharma

  const fetchDoctorData = async () => {
    try {
      const res = await api.queue.getDoctorQueue(doctorId);
      setQueueData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isDoctor) {
      switchRole('doctor');
    }
    fetchDoctorData();
    const interval = setInterval(fetchDoctorData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleClinicStatus = async () => {
    if (!queueData?.doctor) return;
    setTogglingStatus(true);
    const newStatus = queueData.doctor.status === 'open' ? 'closed' : 'open';
    const newAccepting = newStatus === 'open';

    try {
      await api.doctors.updateStatus(doctorId, newStatus, newAccepting);
      await fetchDoctorData();
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading Doctor Dashboard...</p>
      </div>
    );
  }

  const doctor = queueData?.doctor;
  const overview = queueData?.overview || {};
  const isOpen = doctor?.status === 'open' && doctor?.is_accepting;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Greeting & Clinic Status Toggle */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Healthcare Provider Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Good afternoon, {doctor?.name || 'Dr. Raj Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {doctor?.specialty} • {doctor?.clinic_name}
          </p>
        </div>

        {/* Status Toggle Card */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-bold text-slate-900">
              {isOpen ? '🟢 Accepting Patients' : '🔴 Clinic Closed'}
            </span>
          </div>

          <button
            onClick={handleToggleClinicStatus}
            disabled={togglingStatus}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
              isOpen
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {togglingStatus ? 'Updating...' : isOpen ? 'Close Clinic' : 'Open Clinic'}
          </button>
        </div>
      </div>

      {/* Today's Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Patients Today
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {overview.totalPatientsToday || 18}
          </div>
          <span className="text-[10px] text-teal-600 font-medium">Daily Clinic Traffic</span>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Completed
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {overview.completedCount || 11}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Finished Consultations</span>
        </div>

        {/* Waiting */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Waiting in Queue
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {overview.waitingCount || 5}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">In Queue Line</span>
        </div>

        {/* Current Token */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-2xs space-y-1 bg-teal-50/20">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide">
            Current Token
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-900">
            #{overview.currentToken || 14}
          </div>
          <span className="text-[10px] text-teal-700 font-medium">Currently in Cabin</span>
        </div>

        {/* Est Wait Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Queue Wait
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ~{overview.estimatedWaitMinutes || 12}m
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Avg Patient Wait</span>
        </div>
      </div>

      {/* Main Interactive Action Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Stethoscope className="w-3.5 h-3.5" />
            Live Queue Desk
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Manage your patient flow in real-time.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Call the next token, mark consultations completed, or skip absent patients. Patients receive immediate live notifications on their phones.
          </p>
        </div>

        <Link
          to="/doctor/queue"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Open Live Queue Manager</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Secondary Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              Clinic Profile & Fees
            </h3>
            <Link to="/doctor/profile" className="text-xs text-teal-700 font-semibold hover:underline">
              Edit Settings
            </Link>
          </div>
          <div className="text-xs text-slate-600 space-y-2">
            <p><strong>Fee:</strong> ₹{doctor?.fee || 400} per consultation</p>
            <p><strong>Clinic Hours:</strong> {doctor?.working_hours || '09:00 AM - 07:00 PM'}</p>
            <p><strong>Location:</strong> {doctor?.address || 'Bellandur, Bengaluru'}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            Clinic Queue Analytics
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Average consultation duration today: <strong>10.2 minutes</strong>. Digital queues have reduced your physical waiting room congestion by <strong>74%</strong>.
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ✓ On-Time Schedule Compliance: 94%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
