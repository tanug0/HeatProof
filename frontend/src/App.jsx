import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopNavbar from './components/layout/TopNavbar';
import OverviewView from './views/OverviewView';
import WorksitesView from './views/WorksitesView';
import HeatRiskView from './views/HeatRiskView';
import SafetyActionsView from './views/SafetyActionsView';
import EvidenceView from './views/EvidenceView';
import WorkerFeedbackView from './views/WorkerFeedbackView';

import {
  initialWorksites,
  hourlyForecast,
  initialSafetyActions,
  initialEvidenceReports,
  initialWorkerFeedback,
  safetyAlerts,
  recentActivity,
} from './data/demoData';

import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState('all');

  // Interactive persistent states (Task 5: Reusable LocalStorage Layer)
  const [worksites] = useState(initialWorksites);
  const [safetyActions, setSafetyActions] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SAFETY_ACTIONS, initialSafetyActions)
  );
  const [evidenceReports, setEvidenceReports] = useState(() =>
    loadFromStorage(STORAGE_KEYS.EVIDENCE_REPORTS, initialEvidenceReports)
  );
  const [workerFeedback, setWorkerFeedback] = useState(() =>
    loadFromStorage(STORAGE_KEYS.WORKER_FEEDBACK, initialWorkerFeedback)
  );

  // Sync state modifications to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SAFETY_ACTIONS, safetyActions);
  }, [safetyActions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EVIDENCE_REPORTS, evidenceReports);
  }, [evidenceReports]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WORKER_FEEDBACK, workerFeedback);
  }, [workerFeedback]);

  // TASK 1: HAZARD TO SAFETY ACTION WORKFLOW
  // When a worker submits a new hazard report, automatically create a linked safety action
  const handleAddHazard = (newReport) => {
    if (!newReport || !newReport.id) return;

    // Prevent duplicate hazard reports
    const isDuplicateHazard = workerFeedback.some((item) => item.id === newReport.id);
    if (isDuplicateHazard) return;

    // 1. Add hazard report to workerFeedback
    setWorkerFeedback((prev) => [newReport, ...prev]);

    // 2. Identify corresponding worksite
    const matchedWorksite = worksites.find(
      (w) => w.name.toLowerCase() === (newReport.worksiteName || '').toLowerCase()
    );
    const worksiteId = matchedWorksite ? matchedWorksite.id : 'ws-1';

    // 3. Map hazard category to action category
    let category = 'hydration';
    const issueLower = (newReport.issueType || '').toLowerCase();
    if (issueLower.includes('shade') || issueLower.includes('canopy')) {
      category = 'shade';
    } else if (issueLower.includes('water') || issueLower.includes('hydration') || issueLower.includes('electrolyte')) {
      category = 'hydration';
    } else if (issueLower.includes('illness') || issueLower.includes('dizziness') || issueLower.includes('stroke')) {
      category = 'emergency';
    } else if (issueLower.includes('fan') || issueLower.includes('cooling') || issueLower.includes('ventilation')) {
      category = 'cooling';
    }

    // 4. Map urgency to action priority
    let priority = 'urgent';
    if (newReport.urgency === 'immediate') {
      priority = 'urgent';
    } else if (newReport.urgency === 'urgent') {
      priority = 'urgent';
    } else {
      priority = 'high';
    }

    const linkedActionId = `act-hazard-${newReport.id}`;

    // 5. Avoid duplicate safety action creation
    setSafetyActions((prevActions) => {
      const alreadyExists = prevActions.some(
        (a) => a.hazardId === newReport.id || a.id === linkedActionId
      );
      if (alreadyExists) return prevActions;

      const newAction = {
        id: linkedActionId,
        hazardId: newReport.id,
        title: `[Hazard Remediation] ${newReport.title}`,
        worksiteId: worksiteId,
        worksiteName: newReport.worksiteName,
        category: category,
        priority: priority,
        dueTime: newReport.urgency === 'immediate' ? 'Immediate (< 30 min)' : 'Within 1 Hour',
        status: 'pending',
        assignedTo: matchedWorksite ? matchedWorksite.supervisor : 'Rajesh Verma (Lead HSE)',
        verified: false,
        verificationPhoto: null,
        notes: `Automated action generated from worker hazard report (${newReport.specificLocation}): "${newReport.workerComment}". Remediate on-site and upload photo evidence.`,
      };

      return [newAction, ...prevActions];
    });
  };

  // TASK 2: EVIDENCE TO SAFETY ACTION LINKAGE & VERIFICATION
  // When evidence is verified by supervisor, update the linked action's verification status
  // without automatically marking the action completed.
  const handleVerifyEvidence = (evidenceId) => {
    let targetActionId = null;
    let nextVerifiedState = false;
    let photo = null;

    setEvidenceReports((prevReports) =>
      prevReports.map((ev) => {
        if (ev.id === evidenceId) {
          const isCurrentlyVerified = ev.status === 'verified';
          nextVerifiedState = !isCurrentlyVerified;
          targetActionId = ev.actionId;
          photo = ev.photoUrl;
          return {
            ...ev,
            status: nextVerifiedState ? 'verified' : 'pending',
            complianceScore: nextVerifiedState ? 100 : null,
          };
        }
        return ev;
      })
    );

    // If this evidence is linked to a safety action, update action verification
    if (targetActionId && targetActionId !== 'act-manual') {
      setSafetyActions((prevActions) =>
        prevActions.map((act) => {
          if (act.id === targetActionId) {
            return {
              ...act,
              verified: nextVerifiedState,
              verificationPhoto: nextVerifiedState ? (photo || act.verificationPhoto) : act.verificationPhoto,
              // Notice: Status remains untouched (preserves pending or completed)
            };
          }
          return act;
        })
      );
    }
  };

  // New evidence submission handler ensuring it strictly starts as Pending Review
  const handleAddEvidence = (newReport) => {
    if (!newReport || !newReport.id) return;
    const validatedReport = {
      ...newReport,
      status: 'pending', // Strictly Pending Review until approved
      complianceScore: null,
    };
    setEvidenceReports((prev) => [validatedReport, ...prev]);
  };

  // Badge counts
  const highRiskSites = worksites.filter(
    (w) => w.riskLevel === 'extreme' || w.riskLevel === 'high'
  ).length;
  const pendingActions = safetyActions.filter((a) => a.status === 'pending').length;
  const pendingVerifications = evidenceReports.filter((e) => e.status === 'pending').length;
  const openHazards = workerFeedback.filter((f) => f.status === 'open').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row antialiased text-slate-800">
      {/* Left Collapsible Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        counts={{
          highRiskSites,
          pendingActions,
          pendingVerifications,
          openHazards,
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navigation Bar */}
        <TopNavbar
          setMobileOpen={setMobileMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          alerts={safetyAlerts}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          worksites={worksites}
        />

        {/* View Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView
              worksites={worksites}
              safetyActions={safetyActions}
              evidenceReports={evidenceReports}
              workerFeedback={workerFeedback}
              safetyAlerts={safetyAlerts}
              recentActivity={recentActivity}
              hourlyForecast={hourlyForecast}
              setActiveTab={setActiveTab}
              selectedSite={selectedSite}
            />
          )}

          {activeTab === 'worksites' && (
            <WorksitesView
              worksites={worksites}
              searchQuery={searchQuery}
              selectedSite={selectedSite}
              onSelectSite={(id) => setSelectedSite(id)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'heat-risk' && (
            <HeatRiskView
              hourlyForecast={hourlyForecast}
              worksites={worksites}
              externalSelectedSiteId={selectedSite !== 'all' ? selectedSite : undefined}
            />
          )}

          {activeTab === 'safety-actions' && (
            <SafetyActionsView
              safetyActions={safetyActions}
              setSafetyActions={setSafetyActions}
              worksites={worksites}
              searchQuery={searchQuery}
              selectedSite={selectedSite}
            />
          )}

          {activeTab === 'evidence' && (
            <EvidenceView
              evidenceReports={evidenceReports}
              setEvidenceReports={setEvidenceReports}
              worksites={worksites}
              safetyActions={safetyActions}
              searchQuery={searchQuery}
              selectedSite={selectedSite}
              onVerifyEvidence={handleVerifyEvidence}
              onAddEvidence={handleAddEvidence}
            />
          )}

          {activeTab === 'feedback' && (
            <WorkerFeedbackView
              workerFeedback={workerFeedback}
              setWorkerFeedback={setWorkerFeedback}
              worksites={worksites}
              searchQuery={searchQuery}
              selectedSite={selectedSite}
              onAddHazard={handleAddHazard}
            />
          )}
        </main>
      </div>
    </div>
  );
}
