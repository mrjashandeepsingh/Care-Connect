import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Clock,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Stethoscope,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [activeQueue, setActiveQueue] = useState(null);
  const [pastVisits, setPastVisits] = useState([]);
  const [savedDoctors, setSavedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queueRes = await api.queue.getPatientQueue(user?.id || 'patient-1');
        if (queueRes.hasActiveQueue) {
          setActiveQueue(queueRes.activeQueue);
        } else {
          setActiveQueue(null);
          setPastVisits(queueRes.recentVisits || []);
        }

        // Fetch sample saved doctors
        const docRes = await api.doctors.getAll();
        setSavedDoctors((docRes.doctors || []).slice(0, 2));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name[0] : 'J'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{user?.name || 'Jashandeep Singh'}</h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                Verified Patient
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email || 'patient@careconnect.demo'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {user?.phone || '+91 98765 43210'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {user?.location || 'Bellandur, Bengaluru'}
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/patient/doctors"
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          Discover Doctors
        </Link>
      </div>

      {/* Active Queue Section */}
      {activeQueue && (
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Clock className="w-3.5 h-3.5" />
              Current Active Queue
            </span>
            <Link
              to="/patient/queue"
              className="text-xs font-semibold text-teal-300 hover:text-white underline"
            >
              Open Live Tracker →
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <h3 className="text-lg font-bold">{activeQueue.doctor?.name}</h3>
              <p className="text-xs text-slate-300">{activeQueue.doctor?.specialty} • {activeQueue.doctor?.clinic_name}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Your Token</span>
                <span className="text-2xl font-black text-teal-400">#{activeQueue.token_number}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Current Serving</span>
                <span className="text-2xl font-black text-white">#{activeQueue.current_token}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Est Wait</span>
                <span className="text-2xl font-black text-amber-300">~{activeQueue.estimated_wait_mins}m</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Saved Doctors & Past Visits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Providers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Saved Healthcare Providers
          </h3>

          <div className="space-y-3">
            {savedDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doc.image_url}
                    alt={doc.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                    <p className="text-[11px] text-teal-700 font-semibold">{doc.specialty}</p>
                    <p className="text-[10px] text-slate-500">{doc.clinic_name}</p>
                  </div>
                </div>

                <Link
                  to={`/patient/doctors/${doc.id}`}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Profile
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Visits */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            Recent Clinic Visits
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Dr. Raj Sharma</h4>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>
              <p className="text-[11px] text-slate-500">Dermatology • Apex Skin & Laser Clinic</p>
              <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Consultation Completed
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Dr. Ananya Sen</h4>
                <span className="text-[10px] text-slate-400">2 weeks ago</span>
              </div>
              <p className="text-[11px] text-slate-500">Dentistry • SmileCraft Dental Studio</p>
              <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Consultation Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
