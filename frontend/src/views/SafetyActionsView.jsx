import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  Check,
  X,
  Building,
  User,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function SafetyActionsView({
  safetyActions,
  setSafetyActions,
  worksites,
  searchQuery,
  selectedSite = 'all',
}) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newWorksiteId, setNewWorksiteId] = useState(
    selectedSite !== 'all' ? selectedSite : worksites[0]?.id || 'ws-1'
  );
  const [newCategory, setNewCategory] = useState('hydration');
  const [newPriority, setNewPriority] = useState('urgent');
  const [newDueTime, setNewDueTime] = useState('02:00 PM');
  const [newAssignedTo, setNewAssignedTo] = useState('Rajesh Verma');
  const [newNotes, setNewNotes] = useState('');

  // Toggle complete state of an action (preserves verified evidence state)
  const toggleActionStatus = (id) => {
    setSafetyActions((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const nextStatus = act.status === 'completed' ? 'pending' : 'completed';
          return {
            ...act,
            status: nextStatus,
          };
        }
        return act;
      })
    );
  };

  // Add new action
  const handleAddAction = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const worksiteObj = worksites.find((w) => w.id === newWorksiteId);

    const newAction = {
      id: `act-${Date.now()}`,
      title: newTitle,
      worksiteId: newWorksiteId,
      worksiteName: worksiteObj ? worksiteObj.name : 'Selected Site',
      category: newCategory,
      priority: newPriority,
      dueTime: newDueTime,
      status: 'pending',
      assignedTo: newAssignedTo,
      verified: false,
      verificationPhoto: null,
      notes: newNotes || 'Recommended heat safety countermeasure registered.',
    };

    setSafetyActions([newAction, ...safetyActions]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewNotes('');
  };

  // Filtering scoped by worksite and search
  const siteScopedActions = selectedSite === 'all'
    ? safetyActions
    : safetyActions.filter((a) => a.worksiteId === selectedSite);

  const filteredActions = siteScopedActions.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.worksiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || act.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || act.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completedCount = siteScopedActions.filter((a) => a.status === 'completed').length;
  const pendingCount = siteScopedActions.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Safety Action Plan & Protocols</h2>
            <span className="text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full">
              {completedCount} of {safetyActions.length} Executed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track, execute, and verify recommended heat-stress countermeasures across Uttar Pradesh projects
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Safety Action</span>
        </button>
      </div>

      {/* Filter Tabs & Status Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'hydration', label: 'Hydration' },
            { id: 'shade', label: 'Shade & Canopies' },
            { id: 'schedule', label: 'Shift Schedule' },
            { id: 'cooling', label: 'Cooling Equipment' },
            { id: 'emergency', label: 'Emergency Screen' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              statusFilter === 'all'
                ? 'bg-emerald-100 text-emerald-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({safetyActions.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              statusFilter === 'pending'
                ? 'bg-amber-100 text-amber-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              statusFilter === 'completed'
                ? 'bg-emerald-100 text-emerald-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Safety Actions Checklist */}
      <div className="space-y-3">
        {filteredActions.map((action) => {
          const isDone = action.status === 'completed';

          return (
            <div
              key={action.id}
              className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Interactive Checkbox Button */}
                <button
                  onClick={() => toggleActionStatus(action.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-emerald-500 bg-white'
                  }`}
                  title={isDone ? 'Mark as pending' : 'Mark as completed'}
                >
                  {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        action.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : action.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {action.priority} priority
                    </span>

                    <span className="text-[10px] uppercase font-semibold text-teal-800 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded">
                      {action.category}
                    </span>

                    {action.hazardId && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Hazard Response
                      </span>
                    )}

                    {action.verified ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Evidence Verified
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                        Awaiting Evidence
                      </span>
                    )}

                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due {action.dueTime}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold transition-all ${
                      isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {action.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">{action.notes}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {action.worksiteName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Assigned: {action.assignedTo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Quick Toggle */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <StatusBadge status={action.status} />
                <button
                  onClick={() => toggleActionStatus(action.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                    isDone
                      ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isDone ? 'Reopen Action' : 'Complete Action'}
                </button>
              </div>
            </div>
          );
        })}

        {filteredActions.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">No actions found</h3>
            <p className="text-xs text-slate-500 mt-1">Try modifying your filter or create a new action plan.</p>
          </div>
        )}
      </div>

      {/* Modal: Create New Action */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Create Safety Action Plan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add a heat-safety countermeasure to be assigned and audited.
            </p>

            <form onSubmit={handleAddAction} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Safety Measure Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Set up ice-water barrel and ORS station at Pillar 18"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Target UP Worksite
                  </label>
                  <select
                    value={newWorksiteId}
                    onChange={(e) => setNewWorksiteId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    {worksites.map((ws) => (
                      <option key={ws.id} value={ws.id}>
                        {ws.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="hydration">Hydration Station</option>
                    <option value="shade">Shade & Canopies</option>
                    <option value="schedule">Work-to-Rest Schedule</option>
                    <option value="cooling">Cooling Gear / Fans</option>
                    <option value="emergency">Emergency & PPE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="urgent">Urgent (Immediate Execution)</option>
                    <option value="high">High Priority</option>
                    <option value="routine">Routine Protocol</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Execution Due Time
                  </label>
                  <input
                    type="text"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Assigned Supervisor
                </label>
                <input
                  type="text"
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Specific Implementation Notes
                </label>
                <textarea
                  rows="2"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Specify equipment numbers, ice amounts, or designated crew."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Save Action Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
