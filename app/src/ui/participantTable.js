/**
 * Participant Registry (R1 Table) UI Component
 */
import { CLAIMED_ROLE_LABELS, ELIGIBILITY_STATUS, CONTACT_OUTCOMES, PARTICIPATION_STATUS, RECORD_TYPES } from '../domain/constants.js';

export function renderParticipantTable(participants = [], onSelectParticipant, onEditParticipant) {
  const container = document.getElementById('tab-registry');
  if (!container) return;

  container.innerHTML = `
    <!-- Toolbar -->
    <div class="table-toolbar">
      <div style="display: flex; gap: 12px; align-items: center;">
        <input type="text" id="registry-search" class="search-input" placeholder="Search by name, ref, or referral source...">
        
        <select id="filter-eligibility" class="select-input">
          <option value="ALL">All Eligibility Statuses</option>
          <option value="${ELIGIBILITY_STATUS.ELIGIBLE}">ELIGIBLE</option>
          <option value="${ELIGIBILITY_STATUS.PENDING_VERIFICATION}">PENDING_VERIFICATION</option>
          <option value="${ELIGIBILITY_STATUS.INELIGIBLE}">INELIGIBLE</option>
        </select>

        <select id="filter-role" class="select-input">
          <option value="ALL">All Roles</option>
          <option value="PRODUCER">Tomato Producers</option>
          <option value="RETAIL_PURCHASER">Retail Purchasers / Approvers</option>
          <option value="TRADER_REFERRAL">Trader Referrals</option>
        </select>
      </div>

      <div style="font-size: 12px; color: var(--text-muted);">
        Showing <strong id="visible-count">${participants.length}</strong> of ${participants.length} Participant Records
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Ref ID</th>
            <th>Candidate Name</th>
            <th>Claimed Role</th>
            <th>Commodity / Area</th>
            <th>Eligibility Status</th>
            <th>Contact Outcome</th>
            <th>Participation</th>
            <th>Record Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="table-body-participants">
          <!-- Rows rendered dynamically -->
        </tbody>
      </table>
    </div>
  `;

  const tbody = document.getElementById('table-body-participants');
  const searchInput = document.getElementById('registry-search');
  const filterEligibility = document.getElementById('filter-eligibility');
  const filterRole = document.getElementById('filter-role');
  const visibleCountEl = document.getElementById('visible-count');

  const filterAndRender = () => {
    const search = searchInput.value.toLowerCase().trim();
    const eligFilter = filterEligibility.value;
    const roleFilter = filterRole.value;

    const filtered = participants.filter(p => {
      const nameMatch = (p.full_name || '').toLowerCase().includes(search) || (p.participant_ref || '').toLowerCase().includes(search) || (p.referral_source || '').toLowerCase().includes(search);
      const eligMatch = eligFilter === 'ALL' || p.eligibility_status === eligFilter;
      const roleMatch = roleFilter === 'ALL' || p.claimed_role === roleFilter || (roleFilter === 'RETAIL_PURCHASER' && (p.claimed_role === 'RETAIL_PURCHASER' || p.claimed_role === 'RETAIL_APPROVER'));

      return nameMatch && eligMatch && roleMatch;
    });

    visibleCountEl.textContent = filtered.length;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No participant records found matching the current search criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const eligBadgeClass = p.eligibility_status === ELIGIBILITY_STATUS.ELIGIBLE ? 'badge-eligible' : p.eligibility_status === ELIGIBILITY_STATUS.INELIGIBLE ? 'badge-ineligible' : 'badge-pending';
      const recordBadgeClass = p.record_type === RECORD_TYPES.TEST ? 'badge-test' : 'badge-field';

      return `
        <tr data-ref="${p.participant_ref}">
          <td><strong>${p.participant_ref}</strong></td>
          <td>
            <div style="font-weight: 600;">${p.full_name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${p.phone_contact}</div>
          </td>
          <td>${CLAIMED_ROLE_LABELS[p.claimed_role] || p.claimed_role}</td>
          <td>${p.commodity} (${p.geography?.town || 'Dikko'}, ${p.geography?.state || 'Niger'})</td>
          <td>
            <span class="badge ${eligBadgeClass}">${p.eligibility_status}</span>
            ${p.operator_override ? '<span title="Operator Overrode System Recommendation" style="color: #f87171; font-weight: bold; cursor: help; margin-left: 4px;">⚡</span>' : ''}
          </td>
          <td><span style="font-size: 12px; color: var(--text-secondary);">${p.contact_outcome}</span></td>
          <td>
            <span style="font-size: 11px; font-weight: 600; color: ${p.participation_status === PARTICIPATION_STATUS.DISCOVERY_PARTICIPANT ? 'var(--success)' : 'var(--text-muted)'};">
              ${p.participation_status}
            </span>
          </td>
          <td><span class="badge ${recordBadgeClass}">${p.record_type}</span></td>
          <td onclick="event.stopPropagation();">
            <button class="btn btn-ghost btn-sm btn-view-detail" data-ref="${p.participant_ref}">View Journal</button>
            <button class="btn btn-secondary btn-sm btn-edit-p" data-ref="${p.participant_ref}">Edit R1</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Row Click & Button Events
    tbody.querySelectorAll('tr').forEach(row => {
      const ref = row.getAttribute('data-ref');
      row.onclick = () => onSelectParticipant(ref);
    });

    tbody.querySelectorAll('.btn-view-detail').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        onSelectParticipant(btn.getAttribute('data-ref'));
      };
    });

    tbody.querySelectorAll('.btn-edit-p').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const ref = btn.getAttribute('data-ref');
        const p = participants.find(x => x.participant_ref === ref);
        if (p) onEditParticipant(p);
      };
    });
  };

  searchInput.oninput = filterAndRender;
  filterEligibility.onchange = filterAndRender;
  filterRole.onchange = filterAndRender;

  filterAndRender();
}
