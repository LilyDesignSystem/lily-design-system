# Free open source funding

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** How money can reach the project, on what terms, and through
which channels. Lily is free, has no paid tier, and sells nothing;
funding exists to buy maintainer time and independent verification (an
accessibility audit above all), never influence. Channels: GitHub
Sponsors (live) and Open Collective (planned — blocked on an account
step only the maintainer can perform).

## Scope

This topic covers the funding channels, the terms that govern them, the
files that must stay in agreement about them (`.github/FUNDING.yml`,
[CONTRIBUTING.md](../../CONTRIBUTING.md), [NEWS.md](../../NEWS.md)),
and the transparency posture. It does **not** cover what sponsorship
buys in scope terms (that lives in CONTRIBUTING.md's money section and
is summarised here), pricing of contract work (none is published), or
the promotion plan ([help/outreach](../../help/outreach/index.md)).

## Principles and rules

- **Money buys time and verification, not influence.** The contracts in
  `spec/` and `AGENTS/` are argued on merit; a sponsor's bug does not
  jump the queue; features to a deadline are contract work, not
  sponsorship. This is stated identically in CONTRIBUTING.md and must
  stay in agreement with it.
- **The named first purchase is an independent accessibility audit.**
  Lily targets WCAG 2.2 AAA and has never been audited; the highest-
  value thing money can add is finding out what is actually true.
- **Transparency matches the structure.** Today there is no legal
  entity and no treasury: GitHub Sponsors pays an individual, taxed as
  his income, and the docs say so plainly. Open Collective, when it
  exists, adds the opposite posture for those who want it: a public
  ledger under a fiscal host, organisation-friendly invoicing, and
  spending visible to everyone. Both channels can honestly coexist
  because each states what it is.
- **Every funding mention agrees.** FUNDING.yml, CONTRIBUTING.md,
  NEWS.md, and this topic name the same channels in the same states. A
  channel that is planned is labelled planned — never listed as live
  before it exists, because a broken sponsor link converts goodwill
  into distrust exactly once.

## Channels

| Channel                                                            | State                                    | Notes                                                                                          |
| ------------------------------------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [GitHub Sponsors](https://github.com/sponsors/joelparkerhenderson) | **Live**                                 | Recurring + one-time; surfaced by the Sponsor button via `.github/FUNDING.yml` on all 23 repos |
| Open Collective                                                    | **Planned — maintainer action required** | See below; slug `lily-design-system` is free (checked 2026-08-28)                              |
| Invoiced contract work                                             | Ad hoc                                   | Email <joel@joelparkerhenderson.com>; not sponsorship                                          |

### Setting up Open Collective (the blocked step)

Only the account holder can do this; the mechanical steps, so it is a
ten-minute task rather than a research project:

1. Create the collective at opencollective.com — slug
   `lily-design-system` (free as of 2026-08-28).
2. Apply to the **Open Source Collective** fiscal host (the standard
   host for OSS; handles money, taxes, and payouts for a cut). Their
   acceptance criteria favour projects with public activity — link the
   GitHub org, the npm packages, and the site.
3. On acceptance: uncomment the `open_collective:` line in
   `.github/FUNDING.yml`, flip this table's state to Live, and update
   CONTRIBUTING.md's transparency paragraph and NEWS.md in the same
   commit (the acceptance criteria below hold that edit together).

## Grants and public programmes (checked 2026-10-29)

These are the grant routes for the audit (plan P16-T8,
[competitive-position](../competitive-position/index.md) item 8). The
draft and its sources are in
[docs/funding/ngi-zero-commons-application.md](../../docs/funding/ngi-zero-commons-application.md).
**No application has been submitted.**

### NLnet

| Programme                             | State on 2026-10-29                                                                                                                                                                  | Fit for an accessibility audit                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| NGI Zero Commons Fund                 | **Closed.** Its final call closed on 2026-06-01                                                                                                                                      | none: the fund has ended                                                                                                                       |
| NGI Zero Review (support services)    | **Ended 2026-07-31.** Support services are "still available to NLnet grantees". The HAN University WCAG audit is still listed; security audits are marked as having reached capacity | only to grantees; whether new grantees can still get the audit is not stated                                                                   |
| Restack (Horizon Europe 101299072)    | **Open.** Deadline 2026-11-03 12:00 CET; €5,000 to €50,000 for a first grant                                                                                                         | weak: its scope is the internet stack. It lists usability and inclusive design among eligible activities, and "accessibility scans" as support |
| CodeSupply (Horizon Europe 101298846) | **Open**, with the same deadline and amounts                                                                                                                                         | none: its scope is software metadata                                                                                                           |

From now on, deadlines fall on the third day of each odd month. Two rules
affect Lily directly:

- **The European dimension.** At least 60% of the funds normally go to
  people from Horizon Europe eligible countries. The United Kingdom is
  eligible.
- **[GenAI policy 2.0](https://nlnet.nl/foundation/policies/generativeAI/2.0/)
  (2026-10-20).** Proposals may not be written with generative AI, and
  during funded work it may only be used read-only. Any significant amount
  of AI-generated code already in the codebase must be disclosed. Lily's
  [AI_STATEMENT.md](../../AI_STATEMENT.md) records ai-generated
  implementations, so any proposal must disclose that. The maintainer must
  write the proposal himself, and people must write the funded fixes.

The 2025 post saying accessibility audits were withdrawn from NGI Zero
Review was not found on nlnet.nl. A secondary search result mentioned an
NGI Zero post saying security and accessibility audits are no longer
available, but the post itself could not be read. Ask NLnet before relying
on the HAN audit either way.

### Sovereign Tech Agency

| Programme                 | State on 2026-10-29                                                                                                                                        | Fit                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Sovereign Tech Fund       | Applications through its portal; no deadline stated. The minimum is €50,000; open digital base technologies; user-facing applications excluded "currently" | doubtful: a UI component library is not an obvious "base technology"; the minimum exceeds a Tier 1 audit |
| Sovereign Tech Resilience | Applications reviewed on a rolling basis; security services only (audits, fuzzing, bug bounty)                                                             | none for accessibility; possible later for supply-chain review                                           |
| Sovereign Tech Fellowship | **Closed.** The application period ended 2026-04-06                                                                                                        | none this round                                                                                          |
| Sovereign Tech Standards  | Pilot; applications were taken in May 2026                                                                                                                 | none                                                                                                     |
| Sovereign Tech Challenge  | **Closed** since 2023-07-06                                                                                                                                | none                                                                                                     |

Sources, all accessed 2026-10-29:

- NLnet: <https://nlnet.nl/commonsfund/>, <https://nlnet.nl/propose/>,
  <https://nlnet.nl/restack/>, <https://nlnet.nl/restack/eligibility/>,
  <https://nlnet.nl/codesupply/>, <https://nlnet.nl/NGI0/review/>,
  <https://nlnet.nl/NGI0/services/>, <https://nlnet.nl/OIS/european-dimension/>,
  <https://nlnet.nl/news/2026/20260612-NGIZero-stocktaking.html>,
  <https://nlnet.nl/news/2026/20260803-phaseshift.html>,
  <https://nlnet.nl/news/2026/20260903-call.html>
- Sovereign Tech Agency: <https://www.sovereign.tech/programs>,
  <https://www.sovereign.tech/programs/fund>,
  <https://www.sovereign.tech/programs/resilience>,
  <https://www.sovereign.tech/programs/fellowship>

| Application | Submitted | Outcome |
| ----------- | --------- | ------- |
| none yet    | -         | -       |

## The files that must agree

- [`.github/FUNDING.yml`](../../.github/FUNDING.yml) — `github:` live;
  `open_collective:` present but commented until the collective exists.
- [CONTRIBUTING.md](../../CONTRIBUTING.md) § Contribute money — the
  terms (what it buys, what it does not), both channels with honest
  states, the transparency paragraph.
- [NEWS.md](../../NEWS.md) — the status table's funding row.
- This topic — the channel table above.

## Acceptance criteria

- [x] GitHub Sponsors live and linked from FUNDING.yml (Sponsor button
      renders on the repos).
- [ ] Open Collective created and accepted by a fiscal host
      (maintainer-only step; instructions above).
- [x] `.github/FUNDING.yml` lists every live channel and no dead ones;
      the planned channel is present only as a comment.
- [x] CONTRIBUTING.md's money section names both channels with their
      true states and keeps the buys-no-influence terms.
- [x] NEWS.md's status table carries a funding row that matches.
- [ ] On Open Collective going live: FUNDING.yml uncommented,
      CONTRIBUTING.md transparency paragraph updated (public ledger
      exists from that day), NEWS.md updated — one commit.

## Related topics

- [promote → help/outreach](../../help/outreach/index.md) — funding is
  deliberately downstream of credibility, not a channel of it.
- [special-files-for-public-repos](../special-files-for-public-repos/index.md) —
  CONTRIBUTING.md and NEWS.md are synced files; funding edits propagate
  via `bin/sync-special-files`.

## Sources

- [.github/FUNDING.yml](../../.github/FUNDING.yml)
- [CONTRIBUTING.md](../../CONTRIBUTING.md) § Contribute money
- [NEWS.md](../../NEWS.md)
- [MAINTAINERS.md](../../MAINTAINERS.md) — the no-entity, no-treasury structure the transparency posture reflects

---

Lily™ and Lily Design System™ are trademarks.
