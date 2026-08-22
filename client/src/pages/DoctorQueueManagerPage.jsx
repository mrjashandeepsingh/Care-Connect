import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  UserCheck,
  CheckCircle2,
  SkipForward,
  RotateCcw,
  Stethoscope,
  Phone,
  ArrowRight,
  AlertCircle,
  Bell,
  Check,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function DoctorQueueManagerPage() {
  const { user } = useAuth();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callingNext, setCallingNext] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const doctorId = 'doc-1'; // Dr. Raj Sharma

  const fetchLiveQueue = async () => {
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
    fetchLiveQueue();
    const interval = setInterval(fetchLiveQueue, 2500); // Fast live polling
    return () => clearInterval(interval);
  }, []);

  const handleCallNext = async () => {
    setCallingNext(true);
    setActionMessage(null);
    try {
      const res = await api.queue.callNext(doctorId);
      setActionMessage(res.message);

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.5 }
      });

      await fetchLiveQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setCallingNext(false);
    }
  };

  const handleComplete = async () => {
    try {
      const res = await api.queue.complete(doctorId);
      setActionMessage(res.message);
      await fetchLiveQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async (queueId) => {
    try {
      const res = await api.queue.skip({ queueId, doctorId });
      setActionMessage(res.message);
      await fetchLiveQueue();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Connecting to live clinic queue...</p>
      </div>
    );
  }

  const doctor = queueData?.doctor;
  const consulting = queueData?.consulting;
  const waiting = queueData?.waiting || [];
  const completed = queueData?.completed || [];
  const skipped = queueData?.skipped || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Live Digital Queue Desk
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {doctor?.name || 'Dr. Raj Sharma'} — Clinic Queue
          </h1>
          <p className="text-xs text-slate-500">
            {doctor?.clinic_name} • Current Serving Token: <strong className="text-slate-900">#{queueData?.overview?.currentToken || 14}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/doctor/dashboard"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={fetchLiveQueue}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>🔔 {actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-teal-700 hover:text-teal-900 font-bold">✕</button>
        </div>
      )}

      {/* Main Active Consulting Patient Card */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Stethoscope className="w-3.5 h-3.5" />
            Currently Consulting Patient
          </span>

          <div className="text-xs text-slate-300">
            {waiting.length} patient{waiting.length !== 1 ? 's' : ''} waiting in line
          </div>
        </div>

        {consulting ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
                #{consulting.token_number}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{consulting.patient_name}</h3>
                <p className="text-xs text-teal-200 font-medium flex items-center gap-2 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-teal-300" />
                  {consulting.patient_phone || 'Demo Patient Phone'}
                </p>
                <span className="inline-block text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded mt-1 border border-emerald-500/30">
                  🟢 In Doctor Cabin
                </span>
              </div>
            </div>

            {/* Action Buttons for Current Patient */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={handleCallNext}
                disabled={callingNext}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" />
                <span>Call Next Patient</span>
              </button>

              <button
                onClick={handleComplete}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Complete</span>
              </button>

              <button
                onClick={() => handleSkip(consulting.id)}
                className="px-3.5 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                title="Skip Patient"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/10 text-slate-300 flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Patient Currently in Cabin</h3>
              <p className="text-xs text-slate-300 mt-1">
                {waiting.length > 0
                  ? `${waiting.length} patient(s) are waiting in queue. Click below to call the next patient.`
                  : 'The queue is currently empty. Patients joining online will appear here.'}
              </p>
            </div>

            {waiting.length > 0 && (
              <button
                onClick={handleCallNext}
                disabled={callingNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow-lg transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Call Token #{waiting[0].token_number} ({waiting[0].patient_name})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Waiting List Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Waiting Line ({waiting.length})</h2>
            <p className="text-xs text-slate-500">Patients waiting in virtual / physical queue</p>
          </div>

          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Est. Total Wait: ~{waiting.length * (doctor?.avg_consult_time_mins || 10)} min
          </span>
        </div>

        {waiting.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No waiting patients in queue.
          </div>
        ) : (
          <div className="space-y-2.5">
            {waiting.map((patient, idx) => (
              <div
                key={patient.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                  idx === 0
                    ? 'bg-amber-50/50 border-amber-300/80 shadow-xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                    #{patient.token_number}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      {patient.patient_name}
                      {idx === 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                          Next in Line
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Phone: {patient.patient_phone || 'Demo Phone'} • Waiting: ~{(idx + 1) * (doctor?.avg_consult_time_mins || 10)} min
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCallNext}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs transition-colors"
                  >
                    Call Now
                  </button>
                  <button
                    onClick={() => handleSkip(patient.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                    title="Skip Patient"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Patients History */}
      {completed.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed Today ({completed.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {completed.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800">Token #{c.token_number}</span>
                  <p className="text-slate-500 text-[11px]">{c.patient_name}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
