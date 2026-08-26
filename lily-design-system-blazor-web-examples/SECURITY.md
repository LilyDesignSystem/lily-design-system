<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/SECURITY.md -->

# Security Policy

Lily Design System™ is a component library. It ships markup, ARIA, focus
management, and keyboard behaviour — no server, no database, no network calls, and
no data of its own. That shapes what a security report about Lily can be, and this
document says so specifically rather than borrowing a policy written for software
that holds data.

## Supported versions

**Only the most recent release is supported.** There are no maintenance branches, no
long-term-support line, and no backports. Lily is pre-1.0 and maintained by one
unpaid person; a maintenance line is a commitment that needs people behind it, and
[GOVERNANCE.md](GOVERNANCE.md) and [MAINTAINERS.md](MAINTAINERS.md) record honestly
how many there currently are.

| Artifact | Version line | What is supported |
| --- | --- | --- |
| The headless packages (npm) | `0.x` | the newest published version, and nothing older |
| The helper packages (npm, NuGet) | their own `0.x` line per package | the newest published version |
| The monorepo and example applications | `0.x` | the newest tag |

A fix lands on `main` and ships in the next published version. Nothing is
retro-fitted: a published npm version is immutable, so the only remedy for any
defect is a new version. If you are not on the newest release, you are receiving no
fixes, and the action is to upgrade.

**Known-bad versions.** Versions `0.2.0` of `lily-design-system-svelte-headless`,
`-react-headless`, and `-vue-headless` are unusable — they declared an entry point
that was never built. Not a security defect, but recorded here because "upgrade" is
the answer to it too.

## Reporting a vulnerability

**Please do not open a public issue for a suspected vulnerability.**

Email **<joel@joelparkerhenderson.com>** with `SECURITY` in the subject line. There
is no security team; the maintainer is the whole path.

If GitHub private vulnerability reporting is enabled on the repository, that route
works too — but email is the documented one, because it does not depend on a setting
this document cannot verify for you.

Include what you can: the affected component or package, the version, reproduction
steps or a proof of concept, an impact assessment, and any suggested fix.

### What you can expect

- **An acknowledgement within 5 working days.** If you have not heard anything by
  then, the report has not reached me; escalate by opening a public issue saying only
  that a private report is awaiting acknowledgement, with no details.
- An assessment with a severity and an intended fix window within 10 working days of
  the acknowledgement.
- Coordinated disclosure: a date agreed with you rather than imposed on you, and word
  from me when the fix ships.

These are commitments to you, not conditions on you. If they are missed, publishing
is your call.

### Safe harbour

I will not pursue or support legal action against anyone who reports a vulnerability
in good faith and follows this policy. In practice that means you tested against your
own deployment or a test instance you control, you did not access, modify, or retain
anyone else's data, you did not degrade service for others, and you gave the window
above before publishing. If you are unsure whether something is in scope, ask first;
a question is always in good faith.

### Credit

Reporters are named in the advisory and in [CHANGELOG.md](CHANGELOG.md) by default,
using whatever name and link you give. Say so if you would rather not be named;
declining credit costs you nothing and changes nothing about how the report is
handled.

## What is in scope

- **Markup that enables injection.** A component that interpolates a prop into
  markup in a way that permits script execution, attribute injection, or `href`
  scheme abuse.
- **ARIA or focus behaviour that can be weaponised** — a focus trap that cannot be
  escaped, a live region an attacker can drive, a dialog that does not confine focus.
- **Supply-chain problems in the published packages**: an unexpected dependency, a
  postinstall script, files in the tarball that should not be there. The `0.2.0`
  packages shipped entire source trees by accident, so this class is real here.
- **The helper packages' DOM writes.** They set `data-theme`, `lang`, `dir`, and
  `data-text-size` on the document root, swap a managed `<link rel="stylesheet">`
  href, and optionally write `localStorage`. Anything that makes one of those escape
  its intended shape is in scope.
- **The published documentation site**, `lilydesignsystem.github.io`.

## What is out of scope, and why

Stated plainly so you do not waste effort:

- **Consumer misuse of a documented prop.** `theme-picker` builds its stylesheet URL
  by concatenation — `normaliseThemesUrl(themesUrl) + slug + extension` — and sets it
  on a `<link>`. Those props are **developer-supplied configuration, not user input**,
  and the component trusts them by design. A consumer who wires untrusted input into
  `themesUrl` or `themes` has created a vector on their side of the boundary. That
  boundary is the design; if you think it is the *wrong* design, that is a valid
  [RFC.md](RFC.md) discussion rather than a vulnerability report.
- **The example applications' demo rendering.** The `/components/{slug}` pages inject
  demo markup through `{@html}`, `dangerouslySetInnerHTML`, `v-html`,
  `MarkupString`, and `| safe`. The content is a static, in-repo map authored by the
  project — not user input — so it is safe *there*. **It is not a pattern to copy
  with untrusted content**, and that warning is the useful output of this scope note.
  A report that the demo map itself contains something harmful is in scope.
- **Missing security headers on the docs site.** It is GitHub Pages; the headers are
  GitHub's.
- **Vulnerabilities in a framework Lily targets** — Svelte, React, Vue, Angular,
  Blazor, Nunjucks, or a bundler. Report those upstream.
- **Automated scanner output with no analysis attached.** A dependency listed in a
  lockfile is not necessarily reachable from a built artifact; say why it is.

## Structural properties you can verify

These are claims a reader can check against the tree rather than take on trust, and
they are why Lily's attack surface is small:

- **The headless layer performs no data fetching, no network calls, and no
  persistence.** This is a design rule, not an accident —
  [AGENTS/headless.md](AGENTS/headless.md) § Behavior boundaries.
- **No telemetry and no analytics anywhere.** Nothing about your use of Lily reaches
  the project.
- **No personal data in the repository** — not in fixtures, not in demo content. The
  80 national identifier components validate identifier *formats*; their test
  fixtures are synthetic values constructed to satisfy the algorithms, not real
  identifiers belonging to real people.
- **No bundled fonts, images, or icon assets.** The picker glyphs are Unicode
  characters, not files.
- **`sideEffects: false`** on the published packages: importing Lily runs nothing.

## Repository security settings — the posture of record

Settings live in GitHub, not in the tree, so they can be changed without a commit and
reset without anyone noticing. This table records what the posture is **supposed** to
be. Read it back with
`gh api repos/LilyDesignSystem/lily-design-system --jq '.security_and_analysis'` and
treat a divergence as a finding.

| Setting | Expected | Why |
| --- | --- | --- |
| Secret scanning | enabled | the baseline detector |
| Push protection | enabled | refuses the commit rather than filing an alert afterwards |
| Private vulnerability reporting | enabled | the alternative reporting route named above |
| Dependabot security updates | enabled | advisory-driven bumps across many package manifests |
| Branch protection on `main` | active — no force-push, no deletion | |
| npm publishing | two-factor authentication required | the publishing identity is one account; see [MAINTAINERS.md](MAINTAINERS.md) |

> [!NOTE]
> Verified 2026-08-26 across all 23 repositories: secret scanning, push
> protection, private vulnerability reporting, and Dependabot security updates
> are **enabled**. Branch protection on `main` and npm 2FA are not readable
> from the public API and remain intended-but-unconfirmed here. Two further
> toggles — non-provider secret patterns and validity checks — are UI-only
> (the API accepts and ignores them) and are still off; enabling them is an
> open maintainer task.

## Not a security policy for your application

Lily is one dependency in your stack. Using it does not make an application
accessible, and it does not make one secure. In particular: Lily targets WCAG 2.2
AAA and has never been audited ([AI_STATEMENT.md](AI_STATEMENT.md) §12), so if your
own compliance obligations require an assurance, that assurance does not currently
exist and must be commissioned. [CONTRIBUTING.md](CONTRIBUTING.md) names an
independent accessibility audit as the highest-value thing sponsorship could fund.

---

Lily™ and Lily Design System™ are trademarks.
