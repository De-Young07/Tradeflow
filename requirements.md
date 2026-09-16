# TradeFlow NG — Manual Discovery MVP Requirements

Date: 16 September 2026

Source: raw-notes.md, “Evidence Review and Producer-to-Bulk-Buyer Discovery,” and the founder discovery-group decision dated 16 September 2026. No additional customer evidence is introduced.

Status: Requirements for an evidence-gathering experiment, followed only if justified by one bounded manual service test. This is not a specification for an app or a validated marketplace. No producer or organizational buyer service is yet established as necessary.

## 1. Problem Statement

Interviewed agricultural traders use established relationships, calls, visits and past sales experience to make buying and selling decisions; one founder-relayed account describes a tomato seller later discounting unsold stock. These accounts do not establish a causal information gap or sufficient willingness to pay for standalone TradeFlow intelligence. An early negative signal around that proposition warrants investigation but does not prove traders will not pay. The new experiment asks whether a narrowly defined producer or organizational produce buyer experiences a repeated, consequential failure in completing an acceptable transaction that existing methods do not adequately resolve. Its cause, timing, economic impact and appropriate intervention are currently unknown; matching, software and a paying side must not be assumed.

## 2. Target Users and Participants

| Role | Current status | Role in this experiment |
| --- | --- | --- |
| Existing agricultural trader contacts, including Rashsidat | Contact access and trading behaviour are reported in the source. They are not confirmed paying intelligence customers. | Context and possible introductions. Their views cannot substitute for actual producer or organizational-buyer accounts. |
| Supply-side participant: an actual tomato producer in the Dikko/Niger discovery area | Hypothesized beneficiary/customer; no specific producer case is established. | Describe recent sales, failures, workarounds, authority to commit stock and upcoming availability. Participation does not imply they should pay. |
| Demand-side participant: the person responsible for bulk tomato purchases for a retail business in the Dikko/Niger discovery area | Hypothesized beneficiary/customer; no specific buyer case is established. | Explain recent procurement, specifications, deadlines, approvals, current suppliers and an upcoming need. Purchasing user, approver and payer may differ. |
| TradeFlow interviewer/operator | Internal experiment role, not customer-demand evidence. | Conduct calls, preserve case records, compare evidence and, if the discovery gate passes, perform one agreed manual task and record its result/cost. |
| Economic payer | Unknown | Identify who benefits, bears an avoidable cost and has authority to approve a charge. Do not assign this role to either side in advance. |

The founder has selected tomatoes, the Dikko/Niger area and organizational retailers for this discovery batch: interview actual tomato producers and people responsible for bulk tomato purchases for retail businesses. Existing trader contacts may provide introductions; they do not automatically qualify as participants. [Founder decision] This selects a discovery group, not confirmed participant access, buyer demand, a validated route or a payer.

## 3. Core Hypothesis Being Tested

A narrow producer or organizational-buyer segment may experience a repeated consequential transaction failure, and one bounded manual intervention may resolve the failed step before its deadline better than the existing method. If it creates sufficient incremental value for a party with spending authority, a sustainable paid service may be possible.

This combines the source's unvalidated H1–H5 into a staged test:

- H1 — Problem: a repeated consequential failure exists and the current workaround is inadequate.
- H2 — Mechanism: a bounded check, introduction or coordination task can address that particular failure in time.
- H3 — Compatibility: where the task involves a producer and buyer, actual supply and authorized demand align on material terms without untested financing or delivery obligations.
- H4 — Payer: an identifiable beneficiary with authority has an economic reason to accept an explicit paid offer.
- H5 — Economics: actual accepted payment could support the measured cost of repeat delivery.

These are questions to test, not promised product functions. Discovery may identify information, procurement, logistics, trust, aggregation, financing, quality, another problem, or no viable TradeFlow intervention. The experiment must allow those outcomes.

### Experiment stages and boundary

Stage A is customer discovery using calls and a simple incident log. The source proposes three actual producers and three actual purchasing decision-makers in one buyer category as an initial batch. That is a proposed practical sample, not a representative survey, mandatory transaction volume or validation threshold.

Stage B is one conditional manual intervention. It starts only when Stage A identifies a real unresolved problem and a participant actively wants help with an upcoming transaction. Select the task from evidence; do not automatically implement verification, matching and coordination together. If the problem requires obligations beyond current capability, stop and reconsider the service.

No software build is required for either stage. A plain document, paper log or an existing basic recording tool can hold the records; no particular platform is prescribed.

## 4. MVP Success Criteria

The experiment succeeds at learning when it yields a traceable proceed, narrow, pause or reject decision. A negative finding is a valid experiment result. Product success, demand and repeatability require additional evidence; finishing interviews does not establish them.

| Check | Evidence needed | Interpretation and next decision |
| --- | --- | --- |
| Discovery records are usable | Actual participant roles, recent transaction details, current workaround, consequences, timing, evidence status and unknowns are recorded, including successful transactions. | Enough to assess specific cases; not proof of broad demand. |
| Problem supports further testing | Independent participants describe similar actual failures, with recurrence grounded in transactions and consequences material to them. | Supports a narrowly scoped continuation. Isolated anecdotes, general complaints or acceptable workarounds weaken the hypothesis. |
| Stage B entry gate passes | A real unresolved failure, an upcoming transaction, an actionable deadline, a bounded task within capability and a participant actively requesting/accepting that specific help are documented. | Proceed with one manual test. If the gate is unsupported, remain in discovery, narrow or pause; do not build a matching product. |
| Intervention can be evaluated | Record the original plan/fallback before assistance, task performed and time, subsequent actions, refusals or abandonment and available outcome evidence. | Determine whether the intended failed step was actually addressed. One introduction is not a completed order; one completed trade does not prove causal benefit. |
| Compatibility holds when relevant | Actual stock and authorized need agree on specification, units, quantity, location, timing and payment/collection expectations. | A necessary condition for a proposed connection, not evidence that all producers/buyers can be matched. Preserve any incompatibility. |
| Economic interest is evidenced | An identified budget owner considers an explicit bounded service offer; record interest, conditional agreement and actual agreed payment separately. | Free participation and praise do not validate willingness to pay. No price or revenue target is supplied by the evidence. |
| Delivery economics and repeatability can be examined | Record team/agent time and cash costs, including failures; compare with actual accepted payment where available and any voluntary repeat transaction request. | If payment or repeat evidence is absent, viability remains unknown. Excessive costs/obligations weaken or reject that service version. |
| Decision accounts for contrary evidence | Review refusals, missing outcomes, working alternatives, incompatibilities and unsuccessful tests alongside successes. | Pause or reject the tested segment/offer where unsupported, without declaring the entire trader or agricultural market invalid. |

No conversion percentage, required margin, price, duration or statistical confidence target is invented. Numerical go/no-go thresholds, if later needed, remain to be set before interpreting results as meeting them. Repeated manual usefulness must precede any argument that software is needed.

## 5. Functional Requirements

Priority: Must means the relevant experiment cannot be performed or measured without the capability. Should improves evidence quality but can be done without a dedicated capability. Could is optional convenience. Won't is excluded from this MVP.

CD requirements are customer-discovery/process requirements, not customer-facing product features. MT requirements are conditional manual-test requirements: they become applicable only after the Stage B gate passes. A conditional Must governs how to test a chosen intervention; it does not require offering a matching or verification service before evidence supports it. All records may be maintained manually.

### 5A. Customer-discovery requirements

| ID | Feature | Description | Priority | Evidence/Rationale |
| --- | --- | --- | --- | --- |
| CD-01 | Define and recruit the discovery group | Recruit within the selected discovery group: tomatoes, Dikko/Niger area, organizational retailers. Interview actual tomato producers and people responsible for bulk tomato purchases for retail businesses; existing trader contacts may provide introductions but do not automatically qualify. Distinguish actual roles and authority, and record who was reached and who declined. [Founder decision] | Must | Source Stage A and H1: without the right participants, trader findings would be incorrectly transferred to the proposed model. No group is already validated. |
| CD-02 | Reconstruct actual transactions | For each participant, record a recent transaction and a difficult one where available: date, role, counterparty, product/grade, quantity/unit, timing, payment terms, steps and decision-makers. Include working/successful methods and absence of a recalled failure. | Must | Source Stage A: the core experiment depends on actual past/current behaviour, not hypothetical interest in matching. |
| CD-03 | Record consequences, alternatives and evidence quality | Record failure point, workaround, recurrence with its stated basis, money/time/delay/rejected produce or other consequence, actual refusal reasons and switching conditions. Distinguish report, estimate, willingly shared supporting record and unknown. Do not demand nonexistent records or replace unknowns with zero. | Must | Source evidence gaps and forcing questions: needed to test pain, frequency and cause without inventing losses or treating every intermediary as waste. |
| CD-04 | Identify next job, deadline and authority | Record the next real sale/purchase, requirements, existing plan, last actionable moment, who controls stock, purchase approval and spending. Identify the possible beneficiary/payer as unknown until evidenced. | Must | Source H2–H4: an intervention cannot be tested without a concrete job and a participant who can act. |
| CD-05 | Review evidence and make a stage decision | Compare independent and contradictory cases; document proceed, narrow, pause or reject with source references and limits. Enter Stage B only with a real unresolved problem, upcoming transaction, active interest in a specific bounded task and feasible responsibilities. | Must | Source gate explicitly prevents matching from being treated as the answer before discovering the failure. |
| CD-06 | Corroborate accounts where available | Request relevant records or observe a process with permission when this helps resolve uncertainty. Record whether corroboration was available; keep an uncorroborated account labelled as reported. | Should | Source permits observation/documents where useful. Their absence must not prevent recording an honest customer account. Evidence labelling is already Must in CD-03. |

### 5B. Conditional manual-test requirements — no app implied

| ID | Feature | Description | Priority | Evidence/Rationale |
| --- | --- | --- | --- | --- |
| MT-01 | Define one task and its baseline | After CD-05 passes, record the participant's original plan/fallback, the failed step, the single task to test, deadline and what would show that step was addressed. Record responsibilities and stop if the required intervention is beyond present capability. | Must | Source Stage B and H2: essential to distinguish an actual test from an open-ended concierge promise. A check or introduction is an option, not an automatic feature. |
| MT-02 | Check task-specific facts and permissions | Gather only facts needed for the selected task. For a proposed introduction, confirm authority, real stock/need, product/grade, units, quantity, location, timing and payment/collection terms; retain mismatches. Obtain both parties' permission before sharing private contacts or introducing them. Record what was checked, with whom and when. | Must | Source Stage B and H3: required if a connection is tested; does not establish matching as the product or authorize a quality guarantee. |
| MT-03 | Perform and log the bounded manual action | Carry out only the agreed task through calls/direct communication before the actionable deadline. Record the action, timing and participant response, including no action, refusal, missed deadline or abandonment. Do not label an introduction as an order or an order as a completed accepted delivery. | Must | Source Stage B: without an actual intervention and behaviour record there is no service feasibility test. |
| MT-04 | Follow up on actual outcomes | Record what happened, unresolved issues and complaints, preserving evidence status. If parties independently transact, record acceptance, timing and payment status where willingly shared. Compare with the prior plan/fallback without assuming all improvement was caused by TradeFlow. | Must | Source Stage B and success criteria: needed to measure the experiment, including adverse/neutral results. Unknown outcomes stay unknown. |
| MT-05 | Measure service effort and economic response | Record operator/agent time and cash expenses, including failed checks and follow-up. Once scope and beneficiary are clear, discuss an explicit service offer with the actual budget owner using discovered value, alternatives and measured cost. Record the offer and distinguish interest, conditional agreement, actual agreed payment and voluntary repeat requests. | Must | Source H4–H5: the commercial hypothesis cannot be assessed without payer evidence and delivery cost. No price, payer, revenue target, billing system or obligation to collect payment is prescribed. |
| MT-06 | Store optional supporting references | Keep references to voluntarily shared specifications, messages or transaction evidence alongside the case when available. No upload portal is required. | Should | Helps examine outcomes and disagreements; the core log can work with clearly labelled customer accounts and notes. |

### 5C. Explicit exclusions

| ID | Feature | Description | Priority | Evidence/Rationale |
| --- | --- | --- | --- | --- |
| EX-01 | App, marketplace and dashboards | No farmer/buyer accounts, listings, public marketplace, dashboards or new automated platform. | Won't | Source says calls and a simple log suffice; no customer software need is established. |
| EX-02 | Automatic matching and decision recommendations | No matching engine or automatic buy/sell, quantity or trade recommendation. | Won't | Matching is an unvalidated mechanism. Any manual introduction is conditional on CD-05 and MT-02. |
| EX-03 | Forecasting and route optimization | No price/demand forecasts, routing model or mandatory reuse of existing TradeFlow technology. | Won't | Source explicitly classifies later model support as a future assumption. |
| EX-04 | Financial and first-party trading operations | No commodity purchases/resale by TradeFlow, lending, escrow, holding funds, payment system, subscription billing or trade execution. | Won't | Source manual test excludes these commitments; neither commercial mechanism nor payer is validated. Recording an external outcome or paid-service response is not a payment product. |
| EX-05 | Logistics and outcome guarantees | No transport booking, delivery operations or guarantees of supply, sale, quality, payment, price or profit. | Won't | Source limits the intervention and requires reconsideration when needed obligations exceed capability. |
| EX-06 | Expansion and data products | No nationwide network rollout, multiple buyer-category platform, historical data licensing or technology-led scaling. | Won't | These are future assumptions, not necessary for the core experiment. |

No Could feature is added merely to fill a category. The source establishes no necessary software feature and no additional convenience feature that warrants this MVP's time.

## 6. User Stories

These describe experiment roles and conditional intentions, not statements that participants have requested a product. Supply-side and demand-side stories remain hypotheses until discovery supports them.

### Discovery stories

- US-01 (CD-01): As a TradeFlow interviewer, I want to identify actual producers and purchasing decision-makers in one defined trading context, so that I test the proposed participants rather than substitute existing trader opinions.
- US-02 (CD-02, CD-03): As a TradeFlow interviewer, I want to reconstruct recent successful and difficult transactions with evidence labels, so that I can distinguish a consequential recurring failure from an assumption.
- US-03 (CD-04): As a TradeFlow interviewer, I want to identify the next real transaction, its deadline and who can approve action and spending, so that any proposed test concerns a decision someone can actually make.
- US-04 (CD-05): As the TradeFlow experiment lead, I want to compare supporting and contrary cases before selecting an intervention, so that I can narrow or stop an unsupported hypothesis.

### Conditional participant and service stories

- US-05 (MT-01, MT-02; hypothesized): As a producer with a documented unresolved problem selling an available batch, I want any proposed assistance to fit my actual lot, deadline and acceptable terms, so that I can assess whether it helps my next sale.
- US-06 (MT-01, MT-02; hypothesized): As the person responsible for an organization's actual produce purchase with a documented unresolved obstacle, I want proposed assistance checked against my specification, timing and approval constraints, so that I can assess whether it helps complete that purchase.
- US-07 (MT-02; conditional): As a participant in a proposed manual introduction, I want to decide whether my private contact information is shared, so that I control my participation in that introduction.
- US-08 (MT-03, MT-04): As the operator running one agreed manual test, I want to record actions and actual outcomes against the original plan, so that I can determine what happened without confusing interest with a completed transaction.
- US-09 (MT-05): As the TradeFlow experiment lead, I want to record all delivery effort and the actual budget owner's response to a defined offer, so that I can assess the payer and cost hypotheses without inventing revenue.

## 7. Out of Scope

- Treating farmer-to-bulk-buyer matching as a validated problem, solution or compulsory intervention.
- Building an app, dashboard, marketplace, farmer/buyer portal or automated platform.
- Forecasting, price/demand prediction, route optimization and mandatory reuse of existing infrastructure or models.
- Subscriptions, billing, payments/escrow, lending and TradeFlow buying, owning or reselling produce.
- Transport booking, logistics operations and delivery/quality/payment guarantees. A manual check is not a quality-assurance guarantee.
- Automatically bundling information, access, procurement, aggregation, financing and logistics into a concierge service.
- Revenue projections, invented prices, transaction-volume targets, losses or willingness-to-pay claims.
- Nationwide expansion, broad agent rollout, data licensing and simultaneous platform support for all buyer categories.
- Proving market-wide demand, product-market fit or causal profit improvement from the small discovery batch or a single test.
- Replacing customers' trusted relationships without demonstrating a specific unmet need.

## 8. Unclear or Missing Information

| Missing information | Why it matters | How to resolve / what it blocks |
| --- | --- | --- |
| Access to actual tomato producers and retail-business bulk-tomato purchasing decision-makers in the Dikko/Niger area | The selected discovery group is a founder decision, not evidence that qualifying participants are available; existing trader contacts do not automatically qualify. | Seek introductions and confirm actual roles and access within the selected group; blocks meaningful Stage A interviews if unavailable. |
| Recent failure, frequency and measurable consequence | We do not know whether a costly recurring problem exists. | Reconstruct incidents including successful alternatives; blocks Stage B gate, not interviews. |
| Underlying mechanism and existing workaround | Matching may not address the failed step. | Trace the process and refusal reasons; blocks selecting the intervention. |
| Next real transaction and exact actionable deadline | An intervention delivered after commitment may be irrelevant. | Confirm with the participant; blocks a timed Stage B test. |
| Stock/need authority, product/grade, units, quantity, location, time and terms | Same crop name is insufficient to establish a feasible connection. | Check with the relevant parties; blocks any proposed introduction if essential facts remain unconfirmed. |
| Permission and acceptable level of involvement | Participants may not want contacts shared or TradeFlow involved. | Obtain explicit permission for the specific activity; refusal stops that activity. |
| Stronger pain, beneficiary, approver and payer | Neither side can be presumed to fund the service. | Compare cases and identify who bears the cost and controls budget; payment hypothesis remains unresolved until tested. |
| Service scope, cost and test price | No amount or sustainable operating model is established. | Measure actual effort/cost and discuss a defined offer once scope is known. A free test cannot settle willingness to pay. |
| Repeatability, follow-up access and outcome evidence | One result may be exceptional or undocumented. | Track voluntary repeat use, unsuccessful cases and missing evidence; blocks scaling claims. |
| Numerical success thresholds, test duration and exact sample adequacy | Source provides qualitative gates and a proposed starting sample, not statistical validation criteria. | Keep results case-based; agree any additional thresholds before using them to declare success. |
| Details behind earlier negative trader-intelligence signal | Evidence does not justify a universal rejection. | Preserve the current limitation; review actual offers/refusals if revisiting that model. Not a reason to presume the new model succeeds. |

Missing information must produce an explicit unknown, a discovery task or a stop at the relevant gate. It must not silently become a default fact or extra feature.

## 9. Assumptions That Must Not Appear as Established Facts

- Traders will not pay, or the standalone-intelligence model has conclusively failed.
- Negative evidence about one trader proposition validates producer/buyer matching.
- Farmers lack buyers, organizations lack suppliers, or either problem is frequent and costly across the proposed segment.
- Matching, information, procurement, trust, logistics, aggregation, quality or finance has already been identified as the main constraint.
- Farmers are the payer, buyers are the payer, or the operational user controls a budget.
- A roster, stated interest or an available contact establishes confirmed stock, demand, authority or readiness to transact.
- Registration, accepting free help, polite praise or an introduction proves an order, payment or product-market fit.
- A completed order means accepted delivery and final payment; each must be recorded separately where evidence is available.
- A discount is a net loss, an estimate is a measured fact, or all improved outcomes are caused by TradeFlow.
- Existing relationships are inefficient or can be replaced on price alone.
- Baskets, quality labels, specifications, locations or buyer categories are automatically comparable.
- Existing agents, data, forecasting or optimization are reliable, defensible or necessary for the experiment.
- Unpaid founder/agent time makes the service nearly free.
- The source's proposed three-plus-three discovery batch is representative or proves recurrence at market scale.
- One successful manual test demonstrates repeatability, sustainable economics or the need for software.

The appropriate output of this MVP may be a supported narrow service hypothesis, a different problem, or a decision to pause. The requirements must support all three without manufacturing a marketplace business.

## 10. Founder Decisions Log

| # | Date | Question | Decision | Applies to |
| --- | --- | --- | --- | --- |
| 1 | 16 September 2026 | Which crop, area and buyer category will the first discovery batch cover? | Tomatoes, Dikko/Niger area, organizational retailers. Interview actual tomato producers and people responsible for bulk tomato purchases for retail businesses. Existing trader contacts may provide introductions; they do not automatically qualify. This is a recruitment choice, not validation of access, need or willingness to pay. | CD-01; Section 2 target participants; Section 8 participant-access dependency |
