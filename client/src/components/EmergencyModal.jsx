import React from 'react';
import { AlertOctagon, PhoneCall, MapPin, X } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose, details }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-urgent-glow">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-700">Urgent Medical Warning</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Immediate Attention Recommended
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-red-900 mb-1">
            This may require urgent medical attention.
          </p>
          <p className="text-xs text-red-800 leading-relaxed">
            {details?.reasoning ||
              'If you believe this is an emergency, seek immediate medical care or contact local emergency services. Care Connect is a healthcare navigation platform and cannot evaluate acute life-threatening situations.'}
          </p>
        </div>

        <div className="space-y-2.5">
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            Call Emergency Services (112 / 911)
          </a>

          <a
            href="https://www.google.com/maps/search/emergency+hospital+near+me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors border border-slate-200"
          >
            <MapPin className="w-4 h-4 text-red-500" />
            Find Nearest Emergency Room on Maps
          </a>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            I understand, return to standard navigation
          </button>
        </div>
      </div>
    </div>
  );
}
