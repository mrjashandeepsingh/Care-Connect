import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  LogOut,
  MapPin,
  Phone,
  Sparkles,
  Bell,
  Stethoscope,
  ChevronRight,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SafetyDisclaimer from '../components/SafetyDisclaimer';
import confetti from 'canvas-confetti';

export default function PatientQueuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [pastVisits, setPastVisits] = useState([]);
  const [hasCelebratedNext, setHasCelebratedNext] = useState(false);

  const fetchLiveQueue = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.queue.getPatientQueue(user?.id || 'patient-1');
      if (res.hasActiveQueue) {
        setQueueData(res.activeQueue);

        // Confetti when patient is next
        if (res.activeQueue.is_next && !hasCelebratedNext) {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.5 }
          });
          setHasCelebratedNext(true);
        }
      } else {
        setQueueData(null);
        setPastVisits(res.recentVisits || []);
      }
    } catch (err) {
      console.error('Error fetching patient live queue:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveQueue();
    // Poll every 3 seconds for real-time doctor advances
    const interval = setInterval(() => {
      fetchLiveQueue(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [user?.id, hasCelebratedNext]);

  const handleLeaveQueue = async () => {
    if (!window.confirm('Are you sure you want to cancel your place in the digital queue?')) {
      return;
    }

    setLeaving(true);
    try {
      await api.queue.leave({
        queueId: queueData?.id,
        patientId: user?.id || 'patient-1'
      });
      setQueueData(null);
      await fetchLiveQueue(true);
    } catch (err) {
      console.error('Error leaving queue:', err);
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Connecting to real-time clinic queue...</p>
      </div>
    );
  }

  // If no active queue
  if (!queueData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">No Active Queue Token</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            You are not currently in any digital clinic queue. Search for a nearby healthcare provider and join their queue to track your position in real-time.
          </p>
          <div className="pt-2">
            <Link
              to="/patient/doctors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all"
            >
              Find a Doctor & Join Queue
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Past Visit History */}
        {pastVisits.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Completed Clinic Visits
            </h3>
            <div className="space-y-3">
              {pastVisits.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{v.doctor_name}</h4>
                    <p className="text-[11px] text-slate-500">{v.doctor_specialty} • {v.clinic_name}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed (Token #{v.token_number})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const doctor = queueData.doctor;
  const isConsulting = queueData.status === 'consulting';
  const isNext = queueData.is_next && !isConsulting;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Real-time Alert Banner when Next */}
      {(isNext || isConsulting) && (
        <div
          className={`p-5 rounded-3xl text-white shadow-xl flex items-center justify-between gap-4 animate-in zoom-in duration-200 ${
            isConsulting
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
              : 'bg-gradient-to-r from-amber-500 to-rose-500 animate-urgent-glow'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {isConsulting
                  ? "🩺 You're in consultation now!"
                  : "🔔 You're next! Please proceed to the clinic."}
              </h3>
              <p className="text-xs text-white/90">
                {isConsulting
                  ? `You are currently in consultation with ${doctor?.name || 'the doctor'}.`
                  : `Doctor is ready for Token #${queueData.token_number}. Please walk into ${doctor?.clinic_name || 'the clinic'}.`}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white text-slate-900 text-xs font-black rounded-xl shadow-xs shrink-0">
            {isConsulting ? 'Active' : 'Turn Ready'}
          </span>
        </div>
      )}

      {/* Main Queue Status Board */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Sync Active
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Digital Queue Tracker
            </h1>
            <p className="text-xs text-slate-500">
              Real-time waiting room updates. Refresh or track live from anywhere.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLiveQueue(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>

            <button
              onClick={handleLeaveQueue}
              disabled={leaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Queue</span>
            </button>
          </div>
        </div>

        {/* 4-Stat Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Your Token */}
          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 text-center space-y-1">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide">
              Your Token
            </span>
            <div className="text-3xl font-black text-teal-900">
              #{queueData.token_number}
            </div>
            <span className="text-[10px] text-teal-700 font-medium">Assigned Today</span>
          </div>

          {/* Current Serving */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Current Serving
            </span>
            <div className="text-3xl font-black text-slate-900">
              #{queueData.current_token || 14}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Inside Doctor Room</span>
          </div>

          {/* Patients Ahead */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Patients Ahead
            </span>
            <div className="text-3xl font-black text-slate-900">
              {queueData.patients_ahead}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">In Waiting Line</span>
          </div>

          {/* Est Wait */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-center space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
              Estimated Wait
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-950">
              ~{queueData.estimated_wait_mins}m
            </div>
            <span className="text-[10px] text-amber-700 font-medium">Dynamic ETA</span>
          </div>
        </div>

        {/* Doctor & Clinic Card */}
        {doctor && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={doctor.image_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'}
                alt={doctor.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{doctor.name}</h3>
                <p className="text-xs font-semibold text-teal-700">{doctor.specialty} • {doctor.clinic_name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {doctor.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${doctor.clinic_name}, ${doctor.address}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Directions
              </a>
              <Link
                to={`/patient/doctors/${doctor.id}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}

        <div className="pt-2">
          <SafetyDisclaimer variant="small" />
        </div>
      </div>
    </div>
  );
}
