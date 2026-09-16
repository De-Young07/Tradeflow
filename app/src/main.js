/**
 * Main Controller for TradeFlow Discovery Operations Modules (CD-01 to CD-05)
 */
import { LocalStorageAdapter } from './data/localStorageAdapter.js';
import { renderDashboard } from './ui/dashboard.js';
import { renderParticipantTable } from './ui/participantTable.js';
import { renderParticipantModal } from './ui/participantForm.js';
import { renderCaseTable } from './ui/caseTable.js';
import { renderCaseModal } from './ui/caseForm.js';
import { renderJobTable } from './ui/jobTable.js';
import { renderJobModal } from './ui/jobForm.js';
import { renderDecisionTable } from './ui/decisionTable.js';
import { renderDecisionModal } from './ui/decisionForm.js';
import { renderParticipantDrawer } from './ui/participantDetail.js';
import { renderJournalView } from './ui/journalView.js';
import { renderSettingsModal } from './ui/dangerZone.js';
import { downloadJsonFile } from './data/export.js';

class DiscoveryApp {
  constructor() {
    this.storage = new LocalStorageAdapter();
    this.activeTab = 'tab-dashboard';
    this.participants = [];
    this.cases = [];
    this.jobs = [];
    this.decisions = [];
    this.journalEntries = [];
    this.selectedParticipant = null;
  }

  async init() {
    await this.loadData();
    this.setupTabs();
    this.setupHeaderActions();
    this.render();
  }

  async loadData() {
    this.participants = await this.storage.getParticipants();
    this.cases = await this.storage.getCases();
    this.jobs = await this.storage.getJobs();
    this.decisions = await this.storage.getDecisions();
    this.journalEntries = await this.storage.getJournalEntries();
    this.updateBadges();
  }

  updateBadges() {
    const pBadge = document.getElementById('badge-participant-count');
    const cBadge = document.getElementById('badge-case-count');
    const jBadge = document.getElementById('badge-job-count');
    const dBadge = document.getElementById('badge-decision-count');
    const jnlBadge = document.getElementById('badge-journal-count');

    if (pBadge) pBadge.textContent = this.participants.length;
    if (cBadge) cBadge.textContent = this.cases.length;
    if (jBadge) jBadge.textContent = this.jobs.length;
    if (dBadge) dBadge.textContent = this.decisions.length;
    if (jnlBadge) jnlBadge.textContent = this.journalEntries.length;
  }

  setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-tab');
        this.activeTab = target;

        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        const paneEl = document.getElementById(target);
        if (paneEl) paneEl.classList.add('active');

        this.render();
      };
    });
  }

  setupHeaderActions() {
    const btnNew = document.getElementById('btn-new-candidate');
    if (btnNew) {
      btnNew.onclick = () => {
        renderParticipantModal(async (newP) => {
          await this.storage.saveParticipant(newP);
          await this.loadData();
          this.render();
        }, this.participants);
      };
    }

    const btnExport = document.getElementById('btn-export-backup');
    if (btnExport) {
      btnExport.onclick = async () => {
        const data = await this.storage.exportDataset();
        downloadJsonFile(data, `tradeflow_discovery_backup_${new Date().toISOString().slice(0, 10)}.json`);
      };
    }

    const btnSettings = document.getElementById('btn-settings-danger');
    if (btnSettings) {
      btnSettings.onclick = () => {
        renderSettingsModal(this.storage, async () => {
          await this.loadData();
          this.render();
        });
      };
    }
  }

  render() {
    if (this.activeTab === 'tab-dashboard') {
      renderDashboard(this.participants, this.journalEntries, this.cases, this.jobs, this.decisions);
    } else if (this.activeTab === 'tab-registry') {
      renderParticipantTable(
        this.participants,
        (selectedRef) => this.openParticipantDrawer(selectedRef),
        (editP) => {
          renderParticipantModal(async (updatedP) => {
            await this.storage.saveParticipant(updatedP);
            await this.loadData();
            this.render();
          }, this.participants, editP);
        }
      );
    } else if (this.activeTab === 'tab-cases') {
      renderCaseTable(this.cases, this.participants, () => {
        renderCaseModal(async (newCase) => {
          await this.storage.saveCase(newCase);
          await this.loadData();
          this.render();
        }, this.participants, '', this.cases.length);
      });
    } else if (this.activeTab === 'tab-jobs') {
      renderJobTable(this.jobs, this.participants, () => {
        renderJobModal(async (newJob) => {
          await this.storage.saveJob(newJob);
          await this.loadData();
          this.render();
        }, this.participants, this.cases, '', this.jobs.length);
      });
    } else if (this.activeTab === 'tab-decisions') {
      renderDecisionTable(this.decisions, () => {
        renderDecisionModal(async (newDecision) => {
          await this.storage.saveDecision(newDecision);
          await this.loadData();
          this.render();
        }, this.participants, this.cases, this.decisions.length);
      });
    } else if (this.activeTab === 'tab-journal') {
      renderJournalView(this.journalEntries, this.participants);
    }
  }

  async openParticipantDrawer(participantRef) {
    const p = await this.storage.getParticipantByRef(participantRef);
    if (!p) return;

    this.selectedParticipant = p;
    renderParticipantDrawer(
      p,
      this.journalEntries,
      this.cases,
      this.jobs,
      this.decisions,
      async (newJ) => {
        await this.storage.saveJournalEntry(newJ);
        await this.loadData();
        this.openParticipantDrawer(participantRef);
      },
      (pRef) => {
        renderCaseModal(async (newCase) => {
          await this.storage.saveCase(newCase);
          await this.loadData();
          this.openParticipantDrawer(pRef);
        }, this.participants, pRef, this.cases.length);
      },
      (pRef) => {
        renderJobModal(async (newJob) => {
          await this.storage.saveJob(newJob);
          await this.loadData();
          this.openParticipantDrawer(pRef);
        }, this.participants, this.cases, pRef, this.jobs.length);
      },
      () => {
        this.selectedParticipant = null;
      }
    );
  }
}

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new DiscoveryApp();
  app.init();
});
