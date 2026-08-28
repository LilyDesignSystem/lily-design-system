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

| Channel | State | Notes |
| --- | --- | --- |
| [GitHub Sponsors](https://github.com/sponsors/joelparkerhenderson) | **Live** | Recurring + one-time; surfaced by the Sponsor button via `.github/FUNDING.yml` on all 23 repos |
| Open Collective | **Planned — maintainer action required** | See below; slug `lily-design-system` is free (checked 2026-08-28) |
| Invoiced contract work | Ad hoc | Email <joel@joelparkerhenderson.com>; not sponsorship |

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
