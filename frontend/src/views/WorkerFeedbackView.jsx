import React, { useState } from 'react';
import {
  MessageSquareWarning,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  ShieldAlert,
  X,
  Droplets,
  Sun,
  Wind,
  Check,
  Building,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function WorkerFeedbackView({
  workerFeedback,
  setWorkerFeedback,
  worksites,
  searchQuery = '',
  selectedSite = 'all',
  onAddHazard,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Active worksite object if filtered
  const selectedSiteObj = worksites.find((w) => w.id === selectedSite);

  // New report form state
  const [newTitle, setNewTitle] = useState('');
  const [newWorksiteName, setNewWorksiteName] = useState(
    selectedSiteObj ? selectedSiteObj.name : worksites[0]?.name || 'Lucknow Metro Phase 2 Elevated Corridor'
  );
  const [newLocationDetail, setNewLocationDetail] = useState('');
  const [newIssueType, setNewIssueType] = useState('Missing Drinking Water');
  const [newUrgency, setNewUrgency] = useState('urgent');
  const [newComment, setNewComment] = useState('');

  // TASK 1: Automatically creates linked safety action upon submission
  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) return;

    const newReport = {
      id: `wf-${Date.now()}`,
      worksiteName: newWorksiteName,
      specificLocation: newLocationDetail || 'Active Zone',
      urgency: newUrgency,
      issueType: newIssueType,
      title: newTitle,
      workerComment: newComment,
      status: 'open',
      reportedAt: 'Just now',
      assignedOfficer: 'Rajesh Verma (Lead HSE)',
      actionsTaken: 'Report logged. Safety action generated & safety officer notified.',
    };

    if (onAddHazard) {
      onAddHazard(newReport);
    } else {
      setWorkerFeedback([newReport, ...workerFeedback]);
    }

    setIsReportModalOpen(false);
    setNewTitle('');
    setNewLocationDetail('');
    setNewComment('');
  };

  const handleResolve = (id) => {
    setWorkerFeedback((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = item.status === 'resolved' ? 'open' : 'resolved';
          return {
            ...item,
            status: next,
            actionsTaken:
              next === 'resolved'
                ? 'Supervisor verified remediation on site.'
                : 'Reopened for inspection.',
          };
        }
        return item;
      })
    );
  };

  // TASK 4: Worksite filter & search
  const filteredReports = workerFeedback.filter((item) => {
    const matchesSite =
      selectedSite === 'all' ||
      (selectedSiteObj && item.worksiteName.toLowerCase() === selectedSiteObj.name.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.worksiteName.toLowerCase().includes(q) ||
      item.issueType.toLowerCase().includes(q) ||
      item.workerComment.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || item.urgency === urgencyFilter;

    return matchesSite && matchesSearch && matchesStatus && matchesUrgency;
  });

  const siteReports = selectedSite === 'all'
    ? workerFeedback
    : workerFeedback.filter((f) => selectedSiteObj && f.worksiteName.toLowerCase() === selectedSiteObj.name.toLowerCase());
  const openCount = siteReports.filter((f) => f.status === 'open').length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Worker Voice & Hazard Reporting</h2>
            <span className="text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
              {openCount} Open Hazard Reports
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Anonymous, frictionless ground-level reporting of missing water, damaged shade, and heat exhaustion symptoms
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Safety Hazard</span>
        </button>
      </div>

      {/* Filter and Status Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          {['all', 'open', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Urgency filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Urgency:</span>
          {['all', 'immediate', 'urgent', 'moderate'].map((urg) => (
            <button
              key={urg}
              onClick={() => setUrgencyFilter(urg)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-all ${
                urgencyFilter === urg
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {urg}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const isImmediate = report.urgency === 'immediate';
          const isResolved = report.status === 'resolved';

          return (
            <div
              key={report.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                isImmediate && !isResolved
                  ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/10'
                  : isResolved
                  ? 'border-emerald-200 bg-emerald-50/15'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isImmediate
                        ? 'bg-rose-100 text-rose-700'
                        : report.urgency === 'urgent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Flame className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          isImmediate
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {report.urgency} Urgency
                      </span>

                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {report.issueType}
                      </span>

                      <span className="text-xs text-slate-400 font-medium">{report.reportedAt}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {report.worksiteName} &bull;{' '}
                      <span className="text-slate-700">{report.specificLocation}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={report.status} />
                </div>
              </div>

              {/* Worker Comment Quote */}
              <div className="mt-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 italic leading-relaxed">
                "{report.workerComment}"
              </div>

              {/* Resolution Action Footer */}
              <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  <span className="font-semibold text-slate-700">Action status:</span>{' '}
                  <span className="text-emerald-800 font-medium">{report.actionsTaken}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleResolve(report.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-colors flex items-center gap-1.5 ${
                      isResolved
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        : 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isResolved ? 'Re-flag Hazard' : 'Mark Resolved'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">No active hazard reports</h3>
            <p className="text-xs text-slate-500 mt-1">All outdoor field concerns in this category are resolved.</p>
          </div>
        )}
      </div>

      {/* Modal: Report Hazard Form */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Report Missing Facility or Heat Hazard</h3>
            <p className="text-xs text-slate-500 mt-1">
              Direct worker channel for water shortages, shade failures, or dizziness signs.
            </p>

            <form onSubmit={handleSubmitReport} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Water container empty at Pillar 44 Unnao stretch"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Worksite</label>
                  <select
                    value={newWorksiteName}
                    onChange={(e) => setNewWorksiteName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    {worksites.map((ws) => (
                      <option key={ws.id} value={ws.name}>
                        {ws.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Hazard Type</label>
                  <select
                    value={newIssueType}
                    onChange={(e) => setNewIssueType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="Missing Drinking Water">Missing Drinking Water</option>
                    <option value="Damaged Shade Canopy">Damaged Shade Canopy</option>
                    <option value="Worker Heat Illness / Dizziness">Worker Heat Illness / Dizziness</option>
                    <option value="No Electrolytes">No Electrolytes</option>
                    <option value="No Ventilation / Fan Broken">No Ventilation / Fan Broken</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Specific Location Detail
                  </label>
                  <input
                    type="text"
                    value={newLocationDetail}
                    onChange={(e) => setNewLocationDetail(e.target.value)}
                    placeholder="e.g. Pillar 44 asphalt trench, Hardoi border"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Urgency</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="immediate">Immediate Hazard (Crew in Danger)</option>
                    <option value="urgent">Urgent Concern</option>
                    <option value="moderate">Moderate Suggestion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Worker Comment / Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Describe what is missing or what symptoms workers are experiencing..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Submit Anonymous Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
