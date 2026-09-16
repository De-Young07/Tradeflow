# TradeFlow NG — Product Requirements

Date: 15 September 2026

Status: Proposed pilot requirements derived from the discovery notes. The customer segment, financial impact and willingness to pay remain unvalidated. These requirements define a testable first build; they do not establish product-market fit.

## 1. Problem statement

A tomato seller in Niger State reports calling people who visited a market ahead of her to confirm availability before travelling, then arriving after market conditions have changed. This suggests that information obtained through existing contacts can become outdated between the call and arrival, potentially leaving a trader unable to make an informed decision about whether, when or where to travel. The founder clarified that the selling market becomes saturated, making her tomatoes harder to sell. The resulting financial loss and the trader’s ability to change plans remain unknown. The pilot will focus on selling tomatoes at Dikko Market in Niger State on Saturdays, with information needed by Friday night. TradeFlow NG’s first build will test whether recently verified, time-stamped market information available before departure helps these traders make better-informed trip decisions than their current phone-based process; it will not promise profit increases or predict conditions on arrival.

## 2. Target user

### Primary user — provisional

A tomato seller who travels to Dikko Market in Niger State on Saturdays, calls earlier market visitors to check conditions, and needs information by Friday night to decide about the trip. The concrete discovery lead is one woman selling tomatoes in Niger State who reports that saturation at the selling market makes her tomatoes harder to sell. Her origin and route, trading volume, journey duration, exact Friday-night decision time and decision flexibility must still be confirmed. Saturday is the travel day, not a specified journey duration.

Pilot recruitment should focus on traders sharing that confirmed role and route who can realistically change at least one decision: destination, departure time, quantity or whether to travel. Start with tomatoes at Dikko Market; the traders’ origin and route remain to be confirmed. This is a proposed scope choice, not an observed customer preference.

The Apata interviews establish related sourcing routines among pepper, rice, crayfish and yam traders. They do not establish that all agricultural traders in Ibadan share this problem. Traders who cannot change their sourcing or selling decisions are not the initial target for this pilot.

### Supporting user

A designated pilot operator who collects reports from identifiable market contacts, checks them, publishes updates and records trader outcomes. This operational role is proposed for the pilot; the notes do not establish an existing reliable agent network.

### Decisions to resolve before a live pilot

- Reconstruct one recent selling trip to establish what changed and the actual loss, if any; saturation means tomatoes become harder to sell at the selling market.
- Confirm the origin and route, journey duration and exact Friday-night decision time for Saturday travel to Dikko Market.
- Confirm whether an identified firsthand source can provide a current Dikko Market observation on Friday night within the existing two-hour freshness limit. Friday-night information must not be presented as a prediction of Saturday conditions.
- Validate the proposed price units and quality labels below with Dikko traders; local container weights and grade names have not been verified.

### Proposed price units and tomato quality labels

Recommendation for this pilot, pending local confirmation:

- Record the actual quote in naira per basket or crate, identifying the container and its measured net tomato weight in kilograms (excluding the container). Use naira per kilogram as the comparison basis only when that weight is known; divide the quoted price by the measured net weight. Do not assume all baskets or crates hold the same weight. If weight is unknown, keep the original quote and mark it unsuitable for per-kilogram comparison.
- Use two simple proposed quality labels: “Firm/intact” for firm tomatoes without visible damage or decay, and “Ripe/intact” for ripe, less-firm tomatoes without visible damage or decay. Record mixed or unknown quality explicitly rather than assigning a grade. Record visibly damaged or decaying stock separately; do not mix it into intact-stock comparisons.
- Record ripeness (green/turning/red/mixed/unknown) and size (small/medium/large/mixed/unknown) alongside the quality label. Compare like-for-like lots; local size meanings must be agreed before comparing quotes. These are descriptive pilot labels, not official grades or verified Dikko terminology.

Basis: Nigerian tomato value-chain research describes basket-based pricing and challenges in standardizing weights; FAO guidance discusses quality, ripeness and removal of damaged or decaying tomatoes. The proposed convention is our adaptation, not a claim about current Dikko practice. Sources: [Nigerian tomato value-chain study](https://www.mdpi.com/2071-1050/11/1/247) and [FAO tomato handling guidance](https://www.fao.org/4/t0073e/t0073e08.htm).

## 3. Functional requirements

Priority meanings: Must = required for the proposed pilot; Should = valuable after the core workflow works; Could = optional experiment; Won’t = excluded from this build. Priorities are proposed product decisions, not customer-validated commitments.

| ID | Feature | Description | Priority |
| --- | --- | --- | --- |
| FR-01 | Trader and trip context | Let the operator record a trader identifier, selling intent, tomatoes as the commodity, origin, Dikko Market in Niger State as the pilot destination, planned Saturday departure and a Friday-night decision deadline. Record the exact deadline when agreed, available alternatives and preferred contact channel. Saturday specifies the travel day; journey duration remains unknown until confirmed. Unknown values must remain explicitly unknown; an actionable trip brief requires confirmed intent and destination. [Founder decision] | Must |
| FR-02 | Market observation capture | Let the operator record market, commodity, availability, observation time, submission time and source identity. When prices are available, record currency, unit, grade or quality and whether the quote is a buying or selling price. For the Dikko tomato pilot, use the proposed price and quality convention above, pending local confirmation: preserve naira-per-container quotes, record measured net kilograms when known, and compare per-kilogram prices only with known weights and comparable quality, ripeness and size. Allow missing fields to be marked unknown rather than filled with estimates. [Proposed convention] | Must |
| FR-03 | Report verification | Keep reports pending until the operator contacts one identified firsthand source currently at the market, confirms what they observed and when, and records the verification method, verification time and supporting source or evidence reference. One such source is sufficient to verify a report; conflicting reports must remain disputed until resolved. Only reports checked through this process may be described as verified. Allow reports to be disputed, corrected or withdrawn. [Founder decision] | Must |
| FR-04 | Freshness and uncertainty | Display when conditions were observed, when they were checked and their age. Use a configurable freshness limit with a default of two hours: mark a report stale when more than two hours have elapsed since the actual observation, not since submission or verification. The limit is a provisional pilot setting, not evidence that conditions remain reliable for two hours. Clearly identify stale, missing or conflicting information; never describe it as current or imply that it predicts conditions on arrival. [Founder decision] | Must |
| FR-05 | Pre-departure market brief | Produce a short brief for selling tomatoes at Dikko Market on Saturday, delivered by the trader’s Friday-night decision deadline, showing available conditions verified through the one-firsthand-source process in FR-03 and within the configurable freshness limit in FR-04 (default: two hours since observation), together with observation time, source attribution, known limitations and a way to request confirmation. Do not present disputed, withdrawn or stale reports as current verified conditions. If usable data is unavailable on Friday night, state that clearly; do not extend the two-hour limit or imply that Friday observations predict Saturday selling conditions. Do not generate unsupported buy, sell or travel instructions. [Founder decision] | Must |
| FR-06 | Assisted delivery and receipt log | Let the operator primarily relay the brief by phone call. SMS and WhatsApp are voluntary alternatives or supplements only when the trader chooses them; neither is required. Record the brief version, delivery time, channel and whether receipt was confirmed. Manual delivery is sufficient; automated messaging integrations are not required. [Founder decision] | Must |
| FR-07 | Clarification and correction | Let a trader request a recheck or report a mismatch through the pilot operator. Link the request to the affected report, record its resolution and identify recipients who need a correction. Withdrawn or disputed data must no longer appear as a current verified report. | Must |
| FR-08 | Decision and outcome record | Record the original trip plan and information source, the brief received, whether and why the trader changed the plan, and the actual outcome. Capture reported quantities, prices and relevant costs when available, with evidence status. Record refusals and unchanged decisions as valid outcomes; distinguish reported benefit from demonstrated savings. | Must |
| FR-09 | Controlled editing and traceability | Restrict report verification and editing to designated operators. Preserve previous report versions and the version delivered to each trader. Trader-facing briefs must not expose other traders’ records or private source contact details; use an agreed source label for attribution. | Must |
| FR-10 | Pilot review summary | Summarize briefs delivered before decision deadlines, data freshness, corrections, decisions changed and known outcomes. Show denominators and missing outcome data. Treat recommendation uptake and report submission rates as process measures, not proof of profit improvement. | Should |
| FR-11 | Comparable market view | Deferred for the Dikko-only pilot. If a future confirmed route includes a feasible alternative market, show available reports side by side with timestamps and comparable units and grades. Display trader-supplied transport estimates separately. Flag non-comparable or missing information; do not rank a “most profitable” market from incomplete data. | Should |
| FR-12 | Change notification | Allow an operator to notify an affected trader when a material verified change or correction occurs before the recorded decision deadline. Record the updated brief and delivery. What constitutes a material change must be agreed for the pilot. | Could |
| FR-13 | Forecasting and saturation prediction | Do not predict future prices, market saturation, demand or conditions at arrival in this build. The discovery notes do not establish the required mechanism or data. | Won’t |
| FR-14 | Trade execution and financial services | Do not place orders, buy or resell commodities, arrange payments, lend money or execute arbitrage for traders. | Won’t |

## 4. User stories

- US-01 (FR-01): As a tomato seller travelling to Dikko Market on Saturday, I want to record my trip and Friday-night decision deadline, so that the information I receive relates to a decision I can still change.
- US-02 (FR-02): As a pilot operator, I want to record Dikko tomato quotes with their source, time, container, known net weight and described quality, so that reports can be checked and comparable prices interpreted correctly.
- US-03 (FR-03): As a pilot operator, I want to distinguish checked reports from pending or disputed reports, so that traders are not given unverified information as fact.
- US-04 (FR-04): As a travelling tomato trader, I want to know how old an update is and what remains uncertain, so that I can decide whether to seek confirmation before travelling.
- US-05 (FR-05): As a tomato seller travelling to Dikko Market on Saturday, I want a current market brief by Friday night, so that I can assess my trip before my decision deadline.
- US-06 (FR-06): As a tomato seller, I want to receive the brief primarily by phone call, with SMS or WhatsApp only if I choose, so that I can access it before my Friday-night decision deadline.
- US-07 (FR-07): As a travelling tomato trader, I want to question an update or report conditions that differ on arrival, so that incorrect information can be checked and corrected.
- US-08 (FR-08): As a pilot operator, I want to record the trader’s original plan, actual decision and outcome, so that we can test whether the brief provided useful information beyond existing calls.
- US-09 (FR-09): As a pilot operator, I want a history of report changes and delivered versions, so that I can identify what information a trader actually received.
- US-10 (FR-10): As a pilot owner, I want a summary that separates delivery, behaviour and financial outcomes, so that I do not mistake trial participation for demonstrated customer value.
- US-11 (FR-11): As a travelling tomato trader in a future pilot with an alternative market I can realistically reach, I want comparable conditions and separate transport estimates, so that I can assess the trade-off between destinations.
- US-12 (FR-12): As a travelling tomato trader, I want to hear about a material change before my decision deadline, so that I can reconsider my plan while it is still actionable.

## 5. Out of scope for this build

- Future price forecasts, automated saturation predictions or guaranteed conditions on arrival.
- Guaranteed profit, guaranteed availability or unverified claims of savings and avoided losses.
- Automated buy/sell recommendations, autonomous decisions or “optimal” trade-route selection.
- Commodity ordering, payments, escrow, brokerage, resale and arbitrage execution.
- Loans, fundraising, credit products or other financial services.
- Transport booking, dispatch, fleet tracking or delivery operations.
- Inventory management, accounting and a full trader business-management suite.
- Coverage beyond Dikko Market, multiple commodity categories or a broad agent-network rollout. Alternative-market comparison in FR-11 remains deferred for this single-market build.
- A requirement for traders to install a native app, create a self-service account or use a particular messaging platform.
- Automated multi-channel messaging integrations; the pilot uses manual phone calls as its primary channel, with voluntary manual SMS or WhatsApp.
- Subscription billing and adoption of the canvas revenue, cost, CAC or conversion targets as validated operating requirements. Pricing and willingness to pay remain discovery work.

- Mandatory two-source corroboration or a designated field worker’s direct observation for every report; the selected verification process requires one identified firsthand source checked by the operator.
- Same-day-only expiry or a mandatory recheck within 30 minutes of every trip deadline; this build uses the configurable observation-age limit instead.

## 6. Pilot acceptance and learning criteria

### Functional acceptance

- An operator can complete the capture, verification, brief delivery and outcome-recording workflow for a confirmed pilot trip.
- Every delivered brief retains its market, observation time, verification status, source attribution and delivered version.
- Missing, stale, disputed and conflicting data are visibly distinguishable from current verified observations.
- A corrected report retains its history and makes affected recipients identifiable for follow-up.
- The outcome record permits “no change,” “refused,” “unknown” and “no financial evidence”; it does not force a positive result.

### Evidence required to judge customer value

Before launching, agree the cohort size, observation period and success thresholds using the reconstructed transaction. Those values are currently TBD. The configurable two-hour freshness limit is a founder decision to validate during the pilot. Assess whether updates arrive while decisions remain actionable, whether traders make useful changes compared with their original plans, and whether outcomes and delivery costs support continuing the service. Record adverse and neutral outcomes as well as positive ones. Any estimated avoided loss must identify its assumptions and must not be reported as a directly observed saving.

## 7. Founder Decisions Log

| # | Question | Decision | Applies to |
| --- | --- | --- | --- |
| 1 | What checking makes a market report “verified”? | 15 September 2026 — Option A: The operator contacts one identified firsthand source currently at the market, confirms what they observed and when, and records the check. Conflicting reports remain disputed. | FR-03, FR-05 |
| 2 | When should a market report become “stale”? | 15 September 2026 — Option A: Use a configurable age limit, defaulting to two hours after actual observation. Reports older than the limit are stale. Validate this provisional setting during the pilot. | FR-04, FR-05 |
| 3 | What did “saturated” mean? | 15 September 2026 — The selling market becomes saturated, making the woman’s tomatoes harder to sell. No amount of financial loss has been established. | Problem statement, target user, FR-01, FR-05 |
| 4 | Where and when will the pilot run, and when is information needed? | 15 September 2026 — Dikko Market, Niger State; Saturday travel with a Friday-night decision deadline. Journey duration and the exact deadline time remain unspecified. The two-hour observation-age rule is unchanged. | Target user, FR-01, FR-05, US-01, US-05, FR-11 deferred, out of scope |
| 5 | How will traders receive the brief? | 15 September 2026 — Primarily phone calls; SMS and WhatsApp are voluntary. Delivery remains manual. | FR-06, US-06, out of scope |
| 6 | What price units and tomato grades should be used? | 15 September 2026 — Founder requested a suggestion. Proposed, not yet founder-approved: retain naira-per-container quotes with measured net weight where known; compare in naira/kg only with known weight. Use Firm/intact and Ripe/intact labels, with ripeness and size recorded separately; mixed, unknown or damaged stock stays distinct. Validate with Dikko traders. | Proposed price convention, FR-02, US-02, open questions |

Source: Supplied TradeFlow NG office-hours raw notes and founder clarifications dated 15 September 2026. Price-unit and quality suggestions draw on the sources linked above; no additional customer interviews, Dikko field verification or competitive verification were performed.
