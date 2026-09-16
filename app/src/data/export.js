/**
 * Backup, Export & Import Utilities for CD-01 to CD-04 Discovery Modules
 */

/**
 * Downloads data as a JSON file
 */
export function downloadJsonFile(dataObject, filename = 'tradeflow_discovery_backup.json') {
  const jsonStr = JSON.stringify(dataObject, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports R1 Participants to CSV
 */
export function exportParticipantsToCsv(participants = []) {
  if (!participants.length) return;

  const headers = [
    'Participant Ref',
    'Record Type',
    'Full Name',
    'Phone Contact',
    'Claimed Role',
    'Commodity',
    'State',
    'Town',
    'Referral Source',
    'Eligibility Status',
    'Contact Outcome',
    'Participation Status',
    'Exclusion Reason',
    'Operator Override',
    'Created At'
  ];

  const rows = participants.map(p => [
    p.participant_ref,
    p.record_type,
    `"${(p.full_name || '').replace(/"/g, '""')}"`,
    `"${(p.phone_contact || '').replace(/"/g, '""')}"`,
    p.claimed_role,
    p.commodity,
    p.geography?.state || '',
    p.geography?.town || '',
    `"${(p.referral_source || '').replace(/"/g, '""')}"`,
    p.eligibility_status,
    p.contact_outcome,
    p.participation_status,
    p.exclusion_reason,
    p.operator_override ? 'YES' : 'NO',
    p.created_at
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `tradeflow_r1_participants_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports R2 Transaction Cases to CSV
 */
export function exportCasesToCsv(cases = []) {
  if (!cases.length) return;

  const headers = [
    'Case Ref',
    'Participant Ref',
    'Case Type',
    'Transaction Period',
    'Product Grade',
    'Quantity Unit',
    'Actual Result',
    'Failure Point',
    'Consequence Type',
    'Consequence Amount',
    'Evidence Status',
    'Created At'
  ];

  const rows = cases.map(c => [
    c.case_ref,
    c.participant_ref,
    c.case_type,
    `"${(c.transaction_period || '').replace(/"/g, '""')}"`,
    `"${(c.product_grade || '').replace(/"/g, '""')}"`,
    `"${(c.quantity_unit || '').replace(/"/g, '""')}"`,
    c.actual_result,
    `"${(c.failure_point || '').replace(/"/g, '""')}"`,
    c.consequence_type,
    `"${(c.consequence_amount || '').replace(/"/g, '""')}"`,
    c.evidence_status,
    c.created_at
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `tradeflow_r2_cases_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses and validates JSON backup file
 */
export function parseAndValidateImportJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'File content is not a valid JSON object.' };
    }

    if (!parsed.data || !Array.isArray(parsed.data.participants) || !Array.isArray(parsed.data.journalEntries)) {
      return { isValid: false, error: 'Missing required data.participants or data.journalEntries arrays.' };
    }

    return {
      isValid: true,
      data: parsed,
      participantCount: parsed.data.participants.length,
      caseCount: (parsed.data.cases || []).length,
      jobCount: (parsed.data.jobs || []).length,
      journalCount: parsed.data.journalEntries.length
    };
  } catch (err) {
    return { isValid: false, error: `JSON Parse Error: ${err.message}` };
  }
}
