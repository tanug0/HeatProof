import React, { useState } from 'react';
import {
  FileCheck2,
  Camera,
  Upload,
  CheckCircle2,
  AlertOctagon,
  Clock,
  MapPin,
  Download,
  Filter,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  Eye,
  Check,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

// Reliable fallback SVG data URI if any image fails to load
const fallbackImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <rect width="800" height="450" fill="#064e3b"/>
    <rect x="25" y="25" width="750" height="400" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <circle cx="400" cy="180" r="50" fill="rgba(255,255,255,0.1)"/>
    <text x="400" y="260" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">Field Evidence Photograph</text>
    <text x="400" y="295" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#a7f3d0">SIMULATED EVIDENCE RECORD</text>
  </svg>
`)}`;

export default function EvidenceView({
  evidenceReports,
  setEvidenceReports,
  worksites,
  safetyActions,
  searchQuery = '',
  selectedSite = 'all',
  onVerifyEvidence,
  onAddEvidence,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [inspectModalEvidence, setInspectModalEvidence] = useState(null);

  // Find currently active worksite object if filtered
  const selectedSiteObj = worksites.find((w) => w.id === selectedSite);

  // New evidence form state
  const [newTitle, setNewTitle] = useState('');
  const [newWorksiteName, setNewWorksiteName] = useState(
    selectedSiteObj ? selectedSiteObj.name : worksites[0]?.name || 'Lucknow Metro Phase 2 Elevated Corridor'
  );
  const [newActionId, setNewActionId] = useState('');
  const [newCategory, setNewCategory] = useState('Hydration Stations');
  const [newNotes, setNewNotes] = useState('');

  // Submit new evidence - MUST START AS PENDING REVIEW
  const handleSubmitEvidence = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Build custom dynamic SVG photo for the newly submitted record
    const customPhotoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#047857"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="800" height="450" fill="url(#bg)"/>
        <rect x="25" y="25" width="750" height="400" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
        <circle cx="400" cy="170" r="50" fill="rgba(255,255,255,0.12)"/>
        <path d="M385 170 L395 180 L418 155" fill="none" stroke="#6ee7b7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="400" y="255" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">${newTitle}</text>
        <text x="400" y="285" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#a7f3d0" letter-spacing="1">${newCategory.toUpperCase()}</text>
        <text x="400" y="325" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="rgba(255,255,255,0.75)">FIELD EVIDENCE PHOTO • PENDING AUDIT REVIEW</text>
      </svg>
    `)}`;

    const newReport = {
      id: `ev-${Date.now()}`,
      actionId: newActionId || 'act-manual',
      worksiteName: newWorksiteName,
      title: newTitle,
      submittedBy: 'Rajesh Verma (Lead HSE)',
      submittedAt: 'Just now',
      status: 'pending', // Starts strictly as Pending Review
      category: newCategory,
      photoUrl: customPhotoSvg,
      description: newNotes || 'On-site photograph submitted for supervisor compliance verification.',
      gps: '26.8467° N, 80.9462° E (Lucknow, UP)',
      complianceScore: null,
    };

    if (onAddEvidence) {
      onAddEvidence(newReport);
    } else {
      setEvidenceReports([newReport, ...evidenceReports]);
    }

    setIsSubmitModalOpen(false);
    setNewTitle('');
    setNewNotes('');
    setNewActionId('');
  };

  // Supervisor verification handler (updates linked safety action through prop or local state)
  const handleVerifyEvidence = (id) => {
    if (onVerifyEvidence) {
      onVerifyEvidence(id);
    } else {
      setEvidenceReports((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const isCurrentlyVerified = item.status === 'verified';
            return {
              ...item,
              status: isCurrentlyVerified ? 'pending' : 'verified',
              complianceScore: isCurrentlyVerified ? null : 100,
            };
          }
          return item;
        })
      );
    }

    if (inspectModalEvidence && inspectModalEvidence.id === id) {
      setInspectModalEvidence((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === 'verified' ? 'pending' : 'verified',
              complianceScore: prev.status === 'verified' ? null : 100,
            }
          : null
      );
    }
  };

  // TASK 3: GLOBAL SEARCH & TASK 4: WORKSITE FILTERING
  const filteredEvidence = evidenceReports.filter((ev) => {
    // Worksite filter
    const matchesSite =
      selectedSite === 'all' ||
      (selectedSiteObj && ev.worksiteName.toLowerCase() === selectedSiteObj.name.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;

    // Search query filter across title, worksite, category, submitted-by and description
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      ev.worksiteName.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q) ||
      ev.submittedBy.toLowerCase().includes(q) ||
      (ev.description && ev.description.toLowerCase().includes(q));

    return matchesSite && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Safety Evidence & Verification Log</h2>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Field Evidence Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Photographic verification records and supervisor sign-offs for implemented heat countermeasures in Uttar Pradesh
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Verification</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5">
          {['all', 'verified', 'pending', 'flagged'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'all' ? 'All Evidence' : status === 'pending' ? 'Pending Review' : status}
            </button>
          ))}
        </div>
        <span className="text-slate-400 font-medium">
          Showing {filteredEvidence.length} submitted records
        </span>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvidence.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo Preview Thumbnail with Error Fallback */}
              <div className="relative h-44 bg-slate-100 overflow-hidden group">
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={item.status} />
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {item.gps}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[10px]">
                    {item.category}
                  </span>
                  <span>{item.submittedAt}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.worksiteName}</p>
                {item.actionId && item.actionId !== 'act-manual' && (
                  <div className="mt-1 text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      Linked: {safetyActions.find((a) => a.id === item.actionId)?.title || item.actionId}
                    </span>
                  </div>
                )}
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Submitted By:</span>
                <span className="text-xs font-semibold text-slate-800">{item.submittedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'pending' && (
                  <button
                    onClick={() => handleVerifyEvidence(item.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                )}
                <button
                  onClick={() => setInspectModalEvidence(item)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Upload / Record Evidence */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Submit Verification Evidence</h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide photographic proof of shade, hydration, or medical equipment implementation.
            </p>

            <form onSubmit={handleSubmitEvidence} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Verification Subject / Measure *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Misting canopy set up at Pier 18 Lucknow"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="Shade & Canopies">Shade & Canopies</option>
                    <option value="Hydration Stations">Hydration Stations</option>
                    <option value="Cooling Equipment">Cooling Equipment</option>
                    <option value="Schedule Protocol">Schedule Protocol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Linked Safety Action Plan (Optional)
                </label>
                <select
                  value={newActionId}
                  onChange={(e) => {
                    setNewActionId(e.target.value);
                    const act = safetyActions.find((a) => a.id === e.target.value);
                    if (act) {
                      setNewWorksiteName(act.worksiteName);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="">-- General / Field Verification --</option>
                  {safetyActions.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.title} ({act.worksiteName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Simulator */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Field Photo Verification (Simulated Proof)
                </label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Photo captured from mobile inspector device</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    EXIF geotag and local timestamp are automatically stamped for safety record-keeping.
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded">
                      GPS: 26.8467° N, 80.9462° E (Lucknow, UP)
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
                      Time: {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Verification Notes / Temperature Reading
                </label>
                <textarea
                  rows="2"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Under-canopy temperature verified with infrared thermometer at 29.5°C."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Notice that newly submitted evidence starts as Pending Review */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-bold">Audit Workflow:</span> Newly submitted evidence will enter as <span className="font-bold underline">Pending Review</span> and must be reviewed by the HSE Lead before verification approval.
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Evidence Modal */}
      {inspectModalEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setInspectModalEvidence(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-56 rounded-xl overflow-hidden bg-slate-100 mb-4">
              <img
                src={inspectModalEvidence.photoUrl}
                alt={inspectModalEvidence.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                {inspectModalEvidence.category}
              </span>
              <StatusBadge status={inspectModalEvidence.status} />
            </div>

            <h3 className="text-base font-bold text-slate-900">{inspectModalEvidence.title}</h3>
            <p className="text-xs text-slate-500">{inspectModalEvidence.worksiteName}</p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Supervisor:</span>
                <span className="font-semibold text-slate-800">{inspectModalEvidence.submittedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-semibold text-slate-800">{inspectModalEvidence.submittedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Geotag:</span>
                <span className="font-mono text-slate-800">{inspectModalEvidence.gps}</span>
              </div>
              {inspectModalEvidence.actionId && inspectModalEvidence.actionId !== 'act-manual' && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Linked Action:</span>
                  <span className="font-semibold text-emerald-800 truncate max-w-[240px] text-right">
                    {safetyActions.find((a) => a.id === inspectModalEvidence.actionId)?.title || inspectModalEvidence.actionId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Compliance Status:</span>
                <span className="font-bold text-emerald-700">
                  {inspectModalEvidence.complianceScore !== null
                    ? `${inspectModalEvidence.complianceScore}%`
                    : 'Awaiting Sign-Off'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {inspectModalEvidence.description}
            </p>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              {inspectModalEvidence.status === 'pending' ? (
                <button
                  onClick={() => handleVerifyEvidence(inspectModalEvidence.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Approve & Verify Record
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">Record verified</span>
              )}
              <button
                onClick={() => setInspectModalEvidence(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
