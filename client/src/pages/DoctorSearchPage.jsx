import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Zap,
  DollarSign,
  Star,
  Sparkles,
  Info,
  RotateCcw,
  Check,
  Building2,
  Clock,
  Compass
} from 'lucide-react';
import ProviderCard from '../components/ProviderCard';
import SafetyDisclaimer from '../components/SafetyDisclaimer';
import EmergencyModal from '../components/EmergencyModal';
import { api } from '../services/api';

export default function DoctorSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const specialtyParam = searchParams.get('specialty') || '';
  const reasoningParam = searchParams.get('reasoning') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [specialty, setSpecialty] = useState(specialtyParam);
  const [aiReasoning, setAiReasoning] = useState(reasoningParam);
  const [priority, setPriority] = useState('best_match'); // 'best_match' | 'fastest' | 'nearest' | 'cheapest' | 'highest_rated'

  const [maxDistance, setMaxDistance] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [minRating, setMinRating] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);

  // Specialties list for dropdown
  const allSpecialties = [
    'All Specialties',
    'Dermatology',
    'General Physician',
    'Dentistry',
    'Orthopedics',
    'Pediatrics',
    'Cardiology',
    'ENT',
    'Gynecology'
  ];

  // Fetch doctors whenever filters or priority change
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.doctors.search({
        specialty: specialty === 'All Specialties' ? '' : specialty,
        priority,
        maxFee,
        maxDistance,
        onlyOpen: onlyOpen ? 'true' : 'false',
        minRating
      });

      setDoctors(res.doctors || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty, priority, maxDistance, maxFee, onlyOpen, minRating]);

  // Handle Intent Search submission
  const handleIntentSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSpecialty('All Specialties');
      setAiReasoning('');
      return;
    }

    setAiLoading(true);
    try {
      const res = await api.ai.classify(searchQuery.trim());
      if (res.isEmergency) {
        setEmergencyData(res);
        setAiLoading(false);
        return;
      }

      setSpecialty(res.specialty);
      setAiReasoning(res.reasoning || '');
      setSearchParams({
        q: searchQuery.trim(),
        specialty: res.specialty,
        reasoning: res.reasoning || ''
      });
    } catch (err) {
      console.error('AI Classification error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <EmergencyModal
        isOpen={!!emergencyData}
        onClose={() => setEmergencyData(null)}
        details={emergencyData}
      />

      {/* Top Search & Intent Analysis Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        <form onSubmit={handleIntentSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-teal-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your health concern... e.g. persistent skin itching, toothache"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={specialty}
              onChange={(e) => {
                setSpecialty(e.target.value);
                setAiReasoning('');
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {allSpecialties.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={aiLoading}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Match Specialty</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* AI Navigation Result Badge */}
        {specialty && specialty !== 'All Specialties' && (
          <div className="p-3.5 rounded-2xl bg-teal-50/90 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                  Suggested Specialty: <span className="underline decoration-teal-500 underline-offset-2">{specialty}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-200 text-teal-900">
                    Smart Navigation
                  </span>
                </p>
                {aiReasoning && (
                  <p className="text-xs text-teal-800 mt-0.5 leading-snug">
                    {aiReasoning}
                  </p>
                )}
                <p className="text-[10px] text-teal-700/80 mt-1 italic">
                  This is a healthcare navigation suggestion, not a medical diagnosis.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSpecialty('All Specialties');
                setAiReasoning('');
                setSearchQuery('');
              }}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline shrink-0"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                Refine Search
              </h3>
              <button
                onClick={() => {
                  setMaxDistance('');
                  setMaxFee('');
                  setOnlyOpen(false);
                  setMinRating('');
                  setPriority('best_match');
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
              >
                Reset All
              </button>
            </div>

            {/* Max Distance */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Max Distance</span>
                <span className="text-slate-400">{maxDistance ? `${maxDistance} km` : 'Any'}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['2', '5', '10'].map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => setMaxDistance(maxDistance === dist ? '' : dist)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                      maxDistance === dist
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    &lt; {dist} km
                  </button>
                ))}
              </div>
            </div>

            {/* Max Consultation Fee */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Max Fee</span>
                <span className="text-slate-400">{maxFee ? `₹${maxFee}` : 'Any'}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['300', '500', '700'].map((fee) => (
                  <button
                    key={fee}
                    type="button"
                    onClick={() => setMaxFee(maxFee === fee ? '' : fee)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                      maxFee === fee
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ≤ ₹{fee}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Rating */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Rating</span>
                <span className="text-slate-400">{minRating ? `${minRating}+ ⭐` : 'Any'}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['4.5', '4.7', '4.8'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(minRating === r ? '' : r)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                      minRating === r
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r}+ ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Only Open Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOpen}
                  onChange={(e) => setOnlyOpen(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Only show accepting clinics</span>
              </label>
            </div>
          </div>

          <SafetyDisclaimer variant="small" />
        </div>

        {/* Doctor List Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Smart Ranking Priority Selector */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                What matters most?
              </span>
              <p className="text-xs text-slate-600">
                Found <strong className="text-slate-900">{doctors.length}</strong> {specialty === 'All Specialties' ? 'healthcare providers' : `${specialty} specialists`}
              </p>
            </div>

            {/* Priority Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'best_match', label: '🎯 Best Match' },
                { id: 'fastest', label: '⚡ Fastest' },
                { id: 'nearest', label: '📍 Nearest' },
                { id: 'cheapest', label: '💰 Lowest Fee' },
                { id: 'highest_rated', label: '⭐ Top Rated' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPriority(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    priority === tab.id
                      ? 'bg-white text-teal-800 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-2xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No doctors match your current filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your distance, increasing your maximum fee, or clearing active filters to discover nearby practitioners.
              </p>
              <button
                onClick={() => {
                  setMaxDistance('');
                  setMaxFee('');
                  setOnlyOpen(false);
                  setMinRating('');
                  setSpecialty('All Specialties');
                }}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doc, idx) => (
                <ProviderCard
                  key={doc.id}
                  doctor={doc}
                  isTopMatch={idx === 0 && priority === 'best_match'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
