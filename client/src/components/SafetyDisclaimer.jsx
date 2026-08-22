import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export default function SafetyDisclaimer({ variant = 'banner' }) {
  if (variant === 'small') {
    return (
      <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/60">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-700">Medical Safety Notice:</strong> Care Connect does not provide medical diagnosis or treatment. Specialty suggestions are for healthcare navigation only. If you are experiencing a medical emergency, contact local emergency services or visit the nearest emergency department.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 my-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-semibold text-amber-950">Important Medical Safety Boundary:</span> Care Connect does not provide medical diagnosis or treatment. Specialty suggestions are for healthcare navigation only. If you are experiencing a medical emergency, contact local emergency services or visit the nearest emergency department.
        </div>
      </div>
    </div>
  );
}
