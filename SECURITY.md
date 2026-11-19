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

| Artifact                              | Version line                     | What is supported                               |
| ------------------------------------- | -------------------------------- | ----------------------------------------------- |
| The headless packages (npm)           | `0.x`                            | the newest published version, and nothing older |
| The helper packages (npm, NuGet)      | their own `0.x` line per package | the newest published version                    |
| The monorepo and example applications | `0.x`                            | the newest tag                                  |

A fix lands on `main` and ships in the next published version. Nothing is
retro-fitted: a published npm version is immutable, so the only remedy for any
defect is a new version. If you are not on the newest release, you are receiving no
fixes, and the action is to upgrade.

**Known-bad versions.** Versions `0.2.0` of `@lilydesignsystem/svelte-headless`,
`-react-headless`, and `-vue-headless` are unusable — they declared an entry point
that was never built. Not a security defect, but recorded here because "upgrade" is
the answer to it too.

## Reporting a vulnerability

**Please do not open a public issue for a suspected vulnerability.**

Email **<joel@joelparkerhenderson.com>** with `SECURITY` in the subject line. There
is no security team; the maintainer is the whole path.

Or report it privately on GitHub:
<https://github.com/LilyDesignSystem/lily-design-system/security/advisories/new>. Private vulnerability
reporting is enabled on the repository (since 2026-11-18); the report is seen only by you and the maintainer, and
becomes the draft advisory the fix is developed in.

Include what you can: the affected component or package, the version, reproduction
steps or a proof of concept, an impact assessment, and any suggested fix.

The docs site publishes the same contact as an [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)
`security.txt` at `https://lilydesignsystem.github.io/.well-known/security.txt`.

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

### Severity and response times

Severity is the [CVSS v4.0](https://www.first.org/cvss/v4.0/specification-document) base score, rated by its
qualitative scale, scored for a typical consumer: a web application that renders Lily components with the
consumer's own content. The fix target runs from the assessment, and is met by a new published version of every
affected package.

| Severity | CVSS v4.0  | Fix target       | Advisory                       |
| -------- | ---------- | ---------------- | ------------------------------ |
| Critical | 9.0 – 10.0 | 7 days           | GitHub Security Advisory + CVE |
| High     | 7.0 – 8.9  | 30 days          | GitHub Security Advisory + CVE |
| Medium   | 4.0 – 6.9  | 90 days          | GitHub Security Advisory + CVE |
| Low      | 0.1 – 3.9  | the next release | CHANGELOG entry                |

These are targets for one maintainer, not a service level. When one will be missed, you hear before it is, with
the reason and a new date. A report that is not a vulnerability is answered with why, and may become a public
issue with your agreement.

### Disclosure process

1. **Receive.** A report arrives by email or private vulnerability report; it is acknowledged within 5 working days.
2. **Triage.** Reproduce it, score it, and list the affected packages and versions across all nine catalogs and the
   helpers, since one defect usually exists in every port. The assessment goes to the reporter within 10 working days.
3. **Fix in private.** The fix is developed in a GitHub Security Advisory's temporary private fork, with the reporter
   invited if they wish, and reviewed against the reproduction.
4. **Release.** Publish a fixed version of every affected package, then run `bin/verify-published` until every
   registry serves it.
5. **Disclose.** Publish the advisory with its CVE (requested through GitHub, a CVE Numbering Authority), the affected
   and fixed versions, the workaround if any, and the credit; add a `Security` entry to [CHANGELOG.md](CHANGELOG.md).
6. **Look for siblings.** Search the other components and catalogs for the same pattern, and add a test or a
   `bin/` check that would have caught it, so the class of defect stays fixed.

The embargo ends when the fix ships or after 90 days, whichever is first, unless the reporter and maintainer agree a
different date. An issue already public or being exploited is fixed and disclosed as fast as possible, in the open.

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

## Threat model

What Lily protects, from whom, and where its responsibility stops.

- **Assets.** The consumer's page: its DOM, its users' sessions, and what users type into Lily's form controls. The
  published packages themselves, which run inside every consumer's build and page.
- **Trusted input.** Everything the consumer's code passes: props, attributes, slots and children, configuration such
  as `themesUrl`, and the Nunjucks macros' `html` parameters, which are rendered as markup (`| safe`) by design, as in
  GOV.UK Frontend. A consumer who passes untrusted text there must escape it first, or use the `text` parameter.
- **Untrusted input.** What a person types or pastes into a component, and values the browser reads back from
  `localStorage`. Lily never renders either as markup. **Known gap (tasks.md P35-T6):** `time-zone-picker` accepts a
  stored value only if it is in its own list, but the theme, locale, text-size and motion pickers apply a stored value
  as written, and the theme picker puts it into its stylesheet URL. Writing that value needs script on the same
  origin, which already controls the page, so the risk is low; the fix is to check every stored value against the
  picker's list.
- **Attackers considered.** A user of a consumer's application who controls their own input; a page script or
  extension on the same origin is out of scope, since it already controls the page; an attacker on the supply chain
  between this repository and the registries.
- **Mitigations you can check.** No raw HTML rendering in the Svelte, React, Vue, Angular or Web Components headless
  libraries (no `{@html}`, `dangerouslySetInnerHTML`, `v-html` or `innerHTML`); few runtime dependencies (none
  in React, Angular, HTML, Web Components or Alpine; `aria-query` in Svelte and Vue; `nunjucks` in Nunjucks); [a strict Content Security Policy](docs/content-security-policy.md) that the HTML examples app
  runs under; npm publishes with provenance and NuGet through Trusted Publishing (below).

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
  boundary is the design; if you think it is the _wrong_ design, that is a valid
  [RFC.md](RFC.md) discussion rather than a vulnerability report.
- **The example applications' demo rendering.** The `/components/{slug}` pages inject
  demo markup through `{@html}`, `dangerouslySetInnerHTML`, `v-html`,
  `MarkupString`, and `| safe`. The content is a static, in-repo map authored by the
  project — not user input — so it is safe _there_. **It is not a pattern to copy
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
  188 national identifier components validate identifier _formats_; their test
  fixtures are synthetic values constructed to satisfy the algorithms, not real
  identifiers belonging to real people.
- **No bundled fonts, images, or icon assets.** The pickers' icons are inline SVG in
  the markup, not files fetched at runtime.
- **`sideEffects: false`** on the published packages: importing Lily runs nothing.

## Repository security settings — the posture of record

Settings live in GitHub, not in the tree, so they can be changed without a commit and
reset without anyone noticing. This table records what the posture is **supposed** to
be. Read it back with
`gh api repos/LilyDesignSystem/lily-design-system --jq '.security_and_analysis'` and
treat a divergence as a finding.

| Setting                         | Expected                                                                                                                                                                                                                                      | Why                                                                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Secret scanning                 | enabled                                                                                                                                                                                                                                       | the baseline detector                                                                                                                                  |
| Push protection                 | enabled                                                                                                                                                                                                                                       | refuses the commit rather than filing an alert afterwards                                                                                              |
| Private vulnerability reporting | enabled                                                                                                                                                                                                                                       | the alternative reporting route named above                                                                                                            |
| Dependabot security updates     | enabled                                                                                                                                                                                                                                       | advisory-driven bumps across many package manifests                                                                                                    |
| Dependency vulnerability audit  | weekly (`security-audit.yml`) and `bin/security-audit`                                                                                                                                                                                        | every lockfile and published .NET project against the advisory databases; fails on a high or critical advisory in what users install, reports the rest |
| Branch protection on `main`     | active — no force-push, no deletion                                                                                                                                                                                                           |                                                                                                                                                        |
| npm publishing                  | two-factor authentication required; publishes carry `--provenance`                                                                                                                                                                            | the publishing identity is one account; see [MAINTAINERS.md](MAINTAINERS.md)                                                                           |
| Registry tokens (`NPM_TOKEN`)   | named CI secret only, real publishes gated on manual dispatch; slated for OIDC [Trusted Publishing](spec/trusted-publishing/index.md) once it covers all three forges (not met as of 2026-09 — Codeberg unsupported)                          | a leaked long-lived token is the classic supply-chain path; the interim mitigation and the adoption trigger are written down                           |
| NuGet publishing                | OIDC [Trusted Publishing](spec/trusted-publishing/index.md) (adopted 2026-09): a `NUGET_USER` secret names the nuget.org profile, not a credential; the actual push key is a 1-hour token minted per run by `NuGet/login@v1` and never stored | no long-lived NuGet key exists to leak                                                                                                                 |

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
exist and must be commissioned — the [accessibility
statement](docs/accessibility-statement.md) states exactly what is and is not
verified, and [docs/audit-readiness.md](docs/audit-readiness.md) holds the
scope an auditor would need. [CONTRIBUTING.md](CONTRIBUTING.md) names an
independent accessibility audit as the highest-value thing sponsorship could fund.

---

Lily™ and Lily Design System™ are trademarks.
