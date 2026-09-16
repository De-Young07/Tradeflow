/**
 * Settings, Data Resilience & Danger Zone Component
 */
import { downloadJsonFile, exportParticipantsToCsv, parseAndValidateImportJson } from '../data/export.js';

export function renderSettingsModal(storageAdapter, onDatasetChanged) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Data Resilience, Export & Settings</h2>
        <button id="modal-close" class="btn btn-ghost" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="modal-body">
        <!-- Section 1: Backup & Export -->
        <div style="background-color: var(--bg-input); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: 700; color: var(--primary);">Export Discovery Dataset</h3>
          <p style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Download full relational JSON backup or export R1 participant registry to CSV.</p>
          
          <div style="display: flex; gap: 10px; margin-top: 12px;">
            <button id="btn-export-json-modal" class="btn btn-primary btn-sm">Download Complete JSON Backup</button>
            <button id="btn-export-csv-modal" class="btn btn-secondary btn-sm">Export R1 Registry (CSV)</button>
          </div>
        </div>

        <!-- Section 2: Restore Backup -->
        <div style="background-color: var(--bg-input); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: 700; color: var(--primary);">Restore Backup from File</h3>
          <p style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Select a previously exported TradeFlow CD-01 JSON backup file to restore records.</p>
          
          <input type="file" id="file-import-json" accept=".json" style="margin-top: 10px; font-size: 12px; color: var(--text-secondary);">
          <div id="import-status-msg" style="margin-top: 8px; font-size: 12px;"></div>
        </div>

        <!-- Section 3: Danger Zone Safeguard -->
        <div style="background-color: var(--danger-bg); border: 1px solid var(--danger); padding: 16px; border-radius: var(--radius-md);">
          <h3 style="font-size: 14px; font-weight: 700; color: #f87171;">⚠️ Danger Zone — Reset Local Discovery Dataset</h3>
          <p style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
            Permanently clear all local R1 participant registry records and R5 evidence journal logs.
            <strong>This action cannot be undone!</strong> It is strongly recommended to export a JSON backup first.
          </p>

          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
            <label style="font-size: 12px; color: #f87171;">To confirm deletion, type <strong>DELETE CD-01</strong> in the box below:</label>
            <input type="text" id="input-confirm-delete" class="form-control" placeholder="DELETE CD-01" style="border-color: var(--danger);">
            <button id="btn-execute-reset" class="btn btn-danger btn-sm" style="align-self: flex-start; margin-top: 4px;" disabled>
              Permanently Clear Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');

  const closeModal = () => modalContainer.classList.add('hidden');
  document.getElementById('modal-close').onclick = closeModal;

  // JSON Export Handler
  document.getElementById('btn-export-json-modal').onclick = async () => {
    const data = await storageAdapter.exportDataset();
    downloadJsonFile(data, `tradeflow_cd01_backup_${new Date().toISOString().slice(0, 10)}.json`);
  };

  // CSV Export Handler
  document.getElementById('btn-export-csv-modal').onclick = async () => {
    const participants = await storageAdapter.getParticipants();
    exportParticipantsToCsv(participants);
  };

  // Restore JSON File Handler
  const fileInput = document.getElementById('file-import-json');
  const statusMsg = document.getElementById('import-status-msg');

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const res = parseAndValidateImportJson(evt.target.result);
      if (!res.isValid) {
        statusMsg.style.color = '#f87171';
        statusMsg.textContent = `❌ Import Failed: ${res.error}`;
        return;
      }

      await storageAdapter.importDataset(res.data);
      statusMsg.style.color = 'var(--success)';
      statusMsg.textContent = `✓ Successfully restored ${res.participantCount} Participants and ${res.journalCount} Journal Entries!`;
      setTimeout(() => {
        closeModal();
        onDatasetChanged();
      }, 1500);
    };
    reader.readAsText(file);
  };

  // Danger Zone Typed Verification Safeguard
  const deleteInput = document.getElementById('input-confirm-delete');
  const deleteBtn = document.getElementById('btn-execute-reset');

  deleteInput.oninput = () => {
    if (deleteInput.value.trim() === 'DELETE CD-01') {
      deleteBtn.removeAttribute('disabled');
    } else {
      deleteBtn.setAttribute('disabled', 'true');
    }
  };

  deleteBtn.onclick = async () => {
    if (deleteInput.value.trim() !== 'DELETE CD-01') return;
    await storageAdapter.clearDataset();
    alert('Local dataset has been cleared.');
    closeModal();
    onDatasetChanged();
  };
}
