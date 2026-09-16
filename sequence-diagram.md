# TradeFlow NG - Must-have MVP Sequence Diagrams

Date: 16 September 2026

Sources: requirements.md and user-flow.md. Coverage: CD-01 through CD-05 and conditional MT-01 through MT-05 only.

## Reading the diagrams

- Communication arrows represent phone calls or direct human communication. Arrows to the Manual Case Log represent the operator writing notes in paper, a plain document or an existing basic recording tool; the log is not an automated system or database.
- Participant means an actual tomato producer or the person responsible for bulk tomato purchases for a retail business in Dikko/Niger. Discovery includes both groups. Neither is assumed to be a validated customer or payer.
- The operator also performs the experiment-lead role. A counterparty appears only when relevant to a selected introduction; a budget owner appears only when identified and may be the participant or another person.
- Stage B is conditional on discovery evidence and active interest in one feasible bounded task. Manual compatibility checking and introductions are alternatives to other bounded tasks, not compulsory matching functionality.
- There is no required app, separate field agent, internal software system or database. No payment processing, logistics operation or automated recommendation is depicted. Recording terms, external payment status and response to a service offer is required evidence collection, not a payment service.

## 1. Main flow

Corresponds to user-flow.md Steps 1-13. The main path shows the discovery gate passing and one manual task being performed and evaluated. The intervention is successful only if the recorded evidence shows the agreed failed step was addressed. The experiment can still complete with uncertain economics or a decision to narrow, pause or reject.

```mermaid
sequenceDiagram
    autonumber
    actor P as Participant (tomato producer or retail bulk buyer)
    actor O as TradeFlow Operator / Experiment Lead
    actor C as Counterparty (only for an introduction)
    actor B as Actual Budget Owner (if identified)
    participant L as Manual Case Log

    Note over P,L: Stage A - operator starts discovery in Dikko/Niger<br/>Phone calls or direct conversations, no app
    O->>O: Begin recruiting actual producers and retail-business tomato purchasers
    loop Independent participants from both selected groups
        O->>P: Contact and establish actual role and authority (CD-01)
        P-->>O: Explain role and agree to conversation
        O->>L: Record contact outcome and qualification
        O->>P: Reconstruct recent transaction and difficult one if available (CD-02)
        P-->>O: Date, parties, grade, quantity/unit, timing, terms, steps and decision-makers
        O->>P: Ask about workaround, recurrence, consequences and refusal reasons (CD-03)
        P-->>O: Actual experience, successful methods and any unknowns
        O->>P: Ask about next job, existing plan, deadline and authority (CD-04)
        P-->>O: Upcoming sale/purchase, requirements and who can act or approve spending
        O->>L: Record accounts, estimates, available evidence and unknowns distinctly
    end
    O->>O: Compare independent and contradictory cases (CD-05)
    O->>P: Discuss specific bounded help for an unresolved upcoming job
    P-->>O: Actively accept that specific help
    O->>O: Confirm unresolved problem, upcoming job, deadline and feasible responsibilities
    O->>L: Record gate passed, sources and limits (CD-05)

    Note over P,L: Stage B applies only after the gate passes<br/>This is one selected task, not a bundle of services
    O->>P: Agree baseline, failed step, one task, deadline and evidence of success (MT-01)
    P-->>O: Original plan/fallback and agreed responsibilities
    O->>L: Record bounded task and baseline; start tracking time and cash costs
    alt Selected task is a manual introduction
        O->>P: Confirm authority, actual stock/need and material terms (MT-02)
        P-->>O: Grade, units, quantity, location, timing, payment/collection terms
        O->>C: Confirm complementary stock/need, authority and same material terms
        C-->>O: Actual facts and acceptable terms
        O->>O: Check compatibility manually
        O->>P: Request permission for introduction and private contact sharing
        P-->>O: Give specific permission
        O->>C: Request permission for introduction and private contact sharing
        C-->>O: Give specific permission
        O->>L: Record confirmed facts, compatibility, permissions, who and when
        O->>P: Make agreed introduction before deadline (MT-03)
        O->>C: Make agreed introduction before deadline
    else Another bounded manual task was selected
        O->>P: Check only needed task facts and permissions (MT-02)
        P-->>O: Confirm relevant facts and permitted involvement
        O->>L: Record checks, sources, times and permissions
        O->>P: Perform agreed task through direct communication before deadline (MT-03)
    end
    P-->>O: Actual response to the action
    O->>L: Record action, time and response without claiming a completed trade
    O->>P: Follow up on actual outcome and unresolved issues (MT-04)
    P-->>O: Available outcome, complaints and evidence status
    opt Relevant counterparty was involved
        O->>C: Follow up on actual outcome
        C-->>O: Willingly shared outcome or unknowns
    end
    Note over O,L: If parties independently transact, record willingly shared acceptance,<br/>timing and payment status separately; TradeFlow does not execute the trade
    O->>O: Compare outcome with baseline without assuming causal benefit
    O->>L: Record outcome, limits and all time/cash costs including follow-up (MT-04, MT-05)
    alt Scope, beneficiary and actual budget owner are established
        O->>B: Discuss explicit bounded service offer using value, alternatives and measured cost
        B-->>O: Actual response and any voluntary repeat request
        O->>L: Separate interest, conditional agreement and actual agreed payment (MT-05)
    else Commercial prerequisites remain unknown
        O->>L: Record why offer cannot yet be tested; payer and viability remain unresolved
    end
    O->>O: Review supporting and contrary evidence, outcome, cost and economic response
    O->>L: Record proceed, narrow, pause or reject with sources and limits (CD-05)
    Note over O,L: Experiment cycle complete with a traceable learning decision<br/>An introduction or praise alone does not establish service success
```

## 2. No-match / rejection flow

Corresponds to R1-R3. No-match applies only to a proposed introduction after the gate passes. Refusal during recruitment or task selection stops that activity without requiring a search for a replacement. If a budget owner rejects the later service offer, MT-05 records that rejection separately from any operational outcome, and the operator includes it in the final evidence review; no collection is required.

```mermaid
sequenceDiagram
    autonumber
    actor P as Participant (tomato producer or retail bulk buyer)
    actor O as TradeFlow Operator / Experiment Lead
    actor C as Counterparty (only for an introduction)
    participant L as Manual Case Log

    Note over P,L: Entry from recruitment, stage review or a conditional manual test
    alt Contact or participant rejects participation or specific help
        O->>P: Contact or discuss a specific bounded task
        P-->>O: Decline, with reason if willingly provided
        O->>L: Record refusal and stated reason; do not invent a reason (CD-01, CD-03)
    else Proposed introduction after Stage B gate passes
        O->>P: Check actual stock/need, authority, terms and permission
        P-->>O: Facts, acceptable terms and permission decision
        O->>C: Check counterpart facts, terms and permission
        C-->>O: Incompatible terms or refusal of introduction/contact sharing
        O->>O: Identify mismatch or missing permission (MT-02)
        O->>L: Retain checked facts, mismatch/refusal, sources and times
    end
    O->>O: Stop the declined or incompatible activity
    Note over O,C: No introduction without both permissions and essential confirmed compatibility<br/>No forced match, fulfillment promise or expanded task
    O->>L: Record action status and any incurred time/cash costs (MT-03, MT-05 if applicable)
    opt A manual action already occurred
        O->>P: Follow up on available outcome and unresolved issues (MT-04)
        P-->>O: Available account or unknown outcome
        O->>L: Preserve outcome separately from rejection
    end
    O->>O: Review negative case alongside other evidence (CD-05)
    alt Further discovery is justified
        O->>L: Record decision, limits and return to discovery
    else End this experiment cycle
        O->>L: Record narrow, pause or reject with sources and remaining unknowns
    end
    Note over O,L: A documented negative result is valid learning, not a successful match
```

## 3. Invalid / unverified information flow

Corresponds to I1-I3. Hold the dependent action when an essential fact cannot be established; unaffected discovery may continue. Missing optional supporting documents or a field observation does not invalidate a clearly labelled reported account.

```mermaid
sequenceDiagram
    autonumber
    actor P as Relevant Participant / Person Able to Confirm
    actor O as TradeFlow Operator / Experiment Lead
    participant L as Manual Case Log

    Note over P,L: Entry when a required fact is incomplete, conflicting or unverified<br/>Applies to discovery, task checks or outcome follow-up
    O->>P: Ask for the fact needed at the current step
    P-->>O: Incomplete, conflicting or unconfirmed account
    O->>L: Record gap, source, evidence status and affected step (CD-03, MT-02 or MT-04)
    O->>O: Hold only the decision or action depending on the essential unknown
    O->>P: Seek clarification by call/direct conversation where possible
    P-->>O: Clarification, inability to confirm or no response
    O->>L: Record what was checked, with whom and when
    alt Essential facts resolved and action still timely
        O->>O: Recheck applicable gate, task facts and permissions
        O->>L: Record resolution and resume affected main-flow step
    else Required facts remain unknown or deadline has passed
        alt Gap prevents Stage B entry or safe performance of the agreed task
            O->>O: Do not enter Stage B or perform the dependent action
            Note over O,L: No introduction without essential facts and both permissions
        else Gap concerns an outcome after an action
            O->>L: Keep outcome unknown; do not claim benefit or completed trade
        end
        O->>L: Record remaining unknowns, any missed deadline, actions and incurred costs
        O->>O: Review evidence and decide next step (CD-05)
        alt More discovery is justified
            O->>L: Record further discovery need and return to unaffected discovery
        else End this experiment cycle
            O->>L: Record narrow, pause or reject with sources and limitations
        end
    end
    Note over P,L: A reported account may remain reported without supporting documents<br/>Never replace unknowns with zero or founder guesses
```

## Completion definition

MVP completed successfully when: TradeFlow records a traceable proceed, narrow, pause or reject decision from actual discovery evidence and, if the gate passes, one bounded manual test with its actions, available outcomes, effort, economic response and remaining unknowns recorded.
