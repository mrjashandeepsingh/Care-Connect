import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  Stethoscope,
  Heart,
  Baby,
  Smile,
  Bone,
  Eye,
  Activity,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import SafetyDisclaimer from '../components/SafetyDisclaimer';
import EmergencyModal from '../components/EmergencyModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Bengaluru (Bellandur / HSR / Koramangala)');
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    const query = prompt.trim();
    if (!query) {
      navigate('/patient/doctors');
      return;
    }

    setLoading(true);
    try {
      const res = await api.ai.classify(query);
      if (res.isEmergency) {
        setEmergencyData(res);
        setLoading(false);
        return;
      }

      // Navigate to doctor search with AI matched specialty
      navigate(
        `/patient/doctors?q=${encodeURIComponent(query)}&specialty=${encodeURIComponent(
          res.specialty
        )}&reasoning=${encodeURIComponent(res.reasoning || '')}`
      );
    } catch (err) {
      console.error(err);
      navigate(`/patient/doctors?q=${encodeURIComponent(query)}`);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'I have persistent skin itching and rash',
    'I have severe tooth pain and gum swelling',
    'My child has a high fever and cough',
    'I have knee pain after playing sports'
  ];

  const specialties = [
    {
      name: 'General Physician',
      icon: Activity,
      desc: 'Viral fever, body aches, colds & general checkups',
      count: '14+ doctors'
    },
    {
      name: 'Dermatology',
      icon: Sparkles,
      desc: 'Skin rashes, acne, allergies, itching & hair care',
      count: '12+ doctors',
      featured: true
    },
    {
      name: 'Dentistry',
      icon: Smile,
      desc: 'Toothache, cavities, root canal & dental hygiene',
      count: '8+ doctors'
    },
    {
      name: 'Orthopedics',
      icon: Bone,
      desc: 'Joint pain, knee discomfort, fractures & backache',
      count: '9+ doctors'
    },
    {
      name: 'Pediatrics',
      icon: Baby,
      desc: 'Child healthcare, vaccinations, toddler wellness',
      count: '10+ doctors'
    },
    {
      name: 'Cardiology',
      icon: Heart,
      desc: 'Heart checks, blood pressure, ECG & lipid control',
      count: '6+ doctors'
    },
    {
      name: 'ENT',
      icon: Stethoscope,
      desc: 'Sinus, earache, throat infection, tonsil care',
      count: '7+ doctors'
    },
    {
      name: 'Gynecology',
      icon: Users,
      desc: "Women's wellness, PCOS, prenatal, cycle care",
      count: '8+ doctors'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      <EmergencyModal
        isOpen={!!emergencyData}
        onClose={() => setEmergencyData(null)}
        details={emergencyData}
      />

      {/* Hero Section */}
      <section className="relative pt-8 pb-12 overflow-hidden bg-gradient-to-b from-teal-50/50 via-slate-50 to-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Navigation Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold border border-teal-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>✨ Smart Healthcare Navigation</span>
              <span className="text-teal-400">•</span>
              <span className="text-teal-900 font-medium">Real-Time Digital Queue</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find the right doctor.{' '}
              <span className="text-teal-600 block sm:inline">Without the long wait.</span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover suitable healthcare providers near you based on your concern, location, consultation fee, availability, and real-time digital queue waiting times.
            </p>
          </div>

          {/* Primary Search Container */}
          <div className="max-w-3xl mx-auto mt-8 bg-white p-4 sm:p-5 rounded-3xl shadow-xl border border-slate-200/90 relative">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              {/* Concern Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-600">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="What do you need help with? e.g. I have a skin rash and itching"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>

              {/* Location & Submit Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600 w-full sm:w-auto bg-slate-100/80 px-3.5 py-2.5 rounded-xl border border-slate-200/60">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="truncate font-medium">{selectedCity}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md hover:shadow-teal-500/25 active:scale-95 transition-all disabled:opacity-75"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Understanding concern...</span>
                      </>
                    ) : (
                      <>
                        <span>Find the Right Doctor</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Example Pills */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Or try an example concern:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(p);
                    }}
                    className="text-xs text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 px-3 py-1 rounded-full border border-slate-200/80 transition-all text-left"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>

            {/* Micro disclaimer */}
            <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
              <span>✨ Smart intent-based matching (Not a diagnostic prescription)</span>
              <span className="text-teal-700 font-medium">18+ Local Clinics Live</span>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-4">
            <SafetyDisclaimer variant="small" />
          </div>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What kind of care are you looking for?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select a specialty to discover top-rated nearby doctors and their real-time waiting queues.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {specialties.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/patient/doctors?specialty=${encodeURIComponent(spec.name)}`)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                  spec.featured
                    ? 'bg-gradient-to-b from-teal-50/40 to-white border-teal-300 shadow-xs hover:shadow-md'
                    : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{spec.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span>{spec.count}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Transparent Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Know where to go. Know when to go.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Care Connect closes the uncertainty loop between discovering a clinic and actually stepping into the doctor's room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Healthcare Concern',
                desc: 'Describe your symptom in natural language without medical jargon.'
              },
              {
                step: '02',
                title: 'Specialty Matching',
                desc: 'Smart navigation suggests the appropriate medical specialty category.'
              },
              {
                step: '03',
                title: 'Smart Provider Ranking',
                desc: 'Rank nearby doctors by distance, fee, rating, and live waiting time.'
              },
              {
                step: '04',
                title: 'Digital Queue & Visit',
                desc: 'Join the queue remotely, track your token live, and arrive right on time.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative space-y-3"
              >
                <span className="text-2xl font-black text-teal-400/30">{item.step}</span>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Doctors Section */}
      <section id="for-doctors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Building2 className="w-3.5 h-3.5" />
              For Independent Doctors & Small Clinics
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Turn your local clinic into a smarter practice.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Help nearby patients discover you and manage your patient queue digitally. Reduce waiting-room congestion and elevate the patient experience effortlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              {[
                'Increase local visibility to relevant patients',
                'Zero-hardware digital queue management',
                'Eliminate crowded clinic waiting rooms',
                'Real-time token call system with 1-click',
                'Understand clinic traffic & patient flow'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  switchRole('doctor');
                  navigate('/doctor/dashboard');
                }}
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Launch Doctor Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Safety Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Safety & Ethics
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Built for healthcare navigation, not diagnosis.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Care Connect is strictly a discovery and waiting-time transparency platform designed to direct patients to certified local practitioners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900">No Medical Diagnosis</h4>
              <p className="text-slate-500 leading-relaxed">
                AI categorizes user symptom queries strictly to direct them to the appropriate medical field (e.g. Skin $\rightarrow$ Dermatology).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900">No Drug Prescriptions</h4>
              <p className="text-slate-500 leading-relaxed">
                Care Connect never prescribes medications or suggests home remedies. Prescriptions must come from certified doctors during consultation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900">Emergency Redirection</h4>
              <p className="text-slate-500 leading-relaxed">
                Any query suggesting acute trauma, chest pain, or respiratory distress triggers immediate emergency services contact information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
