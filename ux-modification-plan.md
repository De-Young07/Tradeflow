# Discovery operator UX modification plan
Date: 17 September 2026

## Inspection and workflow map
- dashboard.js: statistics first, raw funnel counts; replace with scope, actual pending work and concise metrics.
- participantTable.js: nine columns and internal statuses; simplify to person, role, area, readable status, last contact and next action.
- participantForm.js: flat intake and irrelevant authority fields; group existing fields, conditionally show authority, retain deterministic engine and explicit override justification.
- participantDetail.js: long mixed record stream; add next-action guidance and Overview / Contact history / Interview & evidence sections.
- journalView.js: global R5 table; readable labels, chronological history and actionable empty state.
- aiReviewModal.js: provider-heavy presentation; transcript then claims review with explicit AI draft label and separate provenance details. Preserve consent, approval and evidence metadata.
- case/job/decision forms and tables: preserve existing workflows under supporting navigation.
- dailyBriefView.js / discoveryIntelligence.js: retain under Discovery insights, without running AI automatically.
- dangerZone.js: retain exports and confirmed reset behind secondary data-management access.

## Implementation files
app/index.html; app/src/style.css; app/src/main.js; app/src/ui/{workflow.js,ux.js,dashboard.js,participantTable.js,participantForm.js,participantDetail.js,journalView.js,aiReviewModal.js}; wording and empty-state improvements in supporting UI components; app/src/tests/ux.test.js; user-test-notes.md.

## Boundaries
No domain qualification changes, record schema migrations, backend/provider/security changes or new customer services. Follow-ups are a view of existing pending contact/qualification data, not a scheduling system. Interview drafts are not persisted today, so do not invent a pending-draft counter. Manual journal entries do not imply completed interviews. Existing uncommitted AI work is preserved.

## Verification
Run existing tests and new UI/workflow tests, production build, desktop/mobile checks and simulated operator tasks. Record observed failures separately from the blank external-user testing template. Real 3–5-person testing remains pending.
