<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/GOVERNANCE.md -->

# Governance

How decisions get made in Lily Design System™, who makes them, and how that
changes.

This document describes the project as it actually operates. Where the honest
description is "one person decides", it says so. A governance document that
describes a committee that does not meet is worse than none, because it invites a
reviewer to rely on a control that is not there.

## Current structure: benevolent dictator, one maintainer

Lily has a single maintainer ([MAINTAINERS.md](MAINTAINERS.md)) who holds final say
on every decision: what gets built, what gets merged, what gets released, and what
the project refuses to do. There is no steering committee, no design council, no
foundation, and no vote.

This is the standard structure for a project of this age and size, and it has the
standard trade-off: decisions are fast and coherent, and the project's resilience is
one person's. The second half of that sentence is treated as a finding rather than a
footnote; see
[MAINTAINERS.md § If the maintainer is unavailable](MAINTAINERS.md#if-the-maintainer-is-unavailable).

## The specification is the authority, not the maintainer

The one place the maintainer explicitly does *not* have final say is conformance to
the project's own written contracts. [spec/](spec/index.md) and the rules in
[AGENTS/](AGENTS/) are the oracle: the canonical element, ARIA, keyboard contract
and props for each component are fixed in `components/{slug}/AGENTS.md`, and an
implementation that disagrees with that file is wrong — not a matter of taste, and
not the maintainer's call.

Above those sit two external authorities the project does not get to overrule: the
**WAI-ARIA Authoring Practices** for interaction patterns, and **WCAG** for
accessibility outcomes. Where the APG documents a pattern, Lily follows it. Where
those sources are silent, the decision is the project's own and must be labelled as
such wherever it is written down.

If you believe an implementation contradicts the specification or the APG, cite the
section and open an issue. Those are the reports this project most wants.

## Where decisions are recorded

There is no separate architecture-decision-record layer, deliberately: an ADR that
outlives the code it justified becomes a false authority. Decisions live in the
places that cannot drift out of sync with the tree.

| Kind of decision | Where it lives |
| --- | --- |
| What a component *is* — element, ARIA, keyboard, props | `components/{slug}/AGENTS.md`, and the row in [components.tsv](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv) |
| Standing design rules | the relevant file in [AGENTS/](AGENTS/) — headless, accessibility, internationalization, theme, helpers |
| Why the system is shaped this way | the relevant topic under [spec/](spec/index.md) |
| Why a change looks the way it does | the pull request description that landed it, and the entry in [CHANGELOG.md](CHANGELOG.md) |
| What a release contains | [CHANGELOG.md](CHANGELOG.md) and [NEWS.md](NEWS.md) |
| Questions still open | [RFC.md](RFC.md) |
| What the project will not do | this file, and the "settled" table in [RFC.md](RFC.md) |

A decision that exists only in a conversation — or only inside an AI coding session
([AI_STATEMENT.md](AI_STATEMENT.md) §6) — is not a decision this project made. It
becomes one when it lands in `AGENTS/` or `spec/`.

`CHANGELOG.md` carries unusual weight here. It is written to explain reasoning at
length, including when the project was wrong before, and it is the closest thing to
a decision log this repository has.

## How a change gets in

1. **An issue carries the contract**: what is wrong or missing, and what would
   settle it. For a new component, agreeing it exists comes first — it means work in
   14 subprojects.
2. **A pull request implements it**, following [CONTRIBUTING.md](CONTRIBUTING.md).
3. **The gates run**: `bin/test` (required files, catalog consistency, registry
   counts), `bin/check-links`, and the per-framework test suites. They are not
   advisory.
4. **The maintainer merges.** [CODEOWNERS](CODEOWNERS) routes review.

**On required review, stated plainly.** The maintainer's own changes are not
independently reviewed by a second human, because there is no second human.
Requiring two approvals of oneself would be a control that reports "reviewed"
without anyone having reviewed, and this project would rather report the truth and
let an adopter weigh it. What stands in for review is machine enforcement — the
gates above — and the limits of that substitution are stated in
[AI_STATEMENT.md](AI_STATEMENT.md) §12 rather than glossed.

## Cross-framework decisions

Lily implements one catalog in seven frameworks, which creates a class of decision
most projects do not have: what to do when the frameworks disagree.

- **Svelte is canonical for the helper catalogs.** When catalogs diverge, the Svelte
  side is correct and the others are ported to it.
- **Parity is the default; divergence needs a written reason.** Blazor's listbox
  pickers deliberately omit a focus-restoration step because its async event
  ordering makes the bug impossible and the fix a regression. That is a legitimate
  divergence precisely because it is recorded in
  [AGENTS/helpers.md](AGENTS/helpers.md) with its reasoning.
- **A behaviour change lands in all seven or it explains why not.**

## Becoming a maintainer

The route is open and it is the ordinary one:

1. **Contribute.** Sustained, merged, self-directed work. The bar is the point at
   which review stops finding things, not a pull-request count.
2. **Show judgement in the areas that matter here**: the headless boundary, the
   accessibility contract, cross-framework parity, and the discipline of not
   inventing user-facing strings.
3. **Ask, or be asked.** Either direction is normal.

The maintainer decides, and says yes or no with a reason on the tracker rather than
by silence. A new maintainer receives write access, a row in
[MAINTAINERS.md](MAINTAINERS.md), and their handle in [CODEOWNERS](CODEOWNERS) for
the areas they own. Publishing identities move separately and only where the
identity permits a second holder; that table is in MAINTAINERS.md and is kept
truthful.

## What this project will not do

Recorded here so the questions do not have to be re-litigated in each pull request.
These are governance positions; the technical equivalents are the "settled" table in
[RFC.md](RFC.md).

- **No contributor licence agreement, and no copyright assignment.** You keep your
  copyright; the licence menu in [LICENSE.md](LICENSE.md) stays the same for
  everyone including the maintainer. A deliberate position, not an oversight.
- **No CSS shipped in the headless layer**, and no CSS-framework dependency. This is
  the project's whole premise; a pull request that adds one is declined regardless of
  merit.
- **No hardcoded user-facing strings**, including defaults that seem obviously safe.
- **No weakening a test, a gate, or an expectation to make a build green.** A red
  gate is information.
- **No claim the project cannot demonstrate.** Accessibility claims say "targets"
  where no audit exists; verification counts are labelled as point-in-time
  snapshots; a claim with no evidence behind it does not get written. This rule has
  cost the project marketing language more than once and it stays.
- **No paid tier, no open-core split, no relicensing of what is already published.**

## Trademarks and forks

The licence grants the software, not the marks
([LICENSE.md](LICENSE.md) § Trademarks). A fork is welcome and is explicitly the
project's recommended response if the maintainer becomes unavailable; it must be
renamed. That is the only governance constraint on forking.

## Code of conduct

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) applies to every space this project
occupies. Enforcement is the maintainer's, at the contact address given there.

## Changing this document

Governance changes are pull requests against this file, like anything else, and they
take effect when they merge. If the structure described here stops being true — a
second maintainer joins, a legal entity forms, a decision body is created — this
file changes in the same pull request that makes it true, not afterwards.

---

Lily™ and Lily Design System™ are trademarks.
