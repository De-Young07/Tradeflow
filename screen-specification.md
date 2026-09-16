Direct product users: None are required to operate TradeFlow software in this MVP. The TradeFlow operator runs the manual process and maintains its records.

Users served without directly operating the software: Actual tomato producers and people responsible for bulk tomato purchases for retail businesses in Dikko/Niger; relevant counterparties, approvers and budget owners participate through direct communication when needed. Their customer and payer status remains unvalidated.

# TradeFlow NG — Screen Specification

Date: 16 September 2026

Sources: requirements.md and user-flow.md. Scope: Must-have CD-01–CD-05 and conditional MT-01–MT-05 only.

## 1. Decision: no product screens required

The entire Must-have flow can run through phone calls or direct conversations and a manual case log. Requirements Section 3 explicitly permits a plain document, paper log or existing basic recording tool and states that no software build is required. User-flow.md uses those channels throughout discovery and the conditional manual test.

No customer-facing or internal product screen is necessary. Choosing to type notes into an existing tool does not create a requirement to build a TradeFlow screen. A phone's existing call interface is also a channel tool, not a product screen to specify.

The screen inventory is empty. Screen names, layouts, displayed information, input controls, buttons, navigation and screen error states are therefore not applicable. The interactions and human checks below describe how the Must-have work is performed without inventing interface elements.

## 2. Channels and recording method

| Channel or method | Actors | Use in the Must-have flow | Requirement references |
| --- | --- | --- | --- |
| Phone calls or direct conversations | Operator and actual producers or retail-business purchasers; relevant counterparties, approvers or budget owners where needed | Recruitment, discovery, next-job discussion, agreement of a bounded task, checks, permissions, manual action, follow-up and service-offer discussion. | CD-01, CD-02, CD-03, CD-04; MT-01, MT-02, MT-03, MT-04, MT-05 |
| Manual case log: paper, plain document or an existing basic recording tool | Operator/experiment lead | Record accounts, unknowns, decisions, checks, permissions, actions, outcomes, effort, cost and economic response; review supporting and contrary evidence. No platform is prescribed. | CD-01, CD-02, CD-03, CD-04, CD-05; MT-01, MT-02, MT-03, MT-04, MT-05 |

The current Must-have flow does not prescribe WhatsApp, SMS, a separate field-agent interface or mandatory field visits. None is added here. Existing trader contacts may provide introductions, but the operator must establish whether referred people qualify for the selected discovery group.

## 3. Required interactions and next states — not screens

| Interaction and entry point | Primary actor and other participants | Information exchanged / manual action | Result and next state | Must-have requirements |
| --- | --- | --- | --- | --- |
| Recruit and qualify — operator begins the selected discovery batch | Operator; potential producer or retail-business purchaser | Establish actual role, area, commodity and authority. Record who was reached, who declined and the qualification basis. | Qualified willing participant moves to discovery. Rejection or unconfirmed role is recorded; it does not become customer evidence by assumption. | CD-01 |
| Reconstruct actual behaviour — participant qualifies | Operator; participant | Discuss recent and difficult transactions where available, steps, grade, quantity/unit, timing, terms, decision-makers, workarounds, consequences, recurrence and refusal/switching reasons. Label reports, estimates and unknowns; include successful methods. | A usable case record, including gaps and contrary evidence, is available for review. Continue to the next real job. | CD-02, CD-03 |
| Identify the next job — transaction history discussed | Operator; participant and relevant decision-maker | Record next sale/purchase, requirements, original plan, last actionable moment, stock control, purchase approval and spending authority. | Concrete job and deadline, or explicit absence/unknown. Compare independent cases before selecting any intervention. | CD-04 |
| Review discovery and decide — supporting and contrary cases available | Operator/experiment lead | Record proceed, narrow, pause or reject with evidence references and limits. Assess unresolved problem, upcoming job, deadline, active interest in specific help and feasible responsibilities. | Enter the manual test only if its gate passes. Otherwise continue justified discovery or record a narrow/pause/reject decision. | CD-05 |
| Agree one bounded task — discovery gate passes | Operator; participant | Preserve original plan/fallback and failed step. Agree one task, responsibilities, deadline and evidence that would show the failed step was addressed. | One evaluable test proceeds to task-specific checks. Stop if the required responsibilities exceed capability. | MT-01 |
| Check facts and permissions — a task is agreed | Operator; relevant participant and counterparty only if needed | Check only facts needed for the task; record source and time. For an introduction, compare actual stock/need, authority, grade, units, quantity, location, timing and payment/collection terms, and obtain both permissions. | Confirmed essential facts and permissions allow action. Retain mismatches or unknowns; hold or stop the dependent activity. | MT-02 |
| Perform the manual task — checks pass and deadline remains actionable | Operator; participating person(s) | Use calls/direct communication to perform only the agreed task. Record action, time and actual response, including refusal, no action, missed deadline or abandonment. | Action recorded for follow-up; an introduction is not labelled an order or completed delivery. | MT-03 |
| Follow up and evaluate — task attempted or performed | Operator; participant and relevant counterparty | Ask what happened, note complaints and unresolved issues, and compare with the original plan. Record willingly shared external transaction acceptance, timing and payment status separately where relevant. | Outcome and evidence limits recorded; unknown outcomes remain unknown. Include findings in the final review. | MT-04 |
| Record effort and discuss the offer — effort occurs throughout the test; offer discussion requires clear scope and beneficiary | Operator; actual budget owner if identified | Log time and cash expense, including failed checks and follow-up. Discuss an explicit bounded offer using discovered value, alternatives and measured cost. Distinguish interest, conditional agreement, actual agreed payment and voluntary repeat requests. | Economic response or reason it remains untested is recorded. No collection or payment screen is required. | MT-05 |
| Close the cycle — available discovery/test evidence assembled | Operator/experiment lead | Review outcomes, costs, economic response, refusals, missing information and contrary evidence. Record a source-linked proceed, narrow, pause or reject decision and limits. | Experiment cycle ends with a traceable learning decision. Further discovery follows that decision; software need is not presumed. | CD-05; MT-04, MT-05 where a test occurred |

## 4. Human validation and exception handling

These are process checks, not software validation messages.

| Condition | Required human response | Destination / next state |
| --- | --- | --- |
| Ineligible contact or refusal to participate | Record actual role or refusal and any stated reason; do not invent a reason or count the person as a qualifying case. | Further recruitment if justified, or evidence review. |
| Discovery gate lacks an unresolved problem, upcoming job, deadline, specific active interest or feasible responsibilities | Record the unmet or unknown condition. Do not start Stage B. | Continue relevant discovery, narrow, pause or reject. |
| Essential task fact is missing, conflicting or unverified | Label the gap, seek clarification where possible and record who was asked and when. Hold the dependent action; unaffected discovery may continue. | Resume only if resolved and still timely; otherwise record the blocked/stopped result and review it. |
| Proposed introduction has incompatible terms or either party does not permit it | Preserve the mismatch/refusal; do not share private contacts or make the introduction. Record incurred effort/cost. | Rejection/no-match evidence feeds the review; no forced match or expanded task. |
| Deadline passes, participant abandons the task or required obligations exceed capability | Stop the affected action and record what happened, when, why if known, and any incurred cost. | Outcome/evidence review. |
| Follow-up does not establish an outcome | Keep outcome unknown and preserve follow-up attempts. Do not claim an accepted delivery, payment or benefit. | Final review with explicit evidence limits. |
| Beneficiary or budget owner remains unknown, or the offer is rejected | Record why the commercial test remains unresolved or the actual refusal; preserve any separate operational result. | Final review without a willingness-to-pay claim. |

A missing supporting document is not automatically a failed check: a customer account can remain clearly labelled as reported. No extra screen, upload portal or field visit is required to record that limitation.

## 5. Screen inventory

No screens are specified because no Must-have step depends on a new software interface. Internal recordkeeping remains mandatory; its implementation can be entirely on paper. The HTML version of this document is a readable specification artifact, not an MVP product screen.

Minimum screens required for the Must-have MVP: 0
