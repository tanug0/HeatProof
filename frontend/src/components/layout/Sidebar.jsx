import React from 'react';
import {
  LayoutDashboard,
  Building2,
  ThermometerSun,
  ShieldCheck,
  FileCheck2,
  MessageSquareWarning,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  counts = {},
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'worksites',
      label: 'Worksites',
      icon: Building2,
      badge: counts.highRiskSites ? `${counts.highRiskSites} Alert` : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'heat-risk',
      label: 'Heat Risk',
      icon: ThermometerSun,
      badge: 'Heat Index',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'safety-actions',
      label: 'Safety Actions',
      icon: ShieldCheck,
      badge: counts.pendingActions ? counts.pendingActions : null,
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'evidence',
      label: 'Evidence & Reports',
      icon: FileCheck2,
      badge: counts.pendingVerifications ? counts.pendingVerifications : null,
      badgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      id: 'feedback',
      label: 'Worker Feedback',
      icon: MessageSquareWarning,
      badge: counts.openHazards ? `${counts.openHazards} Open` : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-950/40">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight">HeatProof</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Occupational Heat Safety (UP)</p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Safety Console
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                  }`}
                />

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between text-left truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor || 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* System Status Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          {!collapsed ? (
            <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Thermal Stress Model
                </span>
                <span className="text-[10px] text-amber-300 font-mono">HI 46.2°C</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Advisory thermal model across 3 UP sectors. Shaded rest recommended.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="Thermal Advisory Active (Simulated)">
              <span className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-950/60 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
