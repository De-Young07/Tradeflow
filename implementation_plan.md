# Implementation Plan — Feature 4: Define and Check One Bounded Manual Test (MT-01, MT-02)

Build **Feature #4 (MT-01, MT-02)** of the TradeFlow NG Discovery Operations Infrastructure, allowing operators to define a single bounded manual test brief (MT-01) and run pre-action fact checks and mutual permission verification (MT-02) after the Stage B entry gate passes.

## User Review Required

> [!IMPORTANT]
> **Conditional Stage B Entry:** Feature 4 (MT-01/MT-02) becomes applicable only after an R4 Stage Decision is recorded as `PROCEED` with all 5 Stage B gate criteria `MET`.
> 
> **Strict Pre-Action Blocking:** For introduction tasks, **both parties' specific permissions must be explicitly GRANTED** and essential transaction facts confirmed before contact details are shared or task execution occurs. Missing permissions, unknown essential facts, or fundamental incompatibilities automatically set the test status to `HELD` or `STOPPED`.

---

## Proposed Changes

### Domain Schemas & Business Rules

#### [MODIFY] [constants.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/domain/constants.js)
- Define `TEST_STATUS`: `DRAFT`, `AGREED`, `HELD`, `PERFORMED`, `STOPPED`.
- Define `TASK_TYPES`: `MANUAL_INTRODUCTION`, `TERMS_COORDINATION`, `PRICE_INFORMATION`, `OTHER_BOUNDED_TASK`.
- Define `PERMISSION_STATUS`: `GRANTED`, `REFUSED`, `NOT_OBTAINED`.
- Define `COMPATIBILITY_STATUS`: `COMPATIBLE`, `MISMATCH_WARN`, `INCOMPATIBLE_BLOCK`.

#### [MODIFY] [models.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/domain/models.js)
- Extend `createR3Job` to store bounded manual test brief fields (MT-01/02):
  - `failed_step`: Exact transaction step being addressed.
  - `agreed_task`: Chosen single bounded task (`MANUAL_INTRODUCTION`, etc.).
  - `task_responsibilities`: Responsibilities bounded within team capability.
  - `task_deadline`: Last actionable date/time for task completion.
  - `success_evidence_criteria`: What would show the step was addressed.
  - `test_status`: Current test state (`AGREED`, `HELD`, `STOPPED`, etc.).
  - `introduction_details`: Two-sided terms (producer & buyer authority, stock/need, grade, quantity, location, timing, payment terms).
  - `compatibility_assessment`: Mismatch details & compatibility status.
  - `permissions`: Producer & buyer permissions (`producer_permission`, `buyer_permission`).

#### [MODIFY] [validation.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/domain/validation.js)
- Implement `validateR3TestBrief`: Validates MT-01 test brief completeness (requires baseline, failed step, agreed task, deadline, and success evidence criteria).
- Implement `evaluatePreActionFactChecks`: Enforces MT-02 pre-action checks. For an introduction task:
  - Verifies both producer & buyer permissions are `GRANTED`.
  - Checks compatibility (flags quantity or price mismatches).
  - Blocks test execution (sets status `HELD` or `STOPPED`) if permissions are refused/not obtained, or if essential facts are unconfirmed.

---

### Automated Tests

#### [NEW] [manualTest.test.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/tests/manualTest.test.js)
- Unit tests covering MT-01 test brief validation, MT-02 pre-action fact checks, mismatch detection, mutual permission blocking, and test status transitions.

#### [MODIFY] [run-tests.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/tests/run-tests.js)
- Wire `manualTest.test.js` into the automated test runner (target: 45+ unit tests passing).

---

### Storage & Data Layer

#### [MODIFY] [seed.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/data/seed.js)
- Add synthetic R3 jobs with bounded manual test briefs (MT-01/MT-02) tagged `record_type: "TEST"`.

#### [MODIFY] [export.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/data/export.js)
- Ensure MT-01/MT-02 test brief fields and mutual permissions are exported/imported in JSON and CSV backups.

---

### User Interface

#### [NEW] [manualTestForm.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/ui/manualTestForm.js)
- Modal dialog for defining a Bounded Manual Test Brief (MT-01) and executing pre-action fact checks and mutual permission verification (MT-02) with live compatibility warnings and permission status badges.

#### [NEW] [manualTestTable.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/ui/manualTestTable.js)
- Table view component for "Manual Test Briefs (MT-01/02)" displaying test refs, linked participants/cases, fallback baselines, agreed tasks, mutual permission badges, compatibility statuses, and test status controls.

#### [MODIFY] [participantDetail.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/ui/participantDetail.js)
- Display linked Bounded Manual Test Briefs and mutual permission statuses in the 360° drawer.

#### [MODIFY] [dashboard.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/ui/dashboard.js)
- Add "Stage B Manual Tests (MT-01/02)" card showing active tests, held/stopped test counts, and mutual permission checks.

#### [MODIFY] [index.html](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/index.html)
- Add navigation tab `<button class="nav-tab" data-tab="tab-manual-tests">` and content pane `<section id="tab-manual-tests">`.

#### [MODIFY] [main.js](file:///c:/Users/HomePC/Projects/TradeFlow%20NG%204.0/app/src/main.js)
- Wire up tab router, state handling, modal triggers, and badge counts for Manual Test Briefs.

---

## Verification Plan

### Automated Tests
- Run `node src/tests/run-tests.js` to execute the full suite (45+ tests target).
- Run `npx vite build` to ensure zero compilation or bundler errors.

### Manual Verification
- Open `http://localhost:5173` in browser.
- Navigate to **"Manual Test Briefs (MT-01/02)"** tab -> Click **"+ Define Manual Test Brief"**.
- Test MT-02 pre-action checks: Verify that if either producer or buyer permission is set to `NOT_OBTAINED` or `REFUSED`, test status is forced to `HELD` or `STOPPED`.
- Set both permissions to `GRANTED` and verify test status can transition to `AGREED`.
- Verify linked test briefs appear in the 360° Participant Drawer and Operational Dashboard.
