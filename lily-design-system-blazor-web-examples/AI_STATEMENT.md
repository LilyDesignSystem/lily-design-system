<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/AI_STATEMENT.md -->

# Lily Design System AI Statement

|                     |                                                              |
| ------------------- | ------------------------------------------------------------ |
| Version             | 1.0.0                                                         |
| Effective date      | 2026-08-26                                                    |
| Status              | Active                                                        |
| Author and owner    | Joel Parker Henderson, maintainer                             |
| Canonical location  | `AI_STATEMENT.md` at the repository root                      |
| License             | the same license menu as the rest of the project ([LICENSE.md](LICENSE.md)) |
| Review              | at every minor release, and on any trigger in §13             |

**Abstract.** This document discloses how artificial-intelligence tools are used
to develop Lily Design System™, a free open-source headless design system. It
states what the tools do and do not touch, who is accountable, which controls
bound the work and how each is enforced, the licensing and data posture, the
rules for contributors, the uses that are prohibited, and the limitations that
survive all of it. It is a self-declaration by the maintainer, written for
evaluators performing supplier due diligence, and it changes in the same commit
that changes the practice it describes.

The key words **shall**, **should**, and **may** are used as ISO/IEC Directives
Part 2 defines them: requirement, recommendation, permission.

## 1. Scope

This document covers the use of AI tools in developing everything in this
repository: the canonical component catalog, the seven headless libraries, the
seven example applications, the seven helper catalogs, the 45 theme stylesheets,
the `bin/` tooling, the tests, the specification under [spec/](spec/index.md),
and this document itself.

It does not cover an AI system in the product, because there is none: **Lily
ships no AI.** No model is trained, embedded, or called at render time. The
components are semantic HTML, ARIA, focus management, and keyboard behaviour.
Nothing in a page built with Lily contacts a model, and Lily adds no network
calls of any kind — the headless layer performs no data fetching by design
([AGENTS/headless.md](AGENTS/headless.md), "Behavior boundaries"). AI is used to
*build* the software, in the same sense that compilers and linters are used to
build it.

## 2. Which frameworks apply here, and which do not

Stated plainly, because borrowed authority is worse than none:

- **The EU AI Act imposes no obligation on this project.** The Act binds
  providers and deployers of AI *systems*; Lily is not one. Article 50's marking
  duties bind the AI tool's provider, not the tool's user. This document is
  voluntary.
- **No accessibility conformance body has reviewed this project.** Lily *targets*
  WCAG 2.2 AAA and follows the WAI-ARIA Authoring Practices. It has not been
  audited by anyone, and no VPAT or conformance claim exists. See §12.
- **ISO/IEC 42001 and the NIST AI RMF are used as vocabulary, not claimed as
  conformity.** No certification is claimed, no audit has occurred, and the words
  "certified", "audited", and "validated" appear in this document only inside
  this sentence, to say they do not apply.

## 3. Terms

This document reuses the W3C AI Content Disclosure vocabulary rather than
inventing one: **none** (entirely human-authored), **ai-assisted**
(human-authored; AI edited, refined, or filled in boilerplate), **ai-generated**
(AI-generated with human prompting and review), **autonomous** (AI-generated
without meaningful human oversight). An **agentic tool** is one that plans and
executes multi-step work — editing files, running builds and tests — under a
human's direction, as opposed to inline completion.

## 4. Accountability

One named human — the maintainer, listed in [MAINTAINERS.md](MAINTAINERS.md) —
is the author of and accountable for every change in this repository, whatever
tool produced the bytes. A tool **shall not** be named as an author, co-author,
or signer of anything here, because a tool cannot be responsible for accuracy,
integrity, or originality; responsibility that cannot be borne cannot be
assigned. There is no AI-issued sign-off of any kind.

## 5. Where AI is used, and at what level

The tooling is agentic AI coding assistance (currently Claude Code, by Anthropic),
operated in sessions the maintainer directs, reviews, and merges. Levels below use
the §3 vocabulary. Deliberately, no percentage appears anywhere in this document:
no defensible method exists for measuring one.

| Activity | Level | Notes |
| --- | --- | --- |
| Component implementations across the seven frameworks | ai-generated | written in directed sessions against the canonical per-component metadata in `components/{slug}/AGENTS.md`; reviewed and merged by the maintainer |
| The helper packages and their accessibility behaviour | ai-generated | held to the WAI-ARIA APG patterns cited in [AGENTS/accessibility.md](AGENTS/accessibility.md); the Svelte catalog is canonical and the six ports are derived from it |
| Tests, Storybook stories, Playwright specs | ai-generated | held to the same authority as the code they test: expectations cite the spec clause, and §7's attribution rule governs failures |
| Per-component documentation (491 × `index.md`) | ai-generated | to the structure fixed in [spec/index.md](spec/index.md) §8 |
| The specification under `spec/`, the `AGENTS/` rules, and this statement | ai-generated | held to the repository's own prose rules; the maintainer sets the positions |
| Catalog decisions — what a component is, what it is named, what element it maps to | ai-assisted | proposed in session, decided by the maintainer, recorded in `components.tsv` and [AGENTS/components.md](AGENTS/components.md) |
| Design-principle rulings, release decisions, license and trademark decisions | none | the maintainer's alone |
| Contribution and review verdicts on others' work | none | prohibited use; see §11 |

**autonomous** appears in no row, and that is the point of the next section.

## 6. Human oversight

The maintainer directs the work, reads the result, and merges every change;
nothing lands on its own authority, and no merge is automated. Where the tools
run multi-step sessions, the decisions with consequences — what a component's
keyboard contract is, whether a behaviour belongs in the headless layer or the
consumer's, what ships in a release — are the maintainer's. A decision that
exists only inside a tool session is not a decision this project made; it becomes
one when it lands in `spec/` or `AGENTS/`.

## 7. Quality controls, and what each one proves

AI-produced work is not a shortcut around engineering process. Every change,
whoever or whatever wrote it, passes the same gates; each control below names its
enforcement, because a control without a failing check is a wish.

- **The catalog is the oracle.** `components.tsv` and each
  `components/{slug}/AGENTS.md` fix the slug, the PascalCase name, the HTML tag,
  the ARIA, the keyboard contract, and the props. Implementations conform to that
  file or they are wrong. Enforced by `bin/test`, which cross-checks the catalog
  against component directories, CSS class hooks, and every example-app registry,
  and exits non-zero on failure.
- **Executed test suites, per framework.** vitest for Svelte, React, Vue, Angular
  and Nunjucks; bUnit for Blazor; WebDriverIO for HTML; Playwright end-to-end on
  the browser-runnable example apps. Counts are recorded as point-in-time
  snapshots in [spec/index.md](spec/index.md) §11.4, not as live claims.
- **Automated accessibility checks.** axe-core via Playwright across the example
  apps, on the WCAG 2.0 A+AA, 2.1 A+AA, and 2.2 AA rule sets, plus a responsive
  viewport sweep. What this does *not* cover is §12's first bullet.
- **Link integrity.** `bin/check-links` verifies every relative markdown link
  across ~11,000 files. A generated document that references something that does
  not exist fails the build rather than shipping.
- **Failure attribution.** A red test is attributed by comparing the canonical
  component metadata against the test's expectation against the observed DOM. The
  implementation is never presumed correct because it was written carefully, and
  tests **shall not** be weakened to make a build pass.
- **Regression tests must bite.** A test written for a fixed defect is confirmed
  to fail without the fix before it is accepted. This rule exists because it was
  learned the hard way: the project has shipped green suites over silently thrown
  exceptions and over correct-but-unasserted behaviour, both recorded in
  [CHANGELOG.md](CHANGELOG.md).

What these controls do **not** prove is stated in §12.

## 8. Licensing and provenance of AI output

The project is offered under a permissive license menu ([LICENSE.md](LICENSE.md)).
The position taken here follows the Apache Software Foundation's and LLVM's
published reasoning rather than wishful shortcuts: an AI tool's output does not
launder anyone's copyright, the full provenance of generated text is generally not
knowable, and prompting alone is not treated as authorship.

In practice: contributions of substantially copied third-party material are
refused however they were produced; generated code is held to the same
originality expectations as human code, under the same review; and if identifiable
third-party material is found in the tree, it is removed or licensed properly,
exactly as it would be for a human-introduced copy. The tools are used under terms
that do not restrict the output's use under this project's licenses.

One area deserves specific mention, because Lily's whole method is learning from
other design systems. [AGENTS/citations.md](AGENTS/citations.md) names them, and
the rule is that Lily takes *patterns and research* — what a component is for,
when not to use it, which ARIA pattern applies — and not code or stylesheets. The
NHS UK visual reference in the example apps is an independent implementation
against Lily's own class names, not a copy of `nhsuk-frontend`; no `nhsuk-` prefix
appears anywhere in the markup. Lily is not affiliated with or endorsed by any of
the systems it cites.

## 9. Data

No personal data, no customer data, and no health data exists anywhere in this
project — not in the repository, not in test fixtures, not in telemetry, and
therefore not in any prompt. Demo content in the example applications is invented.

Two points a reader should check rather than take on trust:

- The 80 national personal identifier components validate identifier *formats*
  (checksums, structure, normalization). The test fixtures are synthetic values
  constructed to satisfy those algorithms, not real identifiers belonging to real
  people. This is a structural property verifiable against the tree.
- Lily collects nothing at runtime. There is no telemetry, no analytics, and no
  network call in the headless layer.

Vendor-side data handling is governed by the tool vendor's terms; this document
deliberately makes no claim on the vendor's behalf, because such claims go stale
silently.

## 10. Rules for contributors

Contributors **may** use AI tools. A contribution with **ai-generated** content
per §3 **should** say so in the pull-request description — which tool, and what
it did. Disclosure lives in the PR description rather than in commit trailers:
one maintained disclosure beats ten thousand trailer lines, this document is that
disclosure, and the wider ecosystem has no agreed trailer anyway — the same
trailers some communities recommend, others forbid.

The contributor remains responsible for their submission in full: understood,
explained on request, tested, and honest. A contribution that its author cannot
explain is not accepted, whoever or whatever wrote it.

## 11. Prohibited uses

In this project, AI **shall not**: merge anything; adjudicate, score, or answer
reviews of other people's contributions; sign anything; decide a design-principle
question (those are the maintainer's and are recorded in `AGENTS/` and `spec/`);
claim an accessibility conformance level that has not been tested; or weaken a
test, an expectation, or a gate to make something pass — the last being a
standing hard rule for humans and tools alike.

## 12. Limitations and residual risks

This section exists because a disclosure without one is marketing.

- **Automated accessibility testing proves what it tests, not accessibility.**
  axe-core covers a minority of WCAG success criteria and cannot judge whether a
  keyboard contract makes sense to a human. Lily has shipped fully green suites
  over real accessibility defects more than once — a re-entrant apply that froze a
  picker at `aria-expanded="true"` was invisible to both jsdom and bUnit, and a
  behaviour six of seven catalogs implemented correctly had nothing asserting it.
  Both are written up in [CHANGELOG.md](CHANGELOG.md) rather than quietly fixed,
  precisely because they bound what the suites prove.
- **"Targets WCAG 2.2 AAA" is not "is WCAG 2.2 AAA".** No audit has occurred, no
  screen-reader certification exists, and the automated baselines run AA rule
  sets. Any published claim that says "compliant" is a defect in that text and
  should be reported.
- **Review depth is one person's.** See [MAINTAINERS.md](MAINTAINERS.md). "The
  maintainer understands and can explain every merged change" is the honest claim;
  "every line was independently re-derived" would not be.
- **Scale outruns verification.** 491 components × 7 frameworks is a lot of
  surface for machine gates plus one reviewer. Verified counts in
  [spec/index.md](spec/index.md) §11.4 are point-in-time snapshots and are
  labelled as such; §11.8 lists what is genuinely open.
- **Retroactivity.** Commits predating this statement carry no disclosure
  markers; this document describes the practice, not a per-commit audit trail,
  and no such trail is claimed.
- **Provenance uncertainty survives.** Whether any generated fragment echoes
  unlicensed training material is not fully knowable with current tools; §8 states
  the handling, not a guarantee.
- **The legal ground is unsettled.** Copyright in AI output is an open question in
  most jurisdictions; this document records positions, and positions may have to
  change. §13 names the triggers.
- **This is a self-declaration.** No third party has audited it. The checkable
  artifacts in §7 are the counterweight: they can disagree with this document, and
  if they do, the document is wrong.

## 13. Review and change

This statement is reviewed at every minor release, and revised off-cycle when any
of these fires: the tooling changes materially, a tool vendor's terms change in a
way §8 or §9 relies on, a binding rule emerges (EU AI Act guidance touching this
use, a foundation policy this project follows, a court decision on AI output and
copyright), or a claim in this document stops being true. The maintainer owns the
review; the change lands as a commit like everything else, and the version and
change log update in the same commit.

## 14. Reporting

A suspected provenance, licensing, accessibility, or quality problem in this
repository — including a claim in this document that does not survive checking —
is a report this project wants. Open an issue and cite this file; for anything
security-sensitive, email <joel@joelparkerhenderson.com> and say so in the
subject line. The handling commitment is the same as for any defect: attributed,
answered in public, and never silently absorbed.

## 15. References

**Normative for this project** (the documents that bind the practice described
here): [LICENSE.md](LICENSE.md); [spec/index.md](spec/index.md) and the topic docs
under `spec/`; [AGENTS.md](AGENTS.md) and the rule set in `AGENTS/`, in particular
[headless.md](AGENTS/headless.md), [accessibility.md](AGENTS/accessibility.md),
[internationalization.md](AGENTS/internationalization.md), and
[helpers.md](AGENTS/helpers.md); [MAINTAINERS.md](MAINTAINERS.md);
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md); [CHANGELOG.md](CHANGELOG.md).

**Informative** (the sources this document's structure and positions draw on):
the W3C AI Content Disclosure vocabulary; the ISO/IEC Directives Part 2 verbal
forms; the Apache Software Foundation's generative-tooling guidance; the Linux
Foundation's generative-AI policy; the Fedora Council's AI-assisted-contributions
policy; ICMJE's AI-authorship position; NIST AI RMF and ISO/IEC 42001 as
vocabulary; EU AI Act Articles 2, 3, and 50; W3C WCAG 2.2 and the WAI-ARIA
Authoring Practices Guide 1.2.

## Annex A. Change log

| Version | Date       | Change       |
| ------- | ---------- | ------------ |
| 1.0.0   | 2026-08-26 | First issue. |

## Annex B. Machine-readable summary

Levels per the W3C AI Content Disclosure vocabulary (§3); the prose above is
authoritative where the two could ever disagree.

```yaml
ai-statement:
  version: 1.0.0
  last-updated: 2026-08-26
  vocabulary: w3c-ai-content-disclosure
  disclosure-default: ai-generated
  tools:
    - name: Claude Code
      provider: Anthropic
  processes:
    catalog-decisions: ai-assisted
    implementation: ai-generated
    testing: ai-generated
    documentation: ai-generated
    review: none
    design-principles: none
    release-decisions: none
  ships-ai-system: false
  autonomous-use: none
```

---

Lily™ and Lily Design System™ are trademarks.
