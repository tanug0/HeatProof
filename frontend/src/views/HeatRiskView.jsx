import React, { useState, useEffect } from 'react';
import {
  ThermometerSun,
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
  Clock,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen,
  AlertOctagon,
  Activity,
  UserCheck,
  UserX,
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';

export default function HeatRiskView({ hourlyForecast, worksites, externalSelectedSiteId }) {
  // Calculator state
  const [workload, setWorkload] = useState('heavy');
  const [clothing, setClothing] = useState('standard');
  const [acclimatization, setAcclimatization] = useState('acclimatized'); // 'acclimatized' | 'unacclimatized'
  const [selectedSiteId, setSelectedSiteId] = useState(
    externalSelectedSiteId && externalSelectedSiteId !== 'all' ? externalSelectedSiteId : 'ws-1'
  );
  const [prevExternalSiteId, setPrevExternalSiteId] = useState(externalSelectedSiteId);

  // Synchronize with external selector changes during render without triggering effect warnings
  if (externalSelectedSiteId !== prevExternalSiteId) {
    setPrevExternalSiteId(externalSelectedSiteId);
    if (externalSelectedSiteId && externalSelectedSiteId !== 'all') {
      setSelectedSiteId(externalSelectedSiteId);
    }
  }

  const selectedSite = worksites.find((w) => w.id === selectedSiteId) || worksites[0];

  // Scientifically grounded dynamic advisory model (NIOSH / ACGIH / NDMA guidelines)
  // Replaces universal fixed work/rest schedules with context-aware recommendations
  const getAdaptiveRecommendation = () => {
    const hi = selectedSite.heatIndex;
    const isUnacclimatized = acclimatization === 'unacclimatized';

    if (hi >= 46) {
      // Danger / Extreme Zone (Heat Index >= 46°C)
      if (isUnacclimatized) {
        return {
          workRest: '15 min work / 45 min shaded rest per hour (or Reschedule)',
          hydration: '200–250 ml every 15–20 min; balanced electrolytes for prolonged heavy sweating',
          pacing: 'High Vulnerability: Unacclimatized worker must NOT perform unshaded heavy manual work during peak hours (12:00 - 15:00). Limit shift to 20% on Day 1.',
          level: 'Critical Thermal Strain',
          severity: 'extreme',
        };
      }
      if (workload === 'heavy') {
        return {
          workRest: '15–20 min work / 40–45 min shaded rest per hour',
          hydration: '200–250 ml every 15–20 min; balanced electrolytes for prolonged heavy sweating',
          pacing: 'Heavy exertion (rebar, asphalt, manual trenching) should be shifted to early morning (05:30 - 09:30) or evening night shifts.',
          level: 'Extreme Heat Advisory',
          severity: 'extreme',
        };
      }
      if (workload === 'moderate') {
        return {
          workRest: '30 min work / 30 min shaded rest per hour',
          hydration: '200–250 ml every 20 min (water / balanced fluids)',
          pacing: 'Active misting canopy or ventilated rest area required. Continuous buddy monitoring for confusion/dizziness.',
          level: 'High Heat Strain',
          severity: 'high',
        };
      }
      return {
        workRest: '45 min work / 15 min shaded rest per hour',
        hydration: '200 ml every 20 min (water)',
        pacing: 'Light duty (supervision/signaling). Maintain continuous shaded water access within 100 meters.',
        level: 'Moderate Heat Strain',
        severity: 'moderate',
      };
    } else if (hi >= 40) {
      // High Heat Index (40 - 45°C)
      if (isUnacclimatized) {
        return {
          workRest: '30 min work / 30 min shaded rest per hour',
          hydration: '200–250 ml every 15–20 min (water / balanced fluids)',
          pacing: 'Unacclimatized worker build-up: Maximum 40% exertion duration. Enforce mandatory supervision for heat exhaustion.',
          level: 'Heightened Thermal Risk',
          severity: 'high',
        };
      }
      if (workload === 'heavy') {
        return {
          workRest: '30 min work / 30 min shaded rest per hour',
          hydration: '200–250 ml every 15–20 min; balanced electrolytes for prolonged heavy sweating',
          pacing: 'Rotate heavy tasks among crews. Mandatory hydration checks before work resumption.',
          level: 'High Heat Strain',
          severity: 'high',
        };
      }
      if (workload === 'moderate') {
        return {
          workRest: '45 min work / 15 min shaded rest per hour',
          hydration: '200 ml every 20 min (water)',
          pacing: 'Provide shaded recovery area. Encourage regular fluid replenishment.',
          level: 'Moderate Heat Strain',
          severity: 'moderate',
        };
      }
      return {
        workRest: '50 min work / 10 min shaded rest per hour',
        hydration: '150–200 ml every 20 min',
        pacing: 'Standard light-duty pacing with accessible drinking water.',
        level: 'Low-to-Moderate Strain',
        severity: 'low',
      };
    } else if (hi >= 35) {
      // Moderate Heat Index (35 - 39°C)
      if (workload === 'heavy') {
        return {
          workRest: '45–50 min work / 10–15 min shaded rest per hour',
          hydration: '200 ml every 20 min (water / balanced fluids)',
          pacing: 'Provide cool drinking water and brief cool-down breaks.',
          level: 'Moderate Caution',
          severity: 'moderate',
        };
      }
      return {
        workRest: 'Continuous work with standard scheduled rest breaks',
        hydration: '150–200 ml every 20–30 mins',
        pacing: 'Standard work shift with periodic hydration reminders.',
        level: 'Normal Caution',
        severity: 'low',
      };
    }
    // Low / Baseline (<35°C)
    return {
      workRest: 'Continuous work with standard meal & shift intervals',
      hydration: 'Normal thirst-driven hydration (~0.4 - 0.5 L/hr)',
      pacing: 'Baseline thermal conditions. Accessible drinking water on site.',
      level: 'Normal Operations',
      severity: 'low',
    };
  };

  const recommendation = getAdaptiveRecommendation();

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner: Prototype & Non-Medical Warning */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-2xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950">
            <span className="font-bold uppercase tracking-wider block text-amber-900 mb-0.5">
              Notice: Operational Prototype — Not a Medical Diagnostic or Regulatory Certification System
            </span>
            HeatProof provides operational safety estimates for worksite planning. It does <strong>not</strong> provide medical diagnoses, clinical assessments, or certified legal compliance audits. In case of heat exhaustion or heat stroke symptoms (confusion, slurred speech, fainting, vomiting, hot dry skin), call emergency medical services immediately and cool the worker aggressively in shade.
          </div>
        </div>
      </div>

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Thermal Risk & Environmental Assessment</h2>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Scientific Thermal Indices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Separated evaluation of Ambient Dry-Bulb Temperature, Calculated Heat Index, and Instrument-Measured WBGT requirements
          </p>
        </div>

        {/* Site Switcher for Telemetry */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
          <span className="text-slate-500 font-medium">Site Telemetry:</span>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer max-w-[200px] truncate"
          >
            {worksites.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name} ({ws.heatIndex}°C HI)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Explicitly Separated Metric Cards (Ambient Temp vs Heat Index vs Measured WBGT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Ambient Dry-Bulb Temperature */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                Parameter 1
              </span>
              <span>In Shade</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 mt-1">Ambient Temperature ($T_a$)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Dry-bulb air temperature shielded from direct sun</p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{selectedSite.temp}°C</span>
              <span className="text-xs text-slate-400 font-medium">({Math.round((selectedSite.temp * 9) / 5 + 32)}°F)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            Standard meteorological air reading. Does not account for humidity or radiant solar load.
          </div>
        </div>

        {/* Metric 2: Heat Index (Rothfusz Equation) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                Parameter 2
              </span>
              <span className="text-amber-700 font-semibold">{selectedSite.humidity}% Relative Humidity</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 mt-1">Calculated Heat Index (HI)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Steadman/Rothfusz apparent 'feels like' temperature</p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600">{selectedSite.heatIndex}°C</span>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {selectedSite.riskLevel.toUpperCase()} STRAIN
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            Evaluates perceived thermal stress in shaded conditions with light air movement.
          </div>
        </div>

        {/* Metric 3: Measured WBGT Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                Parameter 3
              </span>
              <span className="text-rose-600 font-bold">Physical Instrument</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 mt-1">Measured WBGT Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">Outdoor WBGT = 0.7 T_nw + 0.2 T_g + 0.1 T_d</p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block">Sensor Hardware: Unconnected</span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Requires natural wet bulb, 150mm black globe radiometer, and dry bulb triad sensors.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-rose-700">
            Environmental heat estimate — not measured WBGT
          </div>
        </div>
      </div>

      {/* Main Environmental Heat Estimate & Adaptive Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environmental Heat Estimate Gauge Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Thermal Heat Index Gauge</h3>
                <span className="text-[10px] font-bold text-amber-800 block">
                  Environmental heat estimate — not measured WBGT
                </span>
              </div>
              <RiskBadge level={selectedSite.riskLevel} size="sm" />
            </div>

            {/* Custom SVG Half-Circle Gauge for Heat Index */}
            <div className="mt-6 flex flex-col items-center">
              <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
                <svg viewBox="0 0 100 55" className="w-48 h-28">
                  {/* Background Track */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Green Caution (27 - 32) */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 30 23"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Yellow Extreme Caution (32 - 41) */}
                  <path
                    d="M 30 23 A 40 40 0 0 1 55 10"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="8"
                  />
                  {/* Orange Danger (41 - 46) */}
                  <path
                    d="M 55 10 A 40 40 0 0 1 75 23"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="8"
                  />
                  {/* Red Extreme Danger (> 46) */}
                  <path
                    d="M 75 23 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Dial Needle */}
                <div
                  className="absolute bottom-0 w-1 h-20 bg-slate-800 rounded-full origin-bottom transition-transform duration-700"
                  style={{
                    transform: `rotate(${Math.min(
                      Math.max(((selectedSite.heatIndex - 25) / 30) * 180 - 90, -90),
                      90
                    )}deg)`,
                  }}
                />
                <div className="absolute bottom-0 w-3 h-3 bg-slate-900 rounded-full" />
              </div>

              {/* Readout Values */}
              <div className="text-center mt-3">
                <span className="text-3xl font-extrabold text-slate-900">{selectedSite.heatIndex}°C</span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Calculated Apparent Heat Index
                </p>
                <div className="mt-2 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-3 py-1 inline-flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Thermal Strain Critical
                </div>
              </div>
            </div>
          </div>

          {/* Scale Legend */}
          <div className="mt-6 grid grid-cols-4 gap-1 text-[10px] text-center font-medium border-t border-slate-100 pt-3">
            <div className="text-emerald-700">
              <span className="block w-full h-1 bg-emerald-500 rounded-full mb-1" />
              &lt; 32° Caution
            </div>
            <div className="text-yellow-700">
              <span className="block w-full h-1 bg-yellow-500 rounded-full mb-1" />
              32-41° Extreme Caution
            </div>
            <div className="text-amber-700">
              <span className="block w-full h-1 bg-amber-500 rounded-full mb-1" />
              41-46° Danger
            </div>
            <div className="text-rose-700">
              <span className="block w-full h-1 bg-rose-500 rounded-full mb-1" />
              &gt; 46° Ext. Danger
            </div>
          </div>
        </div>

        {/* Microclimate Telemetry Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
              Local Microclimate Inputs ({selectedSite.name})
            </h3>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800">Solar Exposure</span>
                    <p className="text-[11px] text-slate-400">Radiant thermal radiation</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900">Direct Sun</span>
                  <span className="block text-[10px] text-rose-600 font-bold">UV 10 (Very High)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 text-sky-800 rounded-lg">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800">Relative Humidity</span>
                    <p className="text-[11px] text-slate-400">Directly restricts sweat evaporation</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900">{selectedSite.humidity}%</span>
                  <span className="block text-[10px] text-amber-700 font-medium">Elevated Moisture</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800">Air Velocity</span>
                    <p className="text-[11px] text-slate-400">Assists convective cooling</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900">1.8 m/s</span>
                  <span className="block text-[10px] text-slate-500 font-medium">Light Breeze</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <span className="font-bold flex items-center gap-1.5 mb-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Scientific Observation
            </span>
            At 39.4°C and 58% relative humidity, the body’s primary heat-dissipation mechanism (sweat evaporation) is impaired. Shaded rest stations and air movement are required.
          </div>
        </div>

        {/* Adaptive Recommendation Engine (Workload, Acclimatization & Clothing) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Adaptive Safety Calculator</h3>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Non-Universal Logic
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {/* Acclimatization Status Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Worker Acclimatization Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAcclimatization('acclimatized')}
                    className={`text-xs p-2 rounded-xl font-medium border flex items-center justify-center gap-1.5 transition-all ${
                      acclimatization === 'acclimatized'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Acclimatized</span>
                  </button>
                  <button
                    onClick={() => setAcclimatization('unacclimatized')}
                    className={`text-xs p-2 rounded-xl font-medium border flex items-center justify-center gap-1.5 transition-all ${
                      acclimatization === 'unacclimatized'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>New / Unacclimatized</span>
                  </button>
                </div>
              </div>

              {/* Workload Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Metabolic Workload Category:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'light', label: 'Light (<200W)' },
                    { id: 'moderate', label: 'Mod (200-350W)' },
                    { id: 'heavy', label: 'Heavy (>350W)' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setWorkload(lvl.id)}
                      className={`text-[11px] p-2 rounded-lg font-medium border text-center transition-all ${
                        workload === lvl.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clothing / PPE */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Protective Clothing / PPE:
                </label>
                <select
                  value={clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="standard">Standard Light Workwear (0°C adjustment)</option>
                  <option value="coveralls">Heavy Cotton Coveralls (+1.5°C adjustment)</option>
                  <option value="impermeable">Vapor-Barrier Suit (+3.0°C adjustment)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Adaptive Calculator Output */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 uppercase text-[11px]">
                Adaptive Protocol ({recommendation.level})
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                Advisory
              </span>
            </div>

            <div className="space-y-2 bg-white p-3 rounded-lg border border-emerald-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Recommended Work / Shaded Rest</span>
                <span className="font-extrabold text-slate-900 text-sm">{recommendation.workRest}</span>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Controlled Hydration</span>
                <span className="font-bold text-teal-700">{recommendation.hydration}</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-950 mt-2.5 leading-relaxed font-medium">
              {recommendation.pacing}
            </p>
          </div>
        </div>
      </div>

      {/* Authoritative Occupational Hydration Guidance */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-teal-600" />
            Authoritative Occupational Hydration Guidance
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Source: CDC / NIOSH Publication No. 2016-106
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 mt-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">Small, Frequent Fluid Intake</span>
            NIOSH advises that during moderate-to-heavy work in hot environments, workers should drink approximately <strong>1 cup (8 oz or ~240 ml) of water every 15–20 minutes</strong>. Drinking at frequent intervals is significantly more effective at maintaining hydration than drinking large volumes infrequently. Do not wait until thirst develops.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">Pacing Fluid Intake (Hyponatremia Prevention)</span>
            Current NIOSH guidance explicitly counsels workers: <em>"Do not drink more than 48 oz (1½ quarts, ~1.4 Liters) per hour."</em> Excessive fluid intake over a short duration can dilute blood sodium to dangerously low levels, resulting in a serious medical condition known as <strong>hyponatremia</strong> (water intoxication).
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">Balanced Electrolyte Replacement</span>
            Normal, balanced meals and snacks eaten during meal and rest breaks provide adequate salts and minerals to replace what is lost in routine sweat. For <strong>prolonged heavy sweating spanning several hours</strong>, workers should supplement water with balanced electrolyte drinks, diluted fruit juices, or ORS solutions. Salt tablets should not be used.
          </div>
        </div>
      </div>

      {/* 12-Hour Hourly Environmental Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Hourly Environmental Forecast Curve
            </h3>
            <span className="text-[10px] text-amber-800 font-semibold">
              Environmental heat estimate — not measured WBGT
            </span>
          </div>
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">
            Hourly Model
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Hourly ambient dry-bulb temperature and calculated Heat Index for scheduling shift pacing and rest breaks
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Time Interval</th>
                <th className="py-3 px-4">Ambient Temp ($T_a$)</th>
                <th className="py-3 px-4">Calculated Heat Index</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">Adaptive Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hourlyForecast.map((hour) => (
                <tr key={hour.hour} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{hour.hour}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{hour.temp}°C</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{hour.heatIndex}°C</td>
                  <td className="py-3 px-4">
                    <RiskBadge level={hour.risk} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {hour.risk === 'extreme' ? (
                      <span className="font-semibold text-rose-700">Reschedule unshaded heavy work; 15m/45m shaded rest with balanced hydration</span>
                    ) : hour.risk === 'high' ? (
                      <span className="font-semibold text-amber-800">30m work / 30m shaded rest; enforce buddy monitoring</span>
                    ) : hour.risk === 'moderate' ? (
                      <span>45m work / 15m shaded hydration rest</span>
                    ) : (
                      <span>Continuous work with standard break</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authoritative Scientific References & Literature Citations */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 shadow-xs border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">Authoritative Source References & Standards</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-400">
          <div>
            <p className="font-semibold text-slate-200">1. National Institute for Occupational Safety and Health (NIOSH)</p>
            <p className="text-[11px] mt-0.5">
              <em>Criteria for a Recommended Standard: Occupational Exposure to Heat and Hot Environments</em> (DHHS/NIOSH Pub. No. 2016-106). Establishes recommended alert limits (RAL) and exposure limits (REL) based on metabolic workload and acclimatization.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">2. National Disaster Management Authority (NDMA), Govt. of India</p>
            <p className="text-[11px] mt-0.5">
              <em>National Guidelines for Preparation of Action Plan - Prevention and Management of Heat Wave (2019)</em>. Outlines workplace hours adjustments, mandatory shaded rest facilities, and ORS distribution during high thermal advisories.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">3. ISO 7243:2017 Ergonomics of the Thermal Environment</p>
            <p className="text-[11px] mt-0.5">
              Defines the standard physical measurement of Wet Bulb Globe Temperature (WBGT) requiring calibrated black globe radiometers, natural wet-bulb sensors, and dry-bulb thermometers for multi-parameter thermal strain calculation.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">4. American Conference of Governmental Industrial Hygienists (ACGIH)</p>
            <p className="text-[11px] mt-0.5">
              <em>Threshold Limit Values (TLVs) and Biological Exposure Indices (BEIs) for Heat Stress</em>. Emphasizes physiological monitoring, clothing adjustment factors (CAV), and progressive 5-day acclimatization schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
