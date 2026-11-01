<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/MAINTAINERS.md -->

# Maintainers and access continuity

This file is the roster, and the honest answer to the question a professional
evaluation asks about any dependency: _what happens if the person who can ship a
fix is unavailable?_

It is deliberately not aspirational. Everything below describes the project as it
is on the day you read it in git history, not a structure the project hopes to
grow into.

## Roster

| Person                | GitHub                                                         | Email                          | Role              | Since      |
| --------------------- | -------------------------------------------------------------- | ------------------------------ | ----------------- | ---------- |
| Joel Parker Henderson | [@joelparkerhenderson](https://github.com/joelparkerhenderson) | <joel@joelparkerhenderson.com> | Maintainer (sole) | 2025-08-09 |

**The bus factor of this project is one.** There is exactly one person with write
access to the repositories, one person who can publish a release, and one person
who can accept a pull request. No second maintainer exists, no organisation
stands behind the project, and no legal entity is a party to it. The
`LilyDesignSystem` GitHub organisation is an organisational convenience owned by
that same person; it does not represent a group.

Everything else in this file follows from that sentence, and no wording elsewhere
in the repository should be read as softening it.

## Scale, and what one maintainer means at this scale

Lily is unusually large for a one-person project: 571 catalog components
implemented across seven frameworks, seven example applications, 35 helper
packages, 63 theme stylesheets, and roughly 11,000 markdown files. State that
plainly rather than let a reader discover it as a surprise.

The practical consequences:

- **Review depth is one person's.** Machine gates (`bin/test`, `bin/check-links`,
  the per-framework suites, axe-core, Playwright) stand in for the review capacity
  a larger team would have. See [AI_STATEMENT.md](AI_STATEMENT.md) §7.
- **Coverage is uneven and says so.** Some claims are verified point-in-time
  snapshots rather than live guarantees; [spec/index.md](spec/index.md) §11.4
  labels them as such, and §11.8 lists what is genuinely open.
- **Response time is not committed.** There is no support SLA, paid or otherwise.

## Publishing identities and where they live

These are the credentials and configured identities that can put bytes in front of
a user. Naming them is the point: an inventory nobody has written down is an
inventory nobody can hand over.

| Identity                                                                     | What it publishes                                                                                                                                                                                                       | Held by                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Recovery if the holder is unavailable                                                                                                        |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub account `joelparkerhenderson` and the `LilyDesignSystem` organisation | every repository, every release, issues, settings, and the `lilydesignsystem.github.io` Pages site                                                                                                                      | the maintainer                                                                                                                                                                                                                                                                                                                                                                                                                                                               | none: GitHub's account-recovery process is the only route, and it is between GitHub and the account holder                                   |
| npm publish rights                                                           | the published headless and helper packages                                                                                                                                                                              | the maintainer's npm account (plus `NPM_TOKEN` as a CI secret; slated for OIDC [Trusted Publishing](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/trusted-publishing/index.md) when all forges are covered)                                                                                                                                                                                                                                                                                                           | the npm owner list is the recovery surface, and it is that one account                                                                       |
| NuGet publish rights                                                         | the Blazor headless library plus the 5 Blazor helper packages (published 2026-09-02: `LilyDesignSystem.Blazor.Headless` 0.1.1, `.ThemePicker`/`.LocalePicker`/`.TextSizePicker`/`.SharePicker`/`.DateTimePicker` 0.1.0) | OIDC [Trusted Publishing](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/trusted-publishing/index.md) from GitHub Actions only (a nuget.org policy bound to this repo's `publish.yml`, held by the `lilydesignsystem` nuget.org organization, created by the maintainer's own nuget.org username, which is what the `NUGET_USER` CI secret must hold — the policy creator's username, not the organization name (a 2026-10-05 run failed with HTTP 401 until this was corrected) — no long-lived NuGet API key exists) | the nuget.org account holding the trusted-publisher policy is the recovery surface; GitLab and Codeberg still cannot publish to NuGet at all |
| GitLab and Codeberg mirrors                                                  | a full push mirror of every subtree                                                                                                                                                                                     | the maintainer                                                                                                                                                                                                                                                                                                                                                                                                                                                               | see "If the maintainer is unavailable" — this is the one identity that meaningfully reduces risk                                             |
| The Lily™ and Lily Design System™ marks                                      | the project name                                                                                                                                                                                                        | the maintainer, personally                                                                                                                                                                                                                                                                                                                                                                                                                                                   | trademark rights do not transfer with a fork; see [LICENSE.md](LICENSE.md)                                                                   |

**The honest reading of that table:** every publishing identity terminates at one
person's account. Nothing here is escrowed, and no mitigation is currently
available to a one-person project without a legal entity behind it.

## If the maintainer is unavailable

There is no succession plan that a document can create. What exists instead:

- **Nothing already published disappears.** Published npm versions are immutable
  (they can be deprecated, which needs the owner anyway); GitHub releases stay
  downloadable; the Pages site keeps serving. An application already depending on
  a pinned version is not affected by maintainer availability.
- **Nothing new ships.** No release, no accessibility fix, no new framework, no
  security patch.
- **The work is not lost, and this part is unusually well covered.** The
  monorepo is pushed to three independent forges — GitHub, GitLab, and
  Codeberg (`origin`'s push URLs). The whole
  history survives the loss of any one of them, including GitHub. The license is
  a permissive menu ([LICENSE.md](LICENSE.md)) and the entire design rationale is
  in the tree under [spec/](spec/index.md) rather than in one person's head. A
  fork is a complete and legitimate continuation, and the project's position is
  that it should be taken rather than waited on.
- **What a fork must rename.** The marks. Everything else carries over.

If you depend on Lily in production and that position is not acceptable to you
(it reasonably may not be), the mitigation is on your side of the boundary: pin a
version, vendor the components you use — Lily is designed to be copied, and the
website's quick start leads with copying markup rather than installing anything —
and budget for maintaining it. That is a truthful answer, and it is more useful
than a continuity plan with nobody behind it.

## Support policy

This is what the one maintainer above commits to. It promises less than a
vendor would, and it is written to be kept.

### Supported versions

- **Until 1.0, only the latest minor of each package is supported**, and within
  it only the newest published patch. That applies separately to each headless
  package and each helper package on npm and NuGet, since each has its own `0.x`
  line. Older minors get no fixes and no backports.
- A fix lands on `main` and ships as a new version of the latest line. A
  published version is immutable, so if you are on an older version, upgrading
  is the only way to get a fix. [SECURITY.md](SECURITY.md#supported-versions)
  has the same table for security reports.
- Pre-1.0, a minor version may break things.
  [docs/releasing.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/releasing.md) names the contracts that force a minor
  bump when they change.
- After 1.0, this section will be rewritten before the 1.0 release ships. It
  will not be carried forward unchanged.

### Security fixes

The security-fix target is the one in
[SECURITY.md](SECURITY.md#what-you-can-expect), and only that one:

- an acknowledgement within 5 working days;
- an assessment, with a severity and an intended fix window, within 10 working
  days of the acknowledgement;
- coordinated disclosure on a date agreed with the reporter.

SECURITY.md sets no fixed time-to-fix. Each report's fix window is set in that
report's assessment, so no fix deadline is given here either.

### Deprecation notice period

_Proposed, for the maintainer to confirm:_ a component, prop, class hook, or
package marked for removal stays in **at least one further published minor**
with a deprecation note in the CHANGELOG. It is removed **no sooner than 30 days**
after that minor is published. Whichever of the two takes longer applies.

A version that is broken, rather than one being retired, is deprecated on the
registry straight away, with no notice period, as
[docs/releasing.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/releasing.md) describes. It is never unpublished.

### What "best effort" means here

"Best effort" means one unpaid person works on reports as time allows,
most severe first ([CONTRIBUTING.md](CONTRIBUTING.md)). It does **not** mean:

- a response time (the security acknowledgement above is the only time this
  project commits to);
- a fix for any particular report, or a fix by any particular date;
- support for versions older than the latest minor;
- help with application code that uses Lily.

If your obligations need any of those, Lily does not provide them today. Pin a
version and plan to maintain your own copy, as described under "If the
maintainer is unavailable" above.

### Bus-factor plan

**Wanted, and currently absent: a second person with publish rights on npm
(the `@lilydesignsystem` scope) and on NuGet (the `lilydesignsystem`
organization).** Today no such person exists, and every identity in the table
above ends at one account.

The plan is only the mechanism already described under "Adding a maintainer".
Once someone has earned the row, they get:

1. owner rights on the npm scope, with two-factor authentication;
2. membership of the nuget.org organization that owns the Trusted Publishing
   policy, so that losing either account still leaves one that can publish;
3. a row in the roster and the identity table above, in the same commit.

Until that commit exists, the bus factor stays at one. Nothing in this section
changes that.

## Adding a maintainer

The project wants this and has no process theatre around it. The route is
ordinary: contribute, sustain it, and ask. What earns the row is demonstrated
judgement about the contracts in [spec/](spec/index.md) — the accessibility
contract, the headless boundary, cross-framework parity — because those are what
a maintainer is being trusted with.

When someone takes that route, this file gains a row, [CODEOWNERS](CODEOWNERS)
gains their handle on the areas they own, and the table above gains a second
holder wherever the identity permits one. Those three edits are the whole
mechanism.

## Contact

- General, and anything in this file: <joel@joelparkerhenderson.com>
- Bugs and feature requests: the issue tracker on
  [GitHub](https://github.com/LilyDesignSystem/lily-design-system/)
- Security-sensitive reports: email rather than the tracker, and say so in the
  subject line. There is no separate security team; the maintainer is the whole
  path.

---

Lily™ and Lily Design System™ are trademarks.
