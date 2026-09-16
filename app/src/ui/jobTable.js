/**
 * R3 Upcoming Jobs View Component (CD-04)
 */
export function renderJobTable(jobs = [], participants = [], onNewJobClick) {
  const container = document.getElementById('tab-jobs');
  if (!container) return;

  const getParticipantName = (ref) => {
    const p = participants.find(x => x.participant_ref === ref);
    return p ? p.full_name : ref;
  };

  container.innerHTML = `
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="font-size: 16px; font-weight: 700;">Upcoming Jobs & Fallback Baselines (R3)</h2>
        <p style="font-size: 12px; color: var(--text-muted);">Real upcoming sales & purchases, actionable deadlines, and original fallback plans (CD-04)</p>
      </div>
      <div>
        <button id="btn-add-job-table" class="btn btn-primary btn-sm">+ Record Upcoming Job Brief (R3)</button>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Job Ref</th>
            <th>Participant</th>
            <th>Job Type</th>
            <th>Job Requirements</th>
            <th>Original Plan / Fallback (MT-01 Baseline)</th>
            <th>Actionable Deadline</th>
            <th>Payer Status</th>
          </tr>
        </thead>
        <tbody>
          ${jobs.length === 0 ? `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No upcoming jobs recorded yet. Click "+ Record Upcoming Job Brief" to capture next actionable job.</td></tr>` : ''}
          ${jobs.map(j => {
            const isDeadlinePassed = j.last_actionable_datetime && new Date(j.last_actionable_datetime) < new Date();
            return `
              <tr>
                <td><strong>${j.job_ref}</strong></td>
                <td>
                  <div style="font-weight: 600;">${getParticipantName(j.participant_ref)}</div>
                  <div style="font-size: 11px; color: var(--text-muted);">${j.participant_ref}</div>
                </td>
                <td><span style="font-size: 11px; font-weight: 600;">${j.job_type}</span></td>
                <td style="max-width: 250px;">${j.job_requirements}</td>
                <td style="max-width: 300px; color: var(--primary); font-size: 12px;">${j.original_plan_fallback}</td>
                <td>
                  <div style="font-size: 12px; font-weight: 600; color: ${isDeadlinePassed ? '#f87171' : 'var(--text-primary)'};">
                    ${j.last_actionable_datetime ? new Date(j.last_actionable_datetime).toLocaleString() : 'Not Set'}
                  </div>
                  ${isDeadlinePassed ? '<span class="badge badge-ineligible">Deadline Passed</span>' : '<span class="badge badge-eligible">Actionable</span>'}
                </td>
                <td><span class="badge badge-pending">${j.beneficiary_payer_status}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  const btnAdd = document.getElementById('btn-add-job-table');
  if (btnAdd) btnAdd.onclick = onNewJobClick;
}
