import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  ShieldCheck,
  ChevronDown,
  X,
  Building,
  Info,
} from 'lucide-react';

export default function TopNavbar({
  setMobileOpen,
  searchQuery,
  setSearchQuery,
  alerts = [],
  selectedSite,
  setSelectedSite,
  worksites = [],
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left side: Mobile menu toggle + Site Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Worksite Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700">
          <Building className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-500">Site:</span>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer pr-2 max-w-[180px] md:max-w-xs truncate"
          >
            <option value="all">All UP Worksites (8 Active)</option>
            {worksites.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name} ({ws.heatIndex}°C)
              </option>
            ))}
          </select>
        </div>

        {/* Visible DEMO DATA Label */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-amber-900 tracking-wide shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>DEMO DATA (SIMULATED)</span>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search UP worksites, actions, workers..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Advisory Status Pill */}
        <div className="hidden xl:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Advisory Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-900">Safety Advisories</h4>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                    {alerts.length} Active
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="py-3 text-left">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          alert.level === 'extreme'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <Flame className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900">{alert.title}</p>
                          <span className="text-[10px] text-slate-400">{alert.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{alert.location}</p>
                        <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                        <div className="mt-2 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] font-medium text-emerald-800 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Advisory: {alert.actionRequired}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 sm:pr-3 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              RV
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">Rajesh Verma</p>
              <p className="text-[10px] text-emerald-700 font-medium">Lead HSE Officer (UP)</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Rajesh Verma</p>
                <p className="text-[11px] text-slate-500">rajesh.verma@heatproof.org</p>
                <span className="mt-1 inline-block text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  HSE Safety Lead
                </span>
              </div>
              <div className="py-1 text-xs text-slate-600">
                <div className="px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  Organization Settings
                </div>
                <div className="px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  Audit & Export Logs
                </div>
                <div className="px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer text-rose-600">
                  Switch Account
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
