import React, { useState } from 'react';
import {
  Building2,
  Users,
  ThermometerSun,
  Droplets,
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  Clock,
  Plus,
  ExternalLink,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';

export default function WorksitesView({
  worksites,
  searchQuery,
  selectedSite = 'all',
  onSelectSite,
  setActiveTab,
}) {
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedSiteModal, setSelectedSiteModal] = useState(null);

  // Filter worksites based on search query, dropdown site, and risk filter
  const filteredWorksites = worksites.filter((site) => {
    const matchesSite = selectedSite === 'all' || site.id === selectedSite;
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.supervisor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = riskFilter === 'all' || site.riskLevel === riskFilter;

    return matchesSite && matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Uttar Pradesh Worksites Directory</h2>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              8 Monitored Sites
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered industrial, infrastructure, and field worksites with environmental heat index metrics
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'extreme', 'high', 'moderate', 'low'].map((tier) => (
            <button
              key={tier}
              onClick={() => setRiskFilter(tier)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                riskFilter === tier
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tier === 'all' ? 'All Risks' : `${tier.charAt(0).toUpperCase() + tier.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Environmental Metric Disclaimer */}
      <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Metric Distinction Notice:</span> Values displayed are calculated <strong>Heat Index</strong> from ambient temperature and relative humidity. True WBGT requires physical black globe and natural wet-bulb sensors.
          <span className="block font-semibold text-amber-800 mt-0.5">Environmental heat estimate — not measured WBGT</span>
        </div>
      </div>

      {/* Grid of Worksite Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorksites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Header: Type & Risk Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {site.type}
                </span>
                <RiskBadge level={site.riskLevel} size="sm" />
              </div>

              {/* Worksite Name & Location */}
              <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                {site.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {site.location}
              </p>

              {/* Thermal Telemetry Strip: Separating Ambient, Heat Index, and Humidity */}
              <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ambient Temp</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {site.temp}°C
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-amber-800">Heat Index</p>
                  <p className="text-base font-extrabold text-amber-600 mt-0.5">
                    {site.heatIndex}°C
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Rel. Humidity</p>
                  <p className="text-base font-extrabold text-slate-700 mt-0.5">
                    {site.humidity}%
                  </p>
                </div>
              </div>

              {/* Scientific Tag */}
              <div className="mt-2 text-[10px] text-center font-medium text-amber-800 bg-amber-50/70 border border-amber-100 rounded px-2 py-0.5">
                Environmental heat estimate — not measured WBGT
              </div>

              {/* Personnel & Shift Details */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Crew Size:
                  </span>
                  <span className="font-semibold text-slate-800">{site.workers} Workers</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Shift:
                  </span>
                  <span className="font-semibold text-slate-800">{site.shift}</span>
                </div>
              </div>

              {/* Active Safeguards */}
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Active Measures
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {site.activeMeasures.map((measure, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md px-2 py-0.5 font-medium"
                    >
                      {measure}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Updated {site.lastUpdated}</span>
              <button
                onClick={() => setSelectedSiteModal(site)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Site Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWorksites.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No worksites match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or risk filter.</p>
          <button
            onClick={() => {
              setRiskFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Modal: Site Detail & Safety Checklist */}
      {selectedSiteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedSiteModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                {selectedSiteModal.type}
              </span>
              <RiskBadge level={selectedSiteModal.riskLevel} size="sm" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">{selectedSiteModal.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {selectedSiteModal.location}
            </p>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold block text-amber-950">Environmental heat estimate — not measured WBGT</span>
              <p className="text-[11px] mt-0.5 text-amber-800">
                Calculated from dry-bulb temperature ({selectedSiteModal.temp}°C) and relative humidity ({selectedSiteModal.humidity}%). True physical WBGT requires black globe radiometer instrumentation.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400">Supervisor in Charge:</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedSiteModal.supervisor}</p>
              </div>
              <div>
                <span className="text-slate-400">Current Advisory:</span>
                <p className="font-bold text-rose-700 mt-0.5">{selectedSiteModal.status}</p>
              </div>
              <div>
                <span className="text-slate-400">Ambient Temperature (Dry-Bulb):</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedSiteModal.temp}°C</p>
              </div>
              <div>
                <span className="text-slate-400">Calculated Heat Index:</span>
                <p className="font-bold text-amber-700 mt-0.5">{selectedSiteModal.heatIndex}°C (HI)</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Physical WBGT Sensor Status:</span>
                <p className="font-semibold text-slate-600 mt-0.5">Unmeasured — Dedicated Black Globe Triad Sensor Required</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Implemented On-Site Defenses
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedSiteModal.activeMeasures.map((measure, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">{measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedSiteModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedSiteModal(null);
                  setActiveTab('safety-actions');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Manage Action Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
