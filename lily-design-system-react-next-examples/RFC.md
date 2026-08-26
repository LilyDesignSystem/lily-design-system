<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/RFC.md -->

# Request for Comments

Lily Design System™ is one person's answer to a set of open questions. Some of
those answers are load-bearing and settled. Others are guesses that have never
been tested against anyone else's reality, and this file names them.

**What this project wants most is to find out where it is wrong.** Not
encouragement — encouragement is pleasant and changes nothing. A specific
disagreement, grounded in work you have actually done, is the input that improves
this.

## How to respond

| You have | Do this |
| --- | --- |
| An answer to a question below | Open an issue titled `RFC N: <your position>` |
| A defect | An ordinary issue — see [CONTRIBUTING.md](CONTRIBUTING.md) |
| Something you would rather not say publicly | <joel@joelparkerhenderson.com> |
| A change you have already made | A pull request that says which RFC it answers |

<https://github.com/LilyDesignSystem/lily-design-system/>

You do not need to answer every question, be right, be polite about it, or use the
project's own vocabulary. "I tried this and hated it because X" is a complete and
useful response.

## What kind of feedback helps

**Most useful, in order:**

1. **"I tried to use it and hit this."** Concrete friction from real work beats any
   amount of theory. Include what you were building and what you expected.
2. **"Your accessibility claim is wrong here, and here is the evidence."** Screen
   reader, browser, component, what was announced, what should have been.
3. **"This convention breaks down at scale."** You have run a design system with a
   real team; you know where this one's assumptions will fail. Say where.
4. **"You are solving a problem nobody has."** The most valuable and least
   comfortable feedback. Several answers below may deserve it.
5. **"Here is prior art you clearly have not read."** A system that already solved
   this, or already failed at it.

**Less useful:**

- Style preferences without a consequence attached.
- Feature requests that do not say what you were trying to do.
- "You should rewrite it in X."
- Praise. Genuinely — it is nice, and it is not what this file is for.

## The open questions

Each one states what the project currently believes, why, and — importantly —
**what would change its mind.** That last line is the contract: if you produce it,
the answer changes.

### RFC 1 — Is 491 components right, or is it too many?

**Current answer:** breadth is deliberate. A catalog that covers what real
applications need means fewer escapes into bespoke markup.

**The doubt:** mature systems settle at 100–200 components, and they get there by
subtraction after production use. Lily arrived at 491 by construction, without that
pressure. [COMPARISONS.md](COMPARISONS.md) shows the gap plainly. Breadth may be
diluting depth — and depth is what an accessible component actually needs.

**Changes my mind:** a credible account of which components are load-bearing and
which are noise, especially from someone who has pruned a real catalog. Or evidence
that the long tail is never used.

### RFC 2 — Is cross-framework parity worth what it costs?

**Current answer:** yes. One organisation, several stacks, one contract — the same
slugs, the same class hooks, the same keyboard behaviour in seven frameworks.

**The doubt:** parity costs 7× on every change and forces the lowest common
denominator across framework idioms. Maybe almost nobody has this problem, and
those who do would rather have one framework done excellently.

**Changes my mind:** either "we have this exact problem and Lily solves it", or
"we have this problem and solved it differently for less". Both are useful; the
second more so.

### RFC 3 — Was replacing the native `<select>` with a hand-rolled listbox a mistake?

**Current answer:** the preference helpers use an icon button opening a WAI-ARIA
APG listbox, because a single glyph is the smallest footprint a page-header control
can have.

**The doubt:** this is the question that most deserves an outside answer. A native
`<select>` gets platform keyboard semantics, mobile pickers, and screen-reader
behaviour for free, and those are *better* on mobile than anything hand-rolled. The
project traded them for visual control and now hand-maintains typeahead, PageUp,
focus return, and clamping in seven frameworks — and has already shipped several
defects in exactly that code. The cost is documented in each package's
`docs/accessibility.md`, which is the honest thing to do about a decision that may
simply be wrong.

**Changes my mind:** mobile screen-reader testing showing the listbox is worse than
a `<select>` in practice, or a strong argument that a header control does not need
to be a single glyph. History: radio group → native `<select>` → icon button +
listbox, so this has moved before and can move again.

### RFC 4 — Are these the right five helpers?

**Current answer:** `theme-picker`, `locale-picker`, `text-size-picker`,
`share-picker`, `date-time-picker`.

**The doubt:** three own a preference, one owns an action, one owns a form value.
That is not a coherent category — [AGENTS/helpers.md](AGENTS/helpers.md) has been
widened twice to keep the definition true, which is usually a sign the definition is
wrong. And the set may simply be the wrong five: no combobox, no file upload, no
table sort.

**Changes my mind:** a helper you needed and had to build yourself, or a principled
line between "helper" and "component" that the current set violates.

### RFC 5 — Does a five-way license choice help or confuse?

**Current answer:** MIT, Apache-2.0, GPL-2.0-only, GPL-3.0-only, or BSD-3-Clause,
at the adopter's option ([LICENSE.md](LICENSE.md)).

**The doubt:** a disjunction is maximally permissive in theory and can read as
ambiguity in practice. Some corporate legal reviews prefer one obvious answer, and
"pick any of five" may cost more review time than plain MIT would. Apache-2.0 alone
would also pair better with a trademark policy, which matters because Lily™ is a
claimed mark.

**Changes my mind:** anyone whose legal review actually stalled on this. That is a
fact I cannot get any other way.

### RFC 6 — Are 45 reference themes useful, or should this be a token system?

**Current answer:** ship complete stylesheets targeting the class hooks, and let
`theme-picker` swap them at runtime.

**The doubt:** every serious design system converged on design tokens plus a build
step. Lily's `ThemeProvider` gestures at tokens but the themes are hand-written CSS,
so they cannot be composed, extended, or consumed by design tooling — no Figma
library, no Style Dictionary output, nothing a designer can use.

**Changes my mind:** a designer telling me what they actually need from this layer,
or an adopter who wanted to extend a theme and could not.

### RFC 7 — Do 80 national identifier components belong in a general design system?

**Current answer:** yes — they encode real validation knowledge across 30+
countries, and nothing else in the field covers this.

**The doubt:** they are 16% of the catalog and serve a narrow audience. They might
be a separate library that Lily depends on, rather than part of it. There is also a
correctness risk: identifier rules change by legislation, and a wrong checksum
shipped as a component is worse than no component.

**Changes my mind:** someone from any of those countries telling me the
implementation is wrong — or that a UI library has no business asserting these rules
at all.

### RFC 8 — Is "copy the markup" the right primary path?

**Current answer:** the website leads with copying markup, not installing a package.
Zero dependencies, zero build, works anywhere.

**The doubt:** copies do not receive fixes. An accessibility defect found in 2027
never reaches anyone who copied in 2026 — which, for a project whose whole argument
is accessibility, may be self-defeating. shadcn/ui made the same bet and built real
tooling around it; Lily has not.

**Changes my mind:** evidence either way from people who actually copied.

### RFC 9 — Is targeting AAA honest, or should the target be AA?

**Current answer:** WCAG 2.2 AAA is the stated target; automated baselines run AA
rule sets; no audit has occurred, and the project is careful to say "targets"
rather than "compliant".

**The doubt:** AAA is not achievable for all content and the WCAG authors say so.
Claiming it as a target may read as either aspirational marketing or naivety to
exactly the specialists whose respect matters most. AA, verified, might be worth
more than AAA, aspired to.

**Changes my mind:** an accessibility professional saying which framing they would
trust.

### RFC 10 — Is the documentation structure serving anyone?

**Current answer:** four layers — `spec/` topic docs, `AGENTS/` rules, a
per-component directory with five files each, and the website.

**The doubt:** roughly 11,000 markdown files. It is written substantially for AI
coding agents, and it is fair to ask whether a human ever finds what they need. The
per-component `index.md` / `README.md` / `AGENTS.md` / `CLAUDE.md` / `spec/index.md`
convention may be four files of ceremony around one file of content.

**Changes my mind:** anyone describing what they went looking for and did not find.

### RFC 11 — Is the AI disclosure the right shape?

**Current answer:** [AI_STATEMENT.md](AI_STATEMENT.md) discloses agentic AI use in
full, with limitations stated.

**The doubt:** no settled convention exists. The disclosure may be too long to read,
or in the wrong place, or may cost adoption in organisations with AI policies — or
may not go far enough for organisations with stricter ones.

**Changes my mind:** an evaluator saying what their supplier review actually needed.

### RFC 12 — Is the suffix-to-element mapping too rigid?

**Current answer:** the slug suffix fixes the root element — `-button` →
`<button>`, `-list` → `<ol>`, `-picker` → `<div>` — which makes 491 components
predictable without reading 491 documents.

**The doubt:** it has already generated exceptions (gantt tables use raw HTML
element names; `-list` is `<ol>` except where it is `<ul>`). A convention accreting
exceptions is a convention under strain.

**Changes my mind:** a case where the mapping forced markup that was actually wrong.

## Settled — please do not reopen

These have been decided, the reasoning is written down, and reopening them costs
time better spent above. If you think one is wrong, you will need evidence rather
than preference.

| Decision | Where the reasoning lives |
| --- | --- |
| The headless layer ships **no CSS** | [AGENTS/headless.md](AGENTS/headless.md) |
| **No hardcoded user-facing strings**, ever, including English defaults | [AGENTS/internationalization.md](AGENTS/internationalization.md) |
| **No CSS framework dependency** — no Tailwind, DaisyUI, Bootstrap | [AGENTS/headless.md](AGENTS/headless.md) |
| **Semantic HTML before ARIA** | [AGENTS/accessibility.md](AGENTS/accessibility.md) |
| The radio-group picker markup **is not coming back** | [AGENTS/helpers.md](AGENTS/helpers.md) |
| **Svelte is canonical** for the helper catalogs | [AGENTS/helpers.md](AGENTS/helpers.md) |
| Components own **no data fetching, routing, persistence, or animation** | [AGENTS/headless.md](AGENTS/headless.md) |
| Applying a preference is **idempotent** | [spec/helpers/index.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/helpers/index.md) |

## What happens to your answer

Every response is read. Responses that change something are recorded where the
decision lives — the relevant `AGENTS/` rule or `spec/` topic — and summarised in
[CHANGELOG.md](CHANGELOG.md), which is where this project explains its reasoning at
length, including when it was wrong before.

If your answer does not change anything, you will be told why. Silence is not a
response this project intends to give.

## What is not up for comment

The [Code of Conduct](CODE_OF_CONDUCT.md), and the position that accessibility is a
requirement rather than a feature to be traded away. Everything else is arguable.

---

Lily™ and Lily Design System™ are trademarks.
