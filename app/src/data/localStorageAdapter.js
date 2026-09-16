/**
 * LocalStorage Adapter Implementation for R1, R2, R3, R4, R5
 */
import { StorageAdapter } from './storageAdapter.js';
import { getSeedData } from './seed.js';

const STORAGE_KEY_R1 = 'tf_cd01_r1_participants_v2';
const STORAGE_KEY_R2 = 'tf_cd02_r2_cases_v2';
const STORAGE_KEY_R3 = 'tf_cd04_r3_jobs_v2';
const STORAGE_KEY_R4 = 'tf_cd05_r4_decisions_v2';
const STORAGE_KEY_R5 = 'tf_cd01_r5_journal_v2';

export class LocalStorageAdapter extends StorageAdapter {
  constructor() {
    super();
    this.initSeedIfNeeded();
  }

  initSeedIfNeeded() {
    const existingR1 = localStorage.getItem(STORAGE_KEY_R1);
    const existingR2 = localStorage.getItem(STORAGE_KEY_R2);
    const existingR3 = localStorage.getItem(STORAGE_KEY_R3);
    const existingR4 = localStorage.getItem(STORAGE_KEY_R4);
    const existingR5 = localStorage.getItem(STORAGE_KEY_R5);

    if (!existingR1 || !existingR2 || !existingR3 || !existingR4 || !existingR5) {
      const seed = getSeedData();
      localStorage.setItem(STORAGE_KEY_R1, JSON.stringify(seed.participants));
      localStorage.setItem(STORAGE_KEY_R2, JSON.stringify(seed.cases || []));
      localStorage.setItem(STORAGE_KEY_R3, JSON.stringify(seed.jobs || []));
      localStorage.setItem(STORAGE_KEY_R4, JSON.stringify(seed.decisions || []));
      localStorage.setItem(STORAGE_KEY_R5, JSON.stringify(seed.journalEntries));
    }
  }

  // --- R1 PARTICIPANTS ---
  async getParticipants() {
    const raw = localStorage.getItem(STORAGE_KEY_R1);
    return raw ? JSON.parse(raw) : [];
  }

  async getParticipantByRef(participantRef) {
    const list = await this.getParticipants();
    return list.find(p => p.participant_ref === participantRef) || null;
  }

  async saveParticipant(participant) {
    const list = await this.getParticipants();
    const index = list.findIndex(p => p.participant_ref === participant.participant_ref);
    
    const updatedParticipant = {
      ...participant,
      updated_at: new Date().toISOString()
    };

    if (index >= 0) {
      list[index] = updatedParticipant;
    } else {
      list.push(updatedParticipant);
    }

    localStorage.setItem(STORAGE_KEY_R1, JSON.stringify(list));
    return updatedParticipant;
  }

  async deleteParticipant(participantRef) {
    let list = await this.getParticipants();
    list = list.filter(p => p.participant_ref !== participantRef);
    localStorage.setItem(STORAGE_KEY_R1, JSON.stringify(list));

    let cases = await this.getCases();
    cases = cases.filter(c => c.participant_ref !== participantRef);
    localStorage.setItem(STORAGE_KEY_R2, JSON.stringify(cases));

    let jobs = await this.getJobs();
    jobs = jobs.filter(j => j.participant_ref !== participantRef);
    localStorage.setItem(STORAGE_KEY_R3, JSON.stringify(jobs));

    let journal = await this.getJournalEntries();
    journal = journal.filter(j => j.participant_ref !== participantRef);
    localStorage.setItem(STORAGE_KEY_R5, JSON.stringify(journal));
    return true;
  }

  // --- R2 DISCOVERY TRANSACTION CASES ---
  async getCases(participantRef = null) {
    const raw = localStorage.getItem(STORAGE_KEY_R2);
    const list = raw ? JSON.parse(raw) : [];

    if (participantRef) {
      return list.filter(c => c.participant_ref === participantRef);
    }
    return list;
  }

  async saveCase(caseRecord) {
    const list = await this.getCases();
    const index = list.findIndex(c => c.case_ref === caseRecord.case_ref);

    if (index >= 0) {
      list[index] = caseRecord;
    } else {
      list.push(caseRecord);
    }

    localStorage.setItem(STORAGE_KEY_R2, JSON.stringify(list));
    return caseRecord;
  }

  async deleteCase(caseRef) {
    let list = await this.getCases();
    list = list.filter(c => c.case_ref !== caseRef);
    localStorage.setItem(STORAGE_KEY_R2, JSON.stringify(list));
    return true;
  }

  // --- R3 UPCOMING JOBS ---
  async getJobs(participantRef = null) {
    const raw = localStorage.getItem(STORAGE_KEY_R3);
    const list = raw ? JSON.parse(raw) : [];

    if (participantRef) {
      return list.filter(j => j.participant_ref === participantRef);
    }
    return list;
  }

  async saveJob(jobRecord) {
    const list = await this.getJobs();
    const index = list.findIndex(j => j.job_ref === jobRecord.job_ref);

    if (index >= 0) {
      list[index] = jobRecord;
    } else {
      list.push(jobRecord);
    }

    localStorage.setItem(STORAGE_KEY_R3, JSON.stringify(list));
    return jobRecord;
  }

  async deleteJob(jobRef) {
    let list = await this.getJobs();
    list = list.filter(j => j.job_ref !== jobRef);
    localStorage.setItem(STORAGE_KEY_R3, JSON.stringify(list));
    return true;
  }

  // --- R4 STAGE DECISIONS ---
  async getDecisions() {
    const raw = localStorage.getItem(STORAGE_KEY_R4);
    return raw ? JSON.parse(raw) : [];
  }

  async saveDecision(decisionRecord) {
    const list = await this.getDecisions();
    const index = list.findIndex(d => d.decision_ref === decisionRecord.decision_ref);

    if (index >= 0) {
      list[index] = decisionRecord;
    } else {
      list.push(decisionRecord);
    }

    localStorage.setItem(STORAGE_KEY_R4, JSON.stringify(list));
    return decisionRecord;
  }

  async deleteDecision(decisionRef) {
    let list = await this.getDecisions();
    list = list.filter(d => d.decision_ref !== decisionRef);
    localStorage.setItem(STORAGE_KEY_R4, JSON.stringify(list));
    return true;
  }

  // --- R5 EVIDENCE JOURNAL ---
  async getJournalEntries(participantRef = null) {
    const raw = localStorage.getItem(STORAGE_KEY_R5);
    const list = raw ? JSON.parse(raw) : [];

    if (participantRef) {
      return list.filter(j => j.participant_ref === participantRef);
    }
    return list;
  }

  async saveJournalEntry(entry) {
    const list = await this.getJournalEntries();
    const newEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    };

    list.push(newEntry);
    localStorage.setItem(STORAGE_KEY_R5, JSON.stringify(list));
    return newEntry;
  }

  // --- DATASET EXPORT & IMPORT ---
  async exportDataset() {
    const participants = await this.getParticipants();
    const cases = await this.getCases();
    const jobs = await this.getJobs();
    const decisions = await this.getDecisions();
    const journalEntries = await this.getJournalEntries();

    return {
      module: 'TradeFlow Discovery Operations (CD-01 to CD-05)',
      version: '3.0.0',
      exported_at: new Date().toISOString(),
      record_counts: {
        r1_participants: participants.length,
        r2_cases: cases.length,
        r3_jobs: jobs.length,
        r4_decisions: decisions.length,
        r5_journal_entries: journalEntries.length
      },
      data: {
        participants,
        cases,
        jobs,
        decisions,
        journalEntries
      }
    };
  }

  async importDataset(importedData) {
    if (!importedData || !importedData.data || !Array.isArray(importedData.data.participants) || !Array.isArray(importedData.data.journalEntries)) {
      throw new Error('Invalid dataset format: Missing data.participants or data.journalEntries arrays.');
    }

    localStorage.setItem(STORAGE_KEY_R1, JSON.stringify(importedData.data.participants || []));
    localStorage.setItem(STORAGE_KEY_R2, JSON.stringify(importedData.data.cases || []));
    localStorage.setItem(STORAGE_KEY_R3, JSON.stringify(importedData.data.jobs || []));
    localStorage.setItem(STORAGE_KEY_R4, JSON.stringify(importedData.data.decisions || []));
    localStorage.setItem(STORAGE_KEY_R5, JSON.stringify(importedData.data.journalEntries || []));
    return true;
  }

  async clearDataset() {
    localStorage.removeItem(STORAGE_KEY_R1);
    localStorage.removeItem(STORAGE_KEY_R2);
    localStorage.removeItem(STORAGE_KEY_R3);
    localStorage.removeItem(STORAGE_KEY_R4);
    localStorage.removeItem(STORAGE_KEY_R5);
    return true;
  }
}
