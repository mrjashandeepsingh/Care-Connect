import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, RotateCcw, User, Stethoscope, ChevronRight, CheckCircle2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DemoBar() {
  const { role, user, switchRole } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      setResetting(true);
      await api.queue.resetDemo();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const demoSteps = [
    { step: 1, text: 'Open Care Connect landing page', route: '/' },
    { step: 2, text: 'Enter concern: "I have a skin rash and itching."', route: '/?q=I+have+a+skin+rash+and+itching.' },
    { step: 3, text: 'AI matches specialty: Dermatology', route: '/patient/doctors?specialty=Dermatology' },
    { step: 4, text: 'View ranked dermatologists (Dr. Raj Sharma #1)', route: '/patient/doctors?specialty=Dermatology' },
    { step: 5, text: 'Open Dr. Raj Sharma profile & Click "Join Queue"', route: '/patient/doctors/doc-1' },
    { step: 6, text: 'Patient receives Token #17 with live wait time', route: '/patient/queue' },
    { step: 7, text: 'Switch role to Doctor Dashboard (Dr. Raj Sharma)', role: 'doctor', route: '/doctor/queue' },
    { step: 8, text: 'Doctor clicks "Call Next Patient"', route: '/doctor/queue' },
    { step: 9, text: 'Switch back to Patient: Live alert "🔔 You\'re next!"', role: 'patient', route: '/patient/queue' },
  ];

  return (
    <>
      <div className="bg-slate-900 text-white text-xs font-medium py-1.5 px-4 shadow-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Demo Mode
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Active: <span className="text-white font-medium capitalize">{role === 'doctor' ? 'Dr. Raj Sharma (Doctor)' : `${user?.name || 'Patient'}`}</span>
            </span>
          </div>

          {/* Center / Right quick switches */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDemoGuide(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-colors"
              title="View Hackathon Presentation Flow"
            >
              <Play className="w-3 h-3 text-indigo-400" />
              <span>Judging Script</span>
            </button>

            {role === 'patient' ? (
              <button
                onClick={() => {
                  switchRole('doctor');
                  navigate('/doctor/dashboard');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white transition-colors"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Switch to Doctor View</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  switchRole('patient');
                  navigate('/patient/queue');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Switch to Patient View</span>
              </button>
            )}

            <button
              onClick={handleReset}
              disabled={resetting}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 disabled:opacity-50"
              title="Reset Demo Queues to Initial State"
            >
              <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Judging Flow Modal */}
      {showDemoGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                  CC
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hackathon Presentation Script</h3>
                  <p className="text-xs text-slate-500">Live 11-Step Interactive Demo Walkthrough</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoGuide(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {demoSteps.map((s, idx) => (
                <div
                  key={idx}
                  onClick={async () => {
                    if (s.role) await switchRole(s.role);
                    navigate(s.route);
                    setShowDemoGuide(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      {s.step}
                    </span>
                    <span className="text-xs text-slate-800 font-medium group-hover:text-teal-900">
                      {s.text}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowDemoGuide(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Close Script
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
