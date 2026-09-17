/**
 * Operational Dashboard UI Component
 * Renders Recruitment Quality Metrics, Pipeline Breakdown, Funnel, R2 Incident & R3 Job Metrics
 */
import { ELIGIBILITY_STATUS, CONTACT_OUTCOMES, PARTICIPATION_STATUS, EXCLUSION_REASONS, CLAIMED_ROLES, RECORD_TYPES } from '../domain/constants.js';

export function renderDiscoverySummary(participants = [], journalEntries = [], cases = [], jobs = [], decisions = []) {
  const container = document.getElementById('discovery-summary');
  if (!container) return;

  const totalCandidates = participants.length;
  const realFieldRecords = participants.filter(p => p.record_type === RECORD_TYPES.FIELD).length;
  const testRecords = participants.filter(p => p.record_type === RECORD_TYPES.TEST).length;

  // Pipeline Counters
  const eligibleCount = participants.filter(p => p.eligibility_status === ELIGIBILITY_STATUS.ELIGIBLE).length;
  const pendingCount = participants.filter(p => p.eligibility_status === ELIGIBILITY_STATUS.PENDING_VERIFICATION).length;
  const ineligibleCount = participants.filter(p => p.eligibility_status === ELIGIBILITY_STATUS.INELIGIBLE).length;

  const reachedCount = participants.filter(p => p.contact_outcome === CONTACT_OUTCOMES.REACHED || p.contact_outcome === CONTACT_OUTCOMES.AGREED || p.contact_outcome === CONTACT_OUTCOMES.DECLINED).length;
  const agreedCount = participants.filter(p => p.contact_outcome === CONTACT_OUTCOMES.AGREED).length;
  const enrolledCount = participants.filter(p => p.participation_status === PARTICIPATION_STATUS.DISCOVERY_PARTICIPANT).length;

  // Target Roles
  const producersCount = participants.filter(p => p.claimed_role === CLAIMED_ROLES.PRODUCER).length;
  const purchasersCount = participants.filter(p => p.claimed_role === CLAIMED_ROLES.RETAIL_PURCHASER || p.claimed_role === CLAIMED_ROLES.RETAIL_APPROVER).length;
  const tradersCount = participants.filter(p => p.claimed_role === CLAIMED_ROLES.TRADER_REFERRAL).length;

  // Feature #2 Counters (CD-02, CD-03, CD-04)
  const totalCases = cases.length;
  const difficultIncidents = cases.filter(c => c.case_type === 'DIFFICULT_INCIDENT' || c.actual_result === 'FAILED_TRANSACTION').length;
  const totalJobs = jobs.length;
  const actionableJobs = jobs.filter(j => j.last_actionable_datetime && new Date(j.last_actionable_datetime) >= new Date()).length;

  // Feature #3 Counters (CD-05 / R4)
  const totalDecisions = decisions.length;
  const proceedDecisions = decisions.filter(d => d.stage_decision === 'PROCEED').length;
  const pauseDecisions = decisions.filter(d => d.stage_decision === 'PAUSE').length;
  const narrowDecisions = decisions.filter(d => d.stage_decision === 'NARROW').length;
  const rejectDecisions = decisions.filter(d => d.stage_decision === 'REJECT').length;
  const gatePassedCount = decisions.filter(d => {
    const vals = Object.values(d.gate_assessment || {});
    return vals.length >= 5 && vals.every(v => v === 'MET');
  }).length;

  // Audit Metrics
  const overridesCount = participants.filter(p => p.operator_override).length;
  const unverifiedTraderReferrals = participants.filter(p => p.referral_type === 'EXISTING_TRADER' && p.eligibility_status === ELIGIBILITY_STATUS.PENDING_VERIFICATION).length;

  // Funnel Percentages
  const getPct = (val) => totalCandidates > 0 ? Math.round((val / totalCandidates) * 100) : 0;

  // Exclusion Breakdown
  const exclusions = {};
  Object.keys(EXCLUSION_REASONS).forEach(key => {
    if (key !== 'NONE') exclusions[key] = 0;
  });
  participants.forEach(p => {
    if (p.exclusion_reason && p.exclusion_reason !== EXCLUSION_REASONS.NONE) {
      exclusions[p.exclusion_reason] = (exclusions[p.exclusion_reason] || 0) + 1;
    }
  });

  container.innerHTML = `
    <!-- Operational Metrics Summary Grid -->
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="card-title">Total Discovery Candidates (CD-01)</div>
        <div class="metric-big">${totalCandidates}</div>
        <div class="metric-sub">${realFieldRecords} Field Records | ${testRecords} Synthetic Test Records</div>
      </div>

      <div class="dashboard-card">
        <div class="card-title">Discovery Group Cohort</div>
        <div class="metric-big" style="color: var(--success);">${enrolledCount}</div>
        <div class="metric-sub">Enrolled Discovery Participants (CD-01)</div>
      </div>

      <div class="dashboard-card">
        <div class="card-title">Reconstructed Cases (CD-02/03)</div>
        <div class="metric-big">${totalCases}</div>
        <div class="metric-sub">${difficultIncidents} Difficult Incidents Logged</div>
      </div>

      <div class="dashboard-card">
        <div class="card-title">Stage B Entry Gate Status (CD-05)</div>
        <div class="metric-big" style="color: ${gatePassedCount > 0 ? 'var(--success)' : 'var(--warning)'};">${gatePassedCount} / ${totalDecisions}</div>
        <div class="metric-sub">${proceedDecisions} PROCEED | ${pauseDecisions} PAUSE | ${narrowDecisions} NARROW | ${rejectDecisions} REJECT</div>
      </div>
    </div>

    <!-- Funnel and Exclusion Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <!-- Recruitment Funnel -->
      <div class="dashboard-card">
        <div class="card-title">Recruitment Pipeline Funnel</div>
        <div class="funnel-container">
          <div class="funnel-step">
            <span>1. Candidates Registered</span>
            <strong>${totalCandidates} (100%)</strong>
          </div>
          <div class="funnel-bar-bg"><div class="funnel-bar-fill" style="width: 100%;"></div></div>

          <div class="funnel-step">
            <span>2. Reached via Call / Field</span>
            <strong>${reachedCount} (${getPct(reachedCount)}%)</strong>
          </div>
          <div class="funnel-bar-bg"><div class="funnel-bar-fill" style="width: ${getPct(reachedCount)}%;"></div></div>

          <div class="funnel-step">
            <span>3. Scope & Role Eligible</span>
            <strong>${eligibleCount} (${getPct(eligibleCount)}%)</strong>
          </div>
          <div class="funnel-bar-bg"><div class="funnel-bar-fill" style="width: ${getPct(eligibleCount)}%; background-color: var(--success);"></div></div>

          <div class="funnel-step">
            <span>4. Agreed to Interview</span>
            <strong>${agreedCount} (${getPct(agreedCount)}%)</strong>
          </div>
          <div class="funnel-bar-bg"><div class="funnel-bar-fill" style="width: ${getPct(agreedCount)}%;"></div></div>

          <div class="funnel-step">
            <span>5. Enrolled Participants</span>
            <strong>${enrolledCount} (${getPct(enrolledCount)}%)</strong>
          </div>
          <div class="funnel-bar-bg"><div class="funnel-bar-fill" style="width: ${getPct(enrolledCount)}%; background-color: var(--primary);"></div></div>
        </div>
      </div>

      <!-- Exclusion Reason Distribution -->
      <div class="dashboard-card">
        <div class="card-title">Disqualification & Exclusion Analysis</div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span>Outside Scope: Commodity (Not Tomatoes)</span>
            <strong style="color: var(--danger);">${exclusions.OUTSIDE_COMMODITY || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span>Outside Scope: Geography (Not Dikko/Niger)</span>
            <strong style="color: var(--danger);">${exclusions.OUTSIDE_GEOGRAPHY || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span>No Purchasing / Approval Authority</span>
            <strong style="color: var(--danger);">${exclusions.NO_PURCHASE_AUTHORITY || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span>Trader View Only (Non-Qualifying)</span>
            <strong style="color: var(--warning);">${exclusions.TRADER_ONLY || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span>Trader Referral Pending Verification</span>
            <strong style="color: var(--warning);">${exclusions.REFERRAL_NOT_VERIFIED || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; border-top: 1px solid var(--border-color); padding-top: 8px;">
            <span>Total Ineligible Candidates</span>
            <strong style="color: var(--danger);">${ineligibleCount}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

