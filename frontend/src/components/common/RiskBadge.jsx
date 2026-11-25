import React from 'react';
import { AlertTriangle, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RiskBadge({ level, size = 'md' }) {
  const normalized = (level || 'low').toLowerCase();

  const configs = {
    extreme: {
      label: 'Extreme Risk',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-600',
      icon: Flame,
    },
    high: {
      label: 'High Risk',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-600',
      icon: AlertTriangle,
    },
    moderate: {
      label: 'Moderate Risk',
      bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      dot: 'bg-yellow-600',
      icon: ShieldAlert,
    },
    low: {
      label: 'Low / Safe',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-600',
      icon: CheckCircle2,
    },
  };

  const current = configs[normalized] || configs.low;
  const Icon = current.icon;

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5 gap-1' 
    : size === 'lg'
    ? 'text-sm px-3 py-1.5 gap-2 font-medium'
    : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${current.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
}
