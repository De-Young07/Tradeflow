# TradeFlow NG — Minimum MVP Data Structure

Date: 16 September 2026

Sources: requirements.md and user-flow.md. Only Must-have CD-01–CD-05 and conditional MT-01–MT-05 are covered. This is a structure for manual evidence records, not a database or software specification.

## 1. How to keep the records

Eight record types are sufficient. They can be sections of one case document or entries in a paper log; they do not require eight tools or database tables. Short references such as P1, C1 and T1 only help connect notes without copying information repeatedly.

The selected discovery group is tomatoes, Dikko/Niger, organizational retailers. Store that once in the discovery/stage decision record and link participant cases to it. Existing trader contacts are possible referral sources, not automatically qualifying participants. No producer, buyer or payer is presumed validated.

### Required, conditional and optional fields

- Required means the field must have an entry. For customer facts, that entry can be explicitly unknown, not provided or not applicable, with a reason where known. Required does not mean the founder supplies a guessed value.
- Conditional required means record the field when the stated activity or situation occurs. Stage B records are not mandatory before the discovery gate passes.
- Optional means the record can operate without that detail. Capture it only when relevant and willingly supplied; do not add a collection step solely to fill it.
- Unknown is different from zero, no, refused and not applicable. A field can be recorded as unknown while still blocking a dependent action.
- Before Stage B, the unresolved problem, upcoming job, actionable deadline, active acceptance of a specific task and feasible responsibilities must be established. Before an introduction, essential facts, compatibility and both permissions must be established. Recording unknown does not bypass either gate.

### Common fields on every record

| Field | Requirement | Purpose / provider |
| --- | --- | --- |
| Record reference | Required | Operator assigns a short unique label so evidence can be cited. |
| Related record references | Required where a relationship exists | Operator links the participant, case, test or decision concerned; no duplicate customer profile is needed. |
| Recorded by | Required | Operator name or initials; identifies who made the entry. |
| Recorded at | Required | Date and time the entry was made, including the local time zone for deadline comparisons. |
| Source and evidence status for factual claims | Required | Identify the speaker, operator observation or available supporting source. Label each material claim as reported, estimated, checked with a named source, conflicting or unknown; include the check time when checked. A checked statement is not a guarantee. |
| Event time / period | Required for dated incidents, calls, checks, actions and outcomes | Record when it happened separately from when it was written down. Approximate or unknown historical dates stay labelled that way. |
| Earlier entry reference and reason for change | Conditional required for a material correction or change | Operator preserves the earlier fact, decision, terms or status and links a new dated entry explaining what changed. |

A single note may contain claims with different evidence statuses. For example, identity can be confirmed while quantity is only reported. Do not label the whole case “verified” because one field was checked. The evidence/action journal below provides the history for changing facts; it is not an additional automated verification service.

## 2. The records

### R1. Participant and recruitment record

**Why it must exist:** Establish who was contacted, whether they actually fit the discovery group and who has authority to act. Preserve refusals instead of retaining only willing participants.

**Must-have requirements:** CD-01, CD-04; MT-02 and MT-05 when a counterparty or budget owner participates.

| Fields to store | Required or conditional required | Optional fields |
| --- | --- | --- |
| Participant label; actual role; producer or retail-business purchasing context; operating area; commodity; recruitment/qualification result and basis; participation response | Required, with unknowns explicit. Qualification results distinguish fits group, outside group and unconfirmed. | Real name instead of a pseudonym if useful and willingly given. |
| Working way to reach the person, such as phone contact, introduction route or direct-contact location | Required for continued contact; record unavailable for unsuccessful attempts. One workable contact route is sufficient. | Referral source if there was a referral; no separate referral network/profile. |
| Retail business represented and purchasing responsibility | Conditional required for a retail buyer; a business label is sufficient. | Full business name if the label already identifies the relevant business. |
| Stock-control, purchase-approval or spending authority and how it is known | Conditional required for the next job/task or offer concerned. Do not treat purchaser, approver and budget owner as automatically the same person. | None beyond what is relevant to the job. |
| References to dated contact attempts, responses and refusals | Required as contacts occur, using R5. | Verbatim wording of a refusal if useful; its stated reason or “not provided” is recorded in R5. |

**Provided / verified by:** The person explains their role and authority; a relevant approver or stock controller confirms when needed. The operator records the qualification basis. An existing trader's introduction alone does not verify either role or authority.

### R2. Discovery transaction case

**Why it must exist:** Reconstruct past/current behaviour and determine whether a consequential repeated failure exists, including evidence that the current method works.

**Must-have requirements:** CD-02, CD-03; inputs to CD-05.

| Fields to store | Required or conditional required | Optional fields |
| --- | --- | --- |
| Participant reference; recent transaction date/period; participant role; counterparty description; product/grade; quantity and unit; timing; payment terms; sequence of steps; decision-makers; actual result | Required entries with evidence labels and explicit unknowns. Counterparty description need not contain private contact details. | Counterparty's exact name if relevant and willingly provided. |
| Case type: recent transaction or difficult incident; linked related case where applicable | Required. Record a difficult incident when one is recalled; otherwise explicitly record no recalled failure rather than inventing one. | None. |
| Failure point or absence of failure; current workaround; successful alternative; consequence type and description; recurrence and its stated basis; refusal reasons; switching conditions | Required entries, including unknown/not applicable where appropriate. Record successful methods as well as problems. | Short verbatim customer wording where it helps explain the mechanism. |
| Reported consequence amount, currency/unit and relevant period; estimate basis | Conditional required when quantification is given. Unknown amounts stay unknown; a discount is not automatically a net loss. | Reference to willingly shared supporting evidence already available; obtaining or uploading documents is not required. |

**Provided / verified by:** The participant supplies the account. The operator labels report versus estimate versus checked fact and records the basis for recurrence. Any supporting source is identified only if available; an uncorroborated account remains useful as a labelled report.

### R3. Upcoming job and conditional test brief

**Why it must exist:** Connect a possible intervention to a real upcoming sale/purchase, preserve the original plan and define exactly one task that can be evaluated.

**Must-have requirements:** CD-04; MT-01; task-specific fields from MT-02.

| Fields to store | Required or conditional required | Optional fields |
| --- | --- | --- |
| Participant and discovery-case references; next sale/purchase or explicit absence of one; requirements; original plan/fallback; last actionable date/time; relevant stock, approval and spending roles; possible beneficiary/payer status | Required for upcoming-job discovery, with unknowns preserved. Do not assign payer status from side or role alone. | None. |
| Gate-decision reference; failed step; single agreed task; participant's active acceptance and its dated source; deadline; responsibilities; capability limits; what would show the failed step was addressed | Conditional required before Stage B starts. Link R4 and R5 evidence rather than recopying it. | None. |
| Test status and supporting event reference | Conditional required for Stage B: agreed, held, performed or stopped, with reason where held/stopped. A performed task is not proof of benefit. Preserve changes in R5. | None. |
| For a proposed introduction: producer and buyer references; each side's authority, actual stock/need, product/grade, quantity/unit, location, availability/required timing, payment and collection terms | Conditional required only for an introduction. Preserve each side's terms separately; do not collapse conflicting terms into one agreed value. | None beyond the facts needed for the selected task. |
| Compatibility assessment, mismatch details, essential facts still unconfirmed and references to both parties' specific permissions | Conditional required before any introduction. Unknown essentials or missing permission block it. | None. |
| For another bounded task: facts and permissions needed to perform that particular task | Conditional required for that chosen task only; define these from evidence before acting. No universal extra field set can be justified yet. | None. |

**Provided / verified by:** Participant supplies the upcoming job and baseline; the relevant stock controller, buyer or approver confirms their own facts and authority. Operator records scope, capability, comparisons and the deadline. Each party controls their own permission. Checks and permissions are recorded in R5 with source and time.

### R4. Experiment scope and decision record

**Why it must exist:** Preserve why the team entered or did not enter Stage B and what it concluded, including contrary cases and limitations.

**Must-have requirement:** CD-05; uses MT-04 and MT-05 evidence after a test.

| Fields to store | Required or conditional required | Optional fields |
| --- | --- | --- |
| Discovery scope: tomatoes, Dikko/Niger, organizational retailers; decision point: discovery review, Stage B gate or final review; decision-maker and decision time | Required. Record scope once and reference it. | None. |
| Decision: proceed, narrow, pause or reject; supporting case references; contradictory/refusal case references or none recorded; rationale; limits; unresolved questions; next step | Required at each review. A decision to continue discovery does not authorize a service test. | None. |
| Gate assessment: real unresolved problem, upcoming job, actionable deadline, active acceptance of the specific task, feasible responsibilities; evidence reference and met/unmet/unknown result for each | Conditional required when considering Stage B. Unknown or unmet essentials mean no entry. | None. |
| Final interpretation of task outcome, cost, economic response and repeat evidence, with record references | Conditional required after a manual test. State what remains unknown and do not infer market-wide validation. | None. |

**Provided / verified by:** Operator/experiment lead makes the decision from linked records. The decision is a team interpretation, not itself a customer fact. Keep the entry decision and final decision separately even if they differ.

### R5. Dated evidence, permission and action journal

**Why it must exist:** Reconstruct contact attempts, checks, changing facts, permissions, actions and failures in the order they happened. This combines the necessary history into one log rather than separate messaging, matching and verification systems.

**Must-have requirements:** CD-01, CD-03, CD-04; MT-02, MT-03, MT-04; supports CD-05.

| Fields to store | Required or conditional required | Optional fields |
| --- | --- | --- |
| Related participant/case/test; event type; event date/time; operator; person contacted/source; channel used; question, action or check; response/result; evidence status | Required for each relevant event. Types include contact, fact check, permission, task action, refusal, clarification and follow-up. No-response is a result, not confirmation. | Exact quotation or existing supporting reference where useful and willingly available. |
| Fact checked; value/terms stated; who could confirm it; check outcome: confirmed with named source, unconfirmed or conflicting | Conditional required for a fact check. Identify precisely what was checked rather than mark the entire participant verified. | None. |
| Party giving permission; specific activity/contact-sharing scope; decision: granted, refused or not obtained; time and source | Conditional required for activities requiring permission. For an introduction, keep a separate entry from each party before sharing contacts or introducing them. | None. |
| Actual task action; execution time; participant response; no action, refusal, abandonment or missed deadline where applicable | Conditional required when an action is attempted or performed. Link the task deadline so timeliness can be assessed. | None. |
| Stated rejection reason or not provided; mismatch/unresolved fact; effect on action; clarification result; decision to hold/stop/resume and its basis | Conditional required when such an exception occurs. | None. |
| Earlier entry reference; changed value/status; reason/source of change; effective time if known | Conditional required for a material change. Keep the original entry. | None. |

**Provided / verified by:** Operator records their own actions; the relevant participant, counterparty or approver supplies responses and permissions. Their statements remain attributed. Field observation or additional documentary corroboration is not a compulsory workflow.

### R6. Test outcome and baseline comparison

**Why it must exist:** Separate what TradeFlow did from what actually happened afterward and assess whether the selected failed step was addressed.

**Must-have requirement:** MT-04; supports CD-05 and MT-05.

| Fields to store | Required or conditional required | Optional fields |
| --- | --- | --- |
| Test reference; follow-up event references; latest known outcome and as-of time; participant's subsequent action; unresolved issues/complaints or none reported; unknowns and evidence status | Conditional required when evaluating an attempted/performed manual test. Follow-up failure is recorded, not replaced with a success claim. | Existing willingly shared evidence reference; no upload or receipt requirement. |
| Baseline reference; what happened compared with the original plan/fallback; failed step addressed, not addressed or unknown; basis and limits on attributing improvement to TradeFlow | Required for the test evaluation. An introduction alone is not an order or a completed trade. | None. |
| If parties independently transact: order/agreement status, accepted-delivery status, timing and payment status, each separately labelled | Conditional required as outcome fields when such a transaction is relevant; values are recorded only as willingly shared or explicitly unknown. These are observations, not trade execution or payment processing. | External transaction identifier only if willingly shared and needed to distinguish the event. |

**Provided / verified by:** Participant and relevant counterparty report outcomes; operator records evidence status and compares against the preserved baseline. Later reports are appended with timestamps; disagreement remains visible.

### R7. Manual-test effort and cash-cost record

**Why it must exist:** Determine what the test actually cost, including unsuccessful work and unpaid time, before making economic claims.

**Must-have requirement:** MT-05.

| Fields to store | Required or conditional required | Optional fields |
| --- | --- | --- |
| Test reference; related task/check/follow-up event; person doing the work; activity; activity date; time spent and unit; measured or estimated basis | Conditional required for manual-test work, including failed checks and follow-up. If time was not captured, explicitly record unknown rather than zero. | Short explanation of an estimate when it helps reconstruct the calculation. |
| Cash expense type; amount; currency; actual/estimated/unknown status | Required expense entry for test work: record known no expense as zero; use unknown when not known. | Existing expense reference if available; receipts are not mandatory. |
| Total time and cash cost with the included entry references and unresolved gaps | Required for the test review. Can be calculated manually; do not count the same event twice. | None. |

**Provided / verified by:** Operator or person who did the work supplies time and expenses; operator records the basis and totals. Do not invent a wage rate or turn unpaid effort into no cost.

### R8. Bounded service offer and economic response

**Why it must exist:** Distinguish free participation and praise from an actual budget owner's response to a specific offer, without assuming who pays or adding billing infrastructure.

**Must-have requirement:** MT-05; uses authority information from CD-04.

| Fields to store | Required or conditional required | Optional fields |
| --- | --- | --- |
| Test reference; offer-discussion status: made or not yet possible; beneficiary and actual budget owner reference/status; reason discussion is blocked if applicable | Conditional required for manual-test commercial evaluation, including an unresolved result when the payer is not identified. | None. |
| Explicit service scope; proposed price/currency and any material conditions actually offered; offer date; recipient and authority basis; value, alternative and measured-cost basis | Conditional required when an offer is made. Record actual terms only; this structure sets no price. If no explicit offer was made, record that instead. | None. |
| Dated response; interest; conditional agreement and its conditions; refusal/reason if given; actual agreed payment terms; actual payment evidence/status if available | Conditional required response fields for an offer. Keep the stages separate and mark unavailable payment evidence unknown. Agreement does not establish receipt. | Existing supporting reference if willingly available. |
| Voluntary repeat request: received, none reported or unknown; request details/source/time when received | Required in the economic evaluation; details conditional on an actual request. Absence of evidence does not prove the participant would refuse repeat use. | None. |

**Provided / verified by:** Operator records the actual offer and its basis. The identified budget owner provides the response; any payment evidence is labelled by source. Operator records a voluntary repeat request when received. No payment collection, account, invoice system or subscription is required.

## 3. Preserve material history without extra infrastructure

- Use R5 to append new versions of task terms, quantity, timing, authority, permission and important claims. State which earlier entry they update; retain the earlier value and its evidence status.
- Preserve the original plan and agreed success condition in R3 before the task. A later change must not rewrite what TradeFlow originally set out to test.
- Keep every R4 stage decision with its date and the evidence available then. A final proceed decision must not erase an earlier failed gate or refusal.
- Append later R6 outcome reports and R8 offer responses with their timestamps. An initial expression of interest must remain distinguishable from a later agreement or actual payment evidence.
- Exact past incident times can be unknown or approximate. Operator action/check times and the actionable deadline must be specific enough to establish whether the task was performed in time.
- A new record is only needed for a real case or event. Do not create fictional supply, demand, counterparties, payments or completed trades to fill the structure.

## 4. Minimum links and boundaries

R1 identifies people. R2 holds their discovery cases. R3 links a next job and any conditional task to those cases. R4 cites the evidence for entry and final decisions. R5 records dated facts, permissions and actions for these records. If a test occurs, R6 holds its outcome, R7 its effort/cost and R8 its economic response. References are enough; records do not need to be copied into each section.

Before Stage B, R1–R5 contain only actual discovery information; R3's test fields remain unused. If the gate fails, retain the discovery and decision records without manufacturing R6–R8 service results. A stopped test preserves whatever action, outcome, cost and offer evidence exists, with explicit unknowns.

No separate marketplace listing, order-management system, inventory ledger, forecast dataset, AI output, route plan, delivery tracking, subscription, payment infrastructure, ratings or broad company directory is needed. A test may record external transaction facts only to evaluate what happened. Supporting documents are optional references, not a required collection or upload feature.

## Minimum evidence we must be able to reconstruct after one completed MVP transaction/test.

- **Who was involved and why they qualified:** R1 participant records plus R5 contact history, actual roles, authority and refusals. Existing trader referrals are distinguishable from qualifying producers and retail buyers.
- **What problem justified the test:** R2 recent/difficult transaction accounts, successful workarounds, consequences, recurrence basis and uncertainty, including independent and contrary cases cited in R4.
- **Why the team proceeded:** The dated R4 gate decision citing a real unresolved problem, upcoming job, actionable deadline, active acceptance and feasible responsibilities.
- **What would have happened without TradeFlow:** R3's preserved original plan/fallback, next transaction and failed step, with the agreed single task, responsibilities, deadline and success condition recorded before action.
- **What was checked and permitted:** R5's dated, attributed checks and permissions linked to R3. For an introduction, both sides' actual terms, compatibility or mismatch, and both permissions are reconstructable. For another task, only its necessary facts and permissions are required.
- **What TradeFlow actually did and when:** R5 action entries and responses, including failed checks, no action, refusal, abandonment, any missed deadline and changes to material facts.
- **What happened afterward:** R6 outcome and follow-up references, unresolved issues, baseline comparison and evidence limits. Any external order, accepted delivery and payment status remain separate; unavailable outcomes stay unknown.
- **What the test cost:** R7's dated effort/expense entries, including unsuccessful work and follow-up, totals and unknowns.
- **What the economic test established:** R8's explicit offer and budget-owner response, or why no offer could yet be made; interest, conditions, agreement, payment evidence and voluntary repeat requests remain distinguishable.
- **What the team concluded:** Final R4 proceed/narrow/pause/reject decision with source references, contrary evidence and unresolved hypotheses. Together these records establish what was learned; they do not automatically prove a successful trade, willingness to pay or a scalable business.
