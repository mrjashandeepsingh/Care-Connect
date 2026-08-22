import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export default function ProviderCard({ doctor, isTopMatch = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);

  const handleJoinQueue = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setJoining(true);
    setJoinError(null);

    try {
      const res = await api.queue.join({
        doctorId: doctor.id,
        patientId: user?.id || 'patient-1',
        patientName: user?.name || 'Jashandeep Singh',
        patientPhone: user?.phone || '+91 98765 43210'
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Navigate to patient queue page
      navigate('/patient/queue');
    } catch (err) {
      setJoinError(err.message || 'Failed to join queue');
    } finally {
      setJoining(false);
    }
  };

  const isAccepting = doctor.status === 'open' && doctor.is_accepting;

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg ${
        isTopMatch
          ? 'border-teal-400/90 shadow-md ring-1 ring-teal-300/50 bg-gradient-to-b from-teal-50/20 to-white'
          : 'border-slate-200/90 shadow-xs hover:border-slate-300'
      }`}
    >
      {/* Top Match Badge */}
      {isTopMatch && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-600 text-white text-[11px] font-bold shadow-xs tracking-wide">
          <Sparkles className="w-3 h-3 text-teal-200" />
          BEST OVERALL MATCH
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Doctor Photo */}
        <div className="relative shrink-0">
          <img
            src={doctor.image_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'}
            alt={doctor.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-inner"
          />
          {isAccepting ? (
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
              title="Accepting Patients"
            />
          ) : (
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-400 border-2 border-white rounded-full"
              title="Closed"
            />
          )}
        </div>

        {/* Doctor Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 hover:text-teal-700 transition-colors">
                  <Link to={`/patient/doctors/${doctor.id}`}>{doctor.name}</Link>
                </h3>
                {doctor.verified && (
                  <span title="Verified Clinic Practitioner">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-teal-700">{doctor.specialty}</p>
            </div>

            {/* Fee */}
            <div className="text-right">
              <span className="text-base font-extrabold text-slate-900">₹{doctor.fee}</span>
              <span className="text-[10px] text-slate-500 block -mt-0.5">consultation</span>
            </div>
          </div>

          {/* Sub details: Rating, Experience, Clinic */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {doctor.rating}
              <span className="text-slate-400 font-normal">({doctor.reviews_count || 120}+)</span>
            </span>

            <span>•</span>
            <span className="font-medium">{doctor.experience} yrs exp</span>

            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {doctor.distance_km} km away
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1.5 truncate">
            {doctor.clinic_name} — <span className="text-slate-400">{doctor.address}</span>
          </p>

          {/* Real-time Status Card */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAccepting ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-xs font-semibold text-slate-800">
                {isAccepting ? 'Accepting Patients' : 'Currently Closed'}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-600">
                Current token: <strong className="text-slate-900">#{doctor.current_token || 14}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              Estimated wait: ~{doctor.estimated_wait_mins || 12} min
            </div>
          </div>

          {/* Why Recommended Pills */}
          {doctor.recommendation_reasons && doctor.recommendation_reasons.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Why this provider is recommended:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {doctor.recommendation_reasons.map((reason, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          {joinError && (
            <p className="text-xs text-red-600 mt-2 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
              {joinError}
            </p>
          )}

          {/* Action CTAs */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <Link
              to={`/patient/doctors/${doctor.id}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              View Profile & Reviews
            </Link>

            <button
              onClick={handleJoinQueue}
              disabled={joining || !isAccepting}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
                isAccepting
                  ? 'bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/20 active:scale-95'
                  : 'bg-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              {joining ? (
                <span>Joining Queue...</span>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Join Digital Queue</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
