# Lessons from a survey of 18 design systems (planned work)

## Summary

Fifteen improvements to Lily, notes for eight existing tasks, and a list of what is not adopted, proposed 2026-11-03 from a
survey of 18 design systems Lily had not reviewed in depth: headless libraries (React Aria, Base UI, Angular Aria),
accessibility-led and white-label libraries (Cauldron, Lion, KoliBri), eight public-sector systems,
and product systems (Primer, Polaris, EUI, PatternFly). Items 1 to 4, 6, 14 and 15 are built or under way (status in the tasks); the rest are open. The tasks are
[tasks.md Phase 23](../../tasks.md#phase-23--design-system-survey-2026-11-03).

The main finding: **the strongest systems ship proof tools to their consumers, not only components.** React Aria ships
pattern testers, EUI and Aksel ship lint rules, Aksel and PatternFly ship codemods, and NL Design System publishes the
evidence each component has earned. Lily has many of these as internal `bin/check-*` gates and almost none as something an
adopter can run. Its biggest open problem, eight catalogs drifting apart, is also the one a shared pattern tester helps most.

## Scope

### In scope

The items below, each with a source, what Lily does today, a proposal and a check.

### Explicitly out of scope

- New components, apart from one decision (item 14). This agrees with the roadmap's "proof before breadth".
- Systems already covered by a lessons topic: Bootstrap, daisyUI, ShardsUI, coss ui, chanhdai, DHCW.
- Copying code. NL Design System and KoliBri are EUPL-1.2 and Cauldron is MPL-2.0, so only their ideas are used here.

## Limits of the review

Read on 2026-11-03, through a summarising reader or the GitHub API, so check the live page before quoting anything.

| System            | Read                                                                               | Not read, or not confirmed                                                                |
| ----------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| React Aria        | Testing page; `@internationalized/date` README                                     | Release notes for 1.19 and 1.20 came from search results and a draft docs file            |
| Base UI           | Quick start, styling handbook                                                      | Per-component API pages                                                                   |
| Angular Aria      | Overview page                                                                      | Stability: the page says only "New". The v21 announcement called it a developer preview   |
| Cauldron          | README, component directory listing, licence                                       | The docs site returned only its title, so its accessibility guidance was not read         |
| Lion              | README, form overview, validation page, component listing                          | Formatting and parsing pages                                                              |
| KoliBri           | README, Definition of Done, CVE overview, docs and package listings                | Whether a missing `_label` fails at run time; its framework adapters; its tag transformer |
| NL Design System  | Relay model, Definition of Done, Baseline, `candidate` README                      | Who approves a stage: the relay page names no decision body                               |
| Aksel             | Component index, stylelint page, MCP page, validation pattern, CLI README          | v8 migration guide                                                                        |
| Designsystemet    | Root and `web` package READMEs, colour page                                        | Patterns; its colour-scale generator; governance                                          |
| Suomi.fi          | `suomifi-ui-components` README                                                     | The design-system site                                                                    |
| UAE Design System | Getting-started page, npm listing, repository licence                              | **RTL support**: no page read mentions it, so it is unverified                            |
| UX4G              | Repository metadata; search results                                                | Its `llms-full.txt` returned 403                                                          |
| GOV.CO (Colombia) | Search results only (Kit UI 9.2, the `govco-collection-webcomponents` npm package) | The Kit UI PDF and any licence                                                            |
| Diia (Ukraine)    | Search results only                                                                | No open UI design system found: `@diia-inhouse/design-system` is backend protobuf         |
| Primer            | Component lifecycle guide                                                          | Accessibility annotations: the fetched page did not cover them                            |
| Polaris           | README via search; InfoQ report, October 2026                                      | Shopify's own docs                                                                        |
| EUI               | ESLint plugin README headings; Kibana's accessibility docs via search              | Each rule's detail                                                                        |
| PatternFly        | Upgrade pages via search                                                           | Whether it has a lint plugin                                                              |

**Searched and not found:** an open government UI design system from Nigeria, Kenya, South Africa or Rwanda (three
searches, English only), and Saudi Arabia's "Platforms Code". Absence from a search is not proof of absence.

Not reviewed: Headless UI, Kobalte, Reka UI, Spartan, Mantine, Vaadin, Nord, Orbit, Paste, Gestalt, Clarity.

Browser-support statements are the weakest evidence here. `focusgroup` in Chrome 150 rests on a secondary blog post
and an Intent to Ship; the Chrome Platform Status page did not render. MDN states `closedBy` is not Baseline.

## What Lily already matches

| They do                                                                                                   | Lily today                                                                                                                |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| NL Design System's Baseline names the six browser and screen-reader pairings; Suomi.fi publishes a matrix | [screen-reader matrix](../../docs/screen-reader-matrix.md) has the same six pairings. Lily's is **empty**: 0 of 120 cells |
| Status by evidence (NL relay model, Primer lifecycle)                                                     | `stable` 151, `beta` 444, `experimental` 11, `discouraged` 1, promoted by evidence ([components](../components/index.md)) |
| Light DOM welcomed by Polaris developers                                                                  | Web Components catalog is light-DOM only                                                                                  |
| Designsystemet: "Use native elements"; `command` and `popover`                                            | Native `<dialog>` and Popover API, recorded in [native-primitives.tsv](../competitive-position/native-primitives.tsv)     |
| Web components as the framework-neutral base (KoliBri, Lion, Polaris, Designsystemet)                     | Eight catalogs, with Web Components as one. Polaris archiving its React library shows the cost of a single-framework bet  |
| Docs as Markdown and `llms.txt` (Base UI, Aksel, Designsystemet)                                          | `.md` twins, `/r/{slug}.json`, root and site `llms.txt`                                                                   |
| Duplicate registration guard                                                                              | `customElements.get` in 575 Web Components files                                                                          |

## The items

### 1. One set of pattern testers, run against every catalog

**Source.** React Aria's `@react-aria/test-utils` (release candidate): `createTester("Table", { root })` returns an object
with methods for a pattern, for CheckboxGroup, ComboBox, Dialog, GridList, ListBox, Menu, RadioGroup, Select, Table, Tabs and
Tree. Its docs advise querying by role, because ARIA semantics change less often than DOM structure.

**Lily today.** Each catalog hand-ports its own keyboard tests. [Lily Core](../../docs/core.md) criterion (a), keyboard and
ARIA-state tests in all eight libraries, is met by **3 of 40** candidates. P22-T32 found up to 227 Angular and 211 Blazor
components that differ from Svelte at the root.

**Proposal.** A framework-neutral package of DOM-level testers (listbox, combobox, menu, tabs, dialog, tree, grid first) that
takes a root element and drives the APG contract with real events. Lily's own suites call it first, in each catalog; publish it
once that has proved it. Adopters then test their composed pages with the tool Lily uses.

**Check.** The same tester passes in all eight catalogs for a pattern; removing `aria-selected` from any one port fails it. Core
criterion (a) rises.

### 2. Warnings during development

**Source.** Designsystemet's web package warns "about deprecations and missing attributes", and `window.dsWarnings = false`
turns it off. Primer shows a warning when a deprecated component is used.

**Lily today.** No `console.warn` or `console.error` in the components of the Svelte, React, Vue, Angular, HTML or Web Components
headless catalogs. A required `label` is a type, so nothing catches a missing one in HTML, Nunjucks or Alpine, or in untyped
code. The failure is silent, and for an icon button it means a control with no accessible name.

**Proposal.** A small development-only check: missing accessible name, missing required prop, deprecated component. Silent in
production builds, with a documented off switch. Messages are for developers, so the no-hardcoded-strings rule does not apply.
Pilot on `icon-button` in Svelte, then the interactive components with a required `label`.

**Check.** A test per pilot component: a missing label warns, a production build emits nothing, and the bundle does not grow in
production.

### 3. A Content Security Policy contract

**Source.** Base UI ships a CSP Provider.

**Lily today.** No file in `spec/`, `AGENTS/` or `docs/` mentions CSP. The no-flash snippet (P22-T2) is an inline `<script>`, and
12 Svelte headless components write a `style=` attribute. A strict policy blocks both unless hashed, nonced or relaxed.
Style set through the CSSOM is not blocked, so some of these may need only a small change. Public-sector adopters are the
likeliest to run strict policies, and they are Lily's main audience.

**Proposal.** Run one example app under `default-src 'self'` with no `unsafe-inline`, record every violation, then fix or
document each: CSSOM instead of attributes where possible, a `nonce` prop where not, the snippet's hash in the docs.

**Check.** An e2e with the policy set that fails on any `securitypolicyviolation` event.

### 4. Finish the lifecycle: deprecated, discouraged, and evidence of real use

**Source.** NL Design System's relay model has four stages, Help Wanted, Community, Candidate and Hall of Fame, plus
**Discouraged**, for components that user research or accessibility guidance argues against, naming an alternative. Hall of
Fame needs production use at "ten minste twee verschillende organisaties" and an audit. Its Definition of Done has 74 items
(12, 15, 26, 21) across accessibility, tests, docs, tokens and usage, each cumulative. Primer has Experimental, Ready, Deprecated;
Aksel keeps deprecated components in their own visible group.

**Lily today.** Three statuses, none for the end of a component's life. `docs/releasing.md` covers a broken published
version, not a superseded component. The notice period in [competitive-position item 10](../competitive-position/index.md) is
unwritten. Production reports "accelerate promotion" but are not required.

**Proposal.** Add `deprecated` (with replacement and removal version) and `discouraged` (with reason, evidence and
alternative). Add a production-use line to the status evidence: a public, opt-in list of adopters per component. Publish
a per-status checklist. Audit `carousel`, `toast` and `accordion-checkbox` first as `discouraged` candidates; do not mark
anything without a cited reason. Do not rename existing statuses.

**Check.** `bin/test` fails on a `deprecated` or `discouraged` status with no alternative, and `bin/generate-api-docs` shows the
status on the site page.

### 5. A written browser and assistive-technology baseline

**Source.** NL Design System's Baseline: versions come from RUM Archive usage data; a feature marked "Widely available" may be
used; "Newly available" needs a working alternative that is itself Baseline; support reaches back 30 months.

**Lily today.** Features are chosen case by case. Applying NL's rule shows the risk: CSS anchor positioning went Baseline in
January 2026 and the themes rely on it, and the Popover API was Baseline in 2025. Neither is "widely available" yet.

**Proposal.** A `## Baseline` section in [testing](../testing/index.md): the supported browser window, the six pairings, and a
rule that a "newly available" feature needs a named fallback or a recorded exception. Add a column to
`native-primitives.tsv`.

**Check.** `bin/check-native-primitives` fails on a newly available feature with neither a fallback nor an exception.

### 6. Non-Gregorian calendar grids

**Source.** React Aria's `@internationalized/date` covers 13 calendar systems, including Buddhist, Islamic and Persian.

**Lily today.** P17-T1 forced the date picker to Gregorian as an interim fix and left the `calendar` prop open. The worldwide
rule accepts a documented gap, but people in Iran, Afghanistan, Thailand, Ethiopia and other places use another civil or religious calendar in daily life.

**Proposal.** Finish P17-T1: decide how to add a `calendar` prop (CLDR id) to `date-time-picker` and `calendar`. The options: depend on
`@internationalized/date`, which is the shortest path but **Apache-2.0, which the FSF treats as incompatible with the
GPL-2.0-only option in Lily's licence expression**; use `Temporal` where available (support not checked here); or write
a small module in `shared/`, the highest risk, since calendar arithmetic is easy to get subtly wrong.

**Check.** A recorded decision. If built, grid tests for Persian, Islamic and Buddhist months, in every catalog that has the
picker.

### 7. Lint rules adopters can run

**Source.** `@elastic/eslint-plugin-eui` has more than 20 rules, among them `no-unnamed-interactive-element`,
`no-nested-interactive-element`, `require-table-caption` and `tooltip-focusable-anchor`; Kibana requires them resolved before
commit. Aksel's stylelint plugin has six, among them `design-token-exists`, `no-internal-tokens` and `no-deprecated-classes`.

**Lily today.** Many `bin/check-*` gates, for this repository only. An adopter's mistakes surface in an axe run, if at all.

**Proposal.** One framework-neutral rule core over rendered HTML, the same one the MCP server's `check_markup` needs (P22-T19),
so it is built once. Start with five markup rules and two stylelint rules: unknown `--lily-*` token and retired class hook.
Package it after the first rules prove useful on the example apps.

**Check.** Each rule has a passing and a failing fixture, and the eight example apps are clean.

### 8. Rename data and a small codemod

**Source.** `npx @navikt/aksel codemod v8-tokens`, and `npx @patternfly/pf-codemods@latest <path>`, whose output reads like a
lint report and says what it could not fix.

**Lily today.** Names have churned: the pickers were renamed four times. P22-T23 will rename state attributes and P22-T16 adds
new ones, and class hooks are "stable contracts".

**Proposal.** One `renames.json` of old name, new name, kind and version, recorded with each rename. A small codemod and the
retired-hook lint rule both read it. Build it when P22-T23 lands, not before: no renames, no need.

**Check.** A fixture project migrates cleanly, and a name with no mechanical replacement is reported, not guessed.

### 9. A form-validation pattern, and a decision on `error-summary`

**Source.** Aksel's validation pattern: first validate on submit; then text fields on blur and choices on change; no message
changes while typing unless input is clearly invalid; do not disable submit; one field needs no summary, so focus the field.
On the summary it is explicit: move focus to it **rather than** using `role="alert"` or `aria-live`, and not both. Lion separates
`hasFeedbackFor` (is it invalid) from `showsFeedbackFor` (is the message visible), and has error, warning, info and success.

**Lily today.** `error-summary` has **both** `role="alert"` and `tabindex="-1"`, and [theme](../theme/index.md) says to move
focus to it. GOV.UK also combines them, with `role="alert"` in a child and a comment about a race condition, so the two
systems disagree. Lily has no validation pattern page and no warning state for a field.

**Proposal.** Settle `error-summary` by testing on the screen-reader matrix, not by reading: its row exists to answer this. Write
`docs/patterns/form-validation.md` with the timing rules, cited, and a non-blocking warning as hint text. Lily stays out of
validation logic.

**Check.** A recorded result per pairing, and an e2e of the pattern in one example app.

### 10. Native gaps: `closedby`, `focusgroup`, and the `details` bug

**Source.** Designsystemet's web package polyfills `closedby`, `command`, `popover` and `focusgroup`, and reports a Firefox plus
TalkBack bug where `details` and `summary` announce state and role wrongly.

**Lily today.** No `closedby` in the Svelte or HTML catalogs, no `focusgroup` in any spec, and 45 Svelte headless components mention
`tabindex`. `shared/` holds the navigation logic.

**Proposal.** Add both to `native-primitives.tsv` as **watch**, not adopt: `closedBy` is not Baseline, and `focusgroup` seems
to be in one engine with Mozilla positive and WebKit raising concerns. Do not take a polyfill for a spec still moving; the
hand-written logic is tested. Separately, reproduce the TalkBack bug and, if it is real, add it to the known limitations of
every `details`-based component.

**Check.** The rows exist with a dated status, and the bug has a recorded result.

### 11. Security and privacy notes where a component holds sensitive data

**Source.** NL Design System's Hall of Fame docs must state security and privacy risks.

**Lily today.** 164 national-identifier components, plus password, one-time-password and chat ones. Identifier inputs set
`autocomplete="off"`, and 102 component docs mention privacy or sensitivity, but no doc has a dedicated section, and logging,
masking and storage have no standard advice. This is the data with the most harm if mishandled.

**Proposal.** An optional `## Security and privacy` section, required for those components, generated from one shared text for
the identifier family and written by hand elsewhere.

**Check.** `bin/test` fails when a listed component lacks the section.

### 12. Close the regional theme gaps

**Source.** Public-sector licences read for this survey; see
[theme](../theme/index.md#candidates-read-2026-11-03-p23-t12).

**Lily today.** 14 public-sector themes, with none from the Arab world, Africa, Spanish-speaking Latin America or the Nordics.

**Proposal.** Build a UAE theme first, because it is MIT and fills the largest gap; verify RTL first. Designsystemet (Norway) is
second. Keep Colombia and India open until a licence is read. Record the African gap as open, and ask a person: a search in
English is weak evidence, and an African public body may publish in other places or languages.

**Check.** `bin/check-theme` and `themes/references.tsv` for each built theme; a dated row per declined one.

### 13. Spike Angular Aria for the Angular catalog

**Source.** `@angular/aria`: headless directives for Autocomplete, Listbox, Select, Multiselect, Combobox, Menu, Menubar,
Toolbar, Accordion, Tabs, Tree and Grid.

**Lily today.** Angular's keyboard behaviour is hand-written, reached the 23 keyboard components only on 2026-10-22, and is the
catalog with the most drift (P22-T32). It meets Core criterion (a) on 11 of 40. Its peer range is `>=20 <23`.

**Proposal.** A one-component spike on `tree` or `combobox`, measuring lines removed, tests kept, bundle change and the effect
on the peer range. This pulls against the shared machine in [competitive-position item 3](../competitive-position/index.md), so
decide after the spike. The argument for it: it is the Angular team's own code, in a catalog with a lot of drift. The argument
against: a dependency that may not be stable, and a different engine from the other catalogs.

**Check.** A recorded decision with the numbers.

### 14. Decide on IBAN

**Source.** Lion ships `input-iban`. **Lily today.** No IBAN component, though `currency-input` and 164 national identifiers
exist. IBAN is an ISO standard used across many countries, a better fit for "worldwide" than most single-country identifiers,
and it has a real checksum. **Proposal.** A maintainer decision on `iban-input` and `iban-view`. Moving the catalog count
touches every hard-coded 607, and it should wait for proof work. **Check.** A recorded decision.

### 15. Fix the summary card pattern's hidden text

**Source.** Found while checking Cauldron's `Offscreen` against Lily's catalog.

**Lily today.** The summary card pattern in `AGENTS/components.md` and the usage example in `components/warning-text/index.md` use
`class="visually-hidden"`. **No theme and no stylesheet template defines it** (two example apps define their own), so with a
reference theme alone the text is visible. All 63 themes define `.screen-reader-span`, and that component exists.

**Proposal.** Use `ScreenReaderSpan` in both. Then run `bin/sync`, since `AGENTS/` is copied, and `bin/generate-examples`, since
usage examples come from the docs.

**Check.** `grep -rln 'class="visually-hidden"' AGENTS components/*/index.md` finds nothing.

## Notes for existing tasks

| Task                                     | Add from this survey                                                                                                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P22-T11 whole-card link                  | Designsystemet's `data-clickdelegatefor` is a behaviour-based alternative to a stretched link; compare the two with a keyboard and a screen reader.                                                                  |
| P22-T15 theme generator                  | Designsystemet's flow is config file, CLI, CSS, with the Theme Builder only producing the config. Make the config the contract, so the site page and a CLI share it.                                                 |
| P22-T16 variant vocabulary               | Designsystemet sorts components into Explicit, Neutral and Cascading by how `data-color` applies, and `data-color-scheme` works on any element. Borrow the three groups; they say which components a colour reaches. |
| P22-T17 per-page AI links                | Base UI and Aksel confirm the plain "View as Markdown" link. `Accept: text/markdown` negotiation is not possible on GitHub Pages; use `.md` URLs.                                                                    |
| P22-T19 read-only MCP server             | Aksel's five tools are a good first shape: find docs, get doc, get component info, get token details, find icons. Add an `llm.md` fallback for when the server cannot be reached, and pair it with a skill.          |
| P22-T23 state attribute vocabulary       | Base UI adds `data-starting-style` and `data-ending-style`. Prefer native `@starting-style` and `transition-behavior: allow-discrete` for the top layer; only a non-native popup would need the attributes.          |
| P22-T26 positioning variables            | Base UI's names: `--available-height`, `--anchor-width`, `--transform-origin`. Reuse them, so adopters moving from Base UI have nothing new to learn.                                                                |
| P16 support policy (competitive item 10) | KoliBri's alternating LTS and STS is not realistic for one maintainer; see Not adopted. Its per-major CVE table, though, is cheap honesty worth copying.                                                             |

## Not adopted

- **An unversioned CDN script.** Polaris's `s-*` elements load from Shopify's CDN, and a Shopify forum developer called having
  no way to pin a version "a nightmare for stability". Lily stays on pinned packages.
- **Three-year LTS lines (KoliBri).** It needs a team. Lily plans to support the latest minor until 1.0.
- **Success messages that vanish (Lion, 3000 ms by default).** A timed message conflicts with the AAA target.
- **Layout primitives (Aksel's `HStack`, `VStack`, `Box`, `Bleed`).** They take spacing props, which the headless layer cannot
  hold. Themes and consumer CSS do this.
- **A single shared tooltip element from `data-tooltip` (Designsystemet).** The picker tooltip contract is deliberate, and
  writing `aria-label` automatically would hide a missing name, which item 2 wants to surface.
- **Portals (Base UI).** The top layer makes them unnecessary for `dialog` and `popover`.
- **`Accept` negotiation for Markdown.** The docs site is static.
- **A Tailwind base (UAE).** Lily takes tokens from it, never the dependency.
- **A hard "two organisations" rule for `stable`.** Lily records no named adopters yet, so it would empty `stable` and say
  nothing useful. Record use; do not gate on it until adopters exist.

## Priority

Advice, in order. The first four are the ones to do even if nothing else here happens.

1. **Item 15 now.** Under an hour, and a real documentation defect.
2. **Item 1, the pattern testers.** The highest value here. Lily's largest risk is parity across eight catalogs, this tackles it
   directly, and it moves Core criterion (a) from 3 of 40. Start with listbox, which already has one shared machine.
3. **Item 2, development warnings.** Cheap, and it is the only protection Lily can give users of its untyped catalogs.
4. **Item 3, CSP.** Unknown size, so measure first. A blocked public-sector adopter is the worst way to find out.
5. **Items 9 and 4.** Both are mostly writing and decisions. Item 9 needs the screen-reader matrix (P16-T9), which remains the
   most important open task in the repository: no lint rule or checklist here replaces it.
6. **Items 5, 11, 10, 12.** Policy and evidence, with no dependencies. Item 12 serves the worldwide rule.
7. **Items 7 and 8 after P22-T19 and P22-T23.** Item 7 shares its core with the MCP server; item 8 is only useful once
   renames exist.
8. **Items 6, 13, 14 are decisions.** Item 6 matters most, and has a licence question to settle first.

## Acceptance criteria

- [ ] Each item above is done, or carries a recorded decision not to do it, in tasks.md Phase 23.
- [ ] The notes for existing tasks are folded in when those tasks are picked up.
- [ ] Every statement in Limits of the review marked unverified is re-checked before it is relied on in a release.
- [ ] No EUPL or MPL code is copied into Lily.

## Related topics

- [competitive-position](../competitive-position/index.md) — Lily Core, the shared behaviour core, the support policy
- [testing](../testing/index.md) — where the baseline and pattern testers belong
- [accessibility](../accessibility/index.md) — the WCAG target and the screen-reader evidence
- [theme](../theme/index.md) — the adopt-or-decline table for public-sector systems
- [internationalization](../internationalization/index.md) — the worldwide rule, calendars
- [national-identifiers](../national-identifiers/index.md) — the components item 11 covers first
- [citations](../citations/index.md) — design systems Lily learns from

## Sources

- [React Aria testing](https://react-aria.adobe.com/testing), [`@internationalized/date`](https://github.com/adobe/react-spectrum/tree/main/packages/%40internationalized/date)
- [Base UI quick start](https://base-ui.com/react/overview/quick-start), [Base UI styling](https://base-ui.com/react/handbook/styling)
- [Angular Aria overview](https://angular.dev/guide/aria/overview), [Angular v21 announcement](https://blog.angular.dev/announcing-angular-v21-57946c34f14b)
- [Deque Cauldron](https://github.com/dequelabs/cauldron), [Lion](https://github.com/ing-bank/lion), [Lion validation](https://lion.js.org/fundamentals/systems/form/validate/)
- [KoliBri](https://github.com/public-ui/kolibri)
- [NL Design System relay model](https://nldesignsystem.nl/handboek/estafettemodel/), [Definition of Done](https://nldesignsystem.nl/handboek/estafettemodel/componenten/definition-of-done/), [Baseline](https://nldesignsystem.nl/baseline/), [candidate repository](https://github.com/nl-design-system/candidate)
- [Aksel components](https://aksel.nav.no/komponenter), [validation pattern](https://aksel.nav.no/monster-maler/soknadsdialog/monster-for-skjemavalidering), [stylelint](https://aksel.nav.no/grunnleggende/kode/stylelint), [MCP server](https://aksel.nav.no/grunnleggende/kode/mcp-server), [repository](https://github.com/navikt/aksel)
- [Designsystemet](https://github.com/digdir/designsystemet), [`designsystemet-web`](https://github.com/digdir/designsystemet/tree/main/packages/web), [colours](https://www.designsystemet.no/en/fundamentals/code/colors)
- [suomifi-ui-components](https://github.com/vrk-kpa/suomifi-ui-components), [UAE Design System](https://designsystem.gov.ae/docs/getting-started), [aegov-dls](https://github.com/TDRA-ae/aegov-dls), [UX4G](https://ux4g.gov.in/)
- [GOV.CO web components](https://www.npmjs.com/package/govco-collection-webcomponents), [Diia open source](https://opensource.diia.gov.ua/en.html)
- [Primer lifecycle](https://primer.style/guides/component-lifecycle), [InfoQ on Shopify web components](https://infoq.com/news/2026/10/shopify-web-components), [Polaris README](https://raw.githubusercontent.com/Shopify/polaris/HEAD/README.md)
- [EUI ESLint plugin](https://www.npmjs.com/package/%40elastic/eslint-plugin-eui), [PatternFly upgrade guide](https://www.patternfly.org/releases/upgrade-guide)
- [Scoped focusgroup explainer](https://open-ui.org/components/scoped-focusgroup.explainer/), [Chrome focusgroup feedback request](https://developer.chrome.com/blog/focusgroup-rfc), [MDN `closedBy`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy)
- [GOV.UK error summary template](https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/error-summary/template.njk)
- Lily: [Lily Core](../../docs/core.md), [screen-reader matrix](../../docs/screen-reader-matrix.md), [tasks.md](../../tasks.md)

---

Lily™ and Lily Design System™ are trademarks.
