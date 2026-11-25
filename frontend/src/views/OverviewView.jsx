import React from 'react';
import {
  Building2,
  Users,
  AlertTriangle,
  ClipboardList,
  ShieldAlert,
  Flame,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  ExternalLink,
  Info,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';

export default function OverviewView({
  worksites,
  safetyActions,
  evidenceReports,
  workerFeedback,
  safetyAlerts,
  recentActivity,
  hourlyForecast,
  setActiveTab,
  selectedSite = 'all',
}) {
  const activeSite = selectedSite !== 'all' ? worksites.find((w) => w.id === selectedSite) : null;
  const displayedWorksites = activeSite ? [activeSite] : worksites;
  const displayedActions = selectedSite === 'all'
    ? safetyActions
    : safetyActions.filter((a) => a.worksiteId === selectedSite);
  const displayedFeedback = selectedSite === 'all'
    ? workerFeedback
    : workerFeedback.filter((f) => activeSite && f.worksiteName.toLowerCase() === activeSite.name.toLowerCase());

  const totalWorksites = displayedWorksites.length;
  const totalWorkers = displayedWorksites.reduce((acc, curr) => acc + curr.workers, 0);
  const highRiskCount = displayedWorksites.filter(
    (w) => w.riskLevel === 'extreme' || w.riskLevel === 'high'
  ).length;
  const pendingActionsCount = displayedActions.filter((a) => a.status === 'pending').length;
  const openHazardCount = displayedFeedback.filter((f) => f.status === 'open').length;

  // Calculate compliance rate
  const completedActions = displayedActions.filter((a) => a.status === 'completed').length;
  const complianceRate = Math.round((completedActions / (displayedActions.length || 1)) * 100);

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

      {/* Top Banner: Real-time Heat Advisory */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Flame className="w-64 h-64 text-amber-300" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Regional Heat Advisory: Uttar Pradesh Peak Hours 12:00 - 15:00</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Outdoor Heat Safety Console
          </h2>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            3 outdoor worksites in Uttar Pradesh are currently under <strong className="text-white">High / Extreme Heat Advisory</strong>. 
            Ensure recommended shaded hydration pauses and balanced fluid replenishment are provided based on worker workload and acclimatization.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('safety-actions')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-xs rounded-xl shadow transition-colors"
            >
              <span>View Safety Action Plans</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('heat-risk')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20 transition-colors"
            >
              <span>Inspect Thermal Risk & Indices</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Worksites"
          value={totalWorksites}
          subtitle={activeSite ? activeSite.name : '8 Active Monitoring Zones (UP)'}
          trend={activeSite ? `${activeSite.riskLevel.toUpperCase()} RISK` : '8 registered'}
          icon={Building2}
          color="emerald"
        />
        <StatCard
          title="Workers Monitored"
          value={totalWorkers}
          subtitle={activeSite ? activeSite.type : 'Field personnel on outdoor shifts'}
          trend={activeSite ? `${activeSite.workers} on site` : 'Monitored in demo'}
          icon={Users}
          color="teal"
        />
        <StatCard
          title="High-Risk Sites"
          value={highRiskCount}
          subtitle={activeSite ? `Heat Index: ${activeSite.heatIndex}°C` : 'Heat Index > 42.0°C zone'}
          trend={highRiskCount > 0 ? 'Advisory active' : 'Standard status'}
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Pending Safety Actions"
          value={pendingActionsCount}
          subtitle={`${complianceRate}% site execution rate`}
          trend={`${completedActions} completed`}
          icon={ClipboardList}
          color="amber"
        />
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heat Risk Overview Forecast Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Today's Environmental Heat Curve
                </h3>
                <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                  Environmental heat estimate — not measured WBGT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hourly ambient dry-bulb temperature ($T_a$) vs. Calculated Heat Index (°C) across outdoor zones
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-amber-400" /> Heat Index
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-teal-600" /> Ambient Temp
              </span>
            </div>
          </div>

          {/* Forecast Chart Visualization */}
          <div className="mt-6">
            <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 px-2 pt-6 pb-2 bg-slate-50 rounded-xl border border-slate-100 relative">
              {/* Danger threshold line */}
              <div className="absolute top-12 left-0 right-0 border-b border-dashed border-rose-400 z-10 flex items-center justify-end pr-3">
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  Critical Hazard Threshold (42°C Heat Index)
                </span>
              </div>

              {hourlyForecast.map((point) => {
                const maxTemp = 50;
                const heatHeight = Math.round((point.heatIndex / maxTemp) * 100);
                const tempHeight = Math.round((point.temp / maxTemp) * 100);

                const isPeak = point.risk === 'extreme';

                return (
                  <div key={point.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] rounded-lg py-1 px-2 pointer-events-none whitespace-nowrap shadow-lg z-20">
                      <div>Time: {point.hour}</div>
                      <div>Heat Index: {point.heatIndex}°C</div>
                      <div>Ambient Temp: {point.temp}°C</div>
                      <div className="font-semibold text-amber-300 capitalize">{point.risk} Risk (Advisory)</div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-44">
                      {/* Ambient Temp Bar */}
                      <div
                        style={{ height: `${tempHeight}%` }}
                        className="w-2 sm:w-3 bg-teal-500/80 rounded-t transition-all group-hover:bg-teal-600"
                      />
                      {/* Heat Index Bar */}
                      <div
                        style={{ height: `${heatHeight}%` }}
                        className={`w-2.5 sm:w-4 rounded-t transition-all ${
                          isPeak
                            ? 'bg-rose-500 group-hover:bg-rose-600 shadow-sm shadow-rose-300'
                            : 'bg-amber-400 group-hover:bg-amber-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-500">
                      {point.hour.split(':')[0]}h
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Morning Shift (07:00)</span>
              <span className="font-semibold text-rose-600">Peak Thermal Load (12:00 - 14:00)</span>
              <span>Evening Shift (18:00)</span>
            </div>
          </div>
        </div>

        {/* Site Risk Distribution Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Risk Distribution</h3>
              <span className="text-xs text-slate-500">8 UP Worksites</span>
            </div>

            <div className="mt-5 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Extreme Risk (Heat Index &gt; 46°C)
                  </span>
                  <span className="text-slate-700">2 Sites (25%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High Risk (Heat Index 42 - 46°C)
                  </span>
                  <span className="text-slate-700">2 Sites (25%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-yellow-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Moderate (Heat Index 35 - 41°C)
                  </span>
                  <span className="text-slate-700">2 Sites (25%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low / Safe (Heat Index &lt; 35°C)
                  </span>
                  <span className="text-slate-700">2 Sites (25%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              NDMA & Heat Safety Advisory
            </div>
            Work-to-rest schedules dynamically update based on ambient heat, relative humidity, worker workload, and acclimatization.
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Alerts & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Safety Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">Critical Heat Advisories</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                {safetyAlerts.length} Active
              </span>
            </div>
            <button
              onClick={() => setActiveTab('heat-risk')}
              className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Full Advisory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {safetyAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-lg ${
                        alert.level === 'extreme'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <Flame className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                      <p className="text-[11px] text-slate-500">{alert.location}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">{alert.message}</p>
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                    Advisory: {alert.actionRequired}
                  </span>
                  <RiskBadge level={alert.level} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Recent Verification & Logs</h3>
            <button
              onClick={() => setActiveTab('evidence')}
              className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View Audit Trail</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 truncate">{act.action}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {act.user} <span className="text-slate-400">({act.role})</span> &bull; {act.worksite}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
