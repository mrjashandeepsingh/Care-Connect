import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-900 font-bold">
                <Activity className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Care Connect
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Real-time local healthcare access and digital queue-management platform. Know where to go and know when to go, eliminating crowded waiting rooms.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Specialty navigation, not medical diagnosis</span>
            </div>
          </div>

          {/* Patient Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              For Patients
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/patient/doctors" className="hover:text-teal-400 transition-colors">
                  Find Nearby Doctors
                </Link>
              </li>
              <li>
                <Link to="/patient/queue" className="hover:text-teal-400 transition-colors">
                  Track Live Queue
                </Link>
              </li>
              <li>
                <Link to="/patient/profile" className="hover:text-teal-400 transition-colors">
                  Patient Dashboard
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-teal-400 transition-colors">
                  How Care Connect Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Provider Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              For Healthcare Providers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/doctor/dashboard" className="hover:text-teal-400 transition-colors">
                  Doctor Portal
                </Link>
              </li>
              <li>
                <Link to="/doctor/queue" className="hover:text-teal-400 transition-colors">
                  Live Queue Management
                </Link>
              </li>
              <li>
                <Link to="/doctor/profile" className="hover:text-teal-400 transition-colors">
                  Clinic Profile Setup
                </Link>
              </li>
              <li>
                <Link to="/#for-doctors" className="hover:text-teal-400 transition-colors">
                  Smart Clinic Benefits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="pt-8 space-y-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Important Medical Disclaimer:</strong> Care Connect does not provide medical diagnosis, clinical treatment plans, or prescription recommendations. Specialty suggestions are solely for healthcare provider navigation. If you or someone around you is experiencing a medical emergency, immediately contact local emergency services (112 / 911) or visit the nearest emergency department.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>© {new Date().getFullYear()} Care Connect. Built for 24-Hour Hackathon Demo.</p>
            <p className="flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for smarter local healthcare access.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
