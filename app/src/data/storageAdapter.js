/**
 * Abstract Storage Adapter Interface
 * Abstract contract defining operations for participant registry (R1), transaction cases (R2), upcoming jobs (R3), stage decisions (R4), and evidence journal (R5).
 * Enables clean future migration from LocalStorage to PostgreSQL / Supabase.
 */
export class StorageAdapter {
  async getParticipants() { throw new Error('Not implemented'); }
  async getParticipantByRef(participantRef) { throw new Error('Not implemented'); }
  async saveParticipant(participant) { throw new Error('Not implemented'); }
  async deleteParticipant(participantRef) { throw new Error('Not implemented'); }

  async getCases(participantRef = null) { throw new Error('Not implemented'); }
  async saveCase(caseRecord) { throw new Error('Not implemented'); }
  async deleteCase(caseRef) { throw new Error('Not implemented'); }

  async getJobs(participantRef = null) { throw new Error('Not implemented'); }
  async saveJob(jobRecord) { throw new Error('Not implemented'); }
  async deleteJob(jobRef) { throw new Error('Not implemented'); }

  async getDecisions() { throw new Error('Not implemented'); }
  async saveDecision(decisionRecord) { throw new Error('Not implemented'); }
  async deleteDecision(decisionRef) { throw new Error('Not implemented'); }

  async getJournalEntries(participantRef = null) { throw new Error('Not implemented'); }
  async saveJournalEntry(entry) { throw new Error('Not implemented'); }

  async exportDataset() { throw new Error('Not implemented'); }
  async importDataset(data) { throw new Error('Not implemented'); }
  async clearDataset() { throw new Error('Not implemented'); }
}
