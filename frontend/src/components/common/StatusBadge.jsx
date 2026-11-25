import React from 'react';
import { CheckCircle2, Clock, AlertOctagon, CheckCheck, RefreshCw } from 'lucide-react';

export default function StatusBadge({ status, type = 'status' }) {
  const norm = (status || '').toLowerCase().replace(/\s+/g, '_');

  const configs = {
    // Evidence & Action verification
    verified: {
      label: 'Verified On-Site',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCheck,
    },
    completed: {
      label: 'Completed',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    pending: {
      label: 'Pending Review',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
    },
    flagged: {
      label: 'Flagged / Deficit',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertOctagon,
    },
    overdue: {
      label: 'Overdue',
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: AlertOctagon,
    },
    // Worker report status
    open: {
      label: 'Open Hazard',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertOctagon,
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: RefreshCw,
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
  };

  const current = configs[norm] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };

  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  );
}
