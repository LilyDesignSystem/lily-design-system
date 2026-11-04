# Competitive position: closing the gaps COMPARE.md names (planned work)

## Summary

Eleven improvements to Lily, proposed 2026-10-29 from a review of where the alternatives are stronger. The starting point
is the table in [COMPARE.md](../../COMPARE.md) §"Where the alternatives are stronger", which names seven reasons to pick
something else. Each row was checked against what the named competitors ship today (October 2026) and against Lily's tree
on the same day.

The finding: the seven rows share one root cause. **Competitors win on evidence, and Lily wins on breadth.** Radix, Base
UI, Ark UI and React Aria are trusted because their behaviour has been exercised for years. React Aria names the screen
readers it tests with, Carbon and USWDS publish conformance material, and shadcn turned copying into tooling. Lily has
609 components × 8 frameworks, so every unit of proof costs it more than it costs them. The improvements therefore do
not add breadth. They:

1. Make proof cheaper: one behaviour core, plus browser-native primitives that the browser vendors already test.
2. Concentrate proof on a named core tier.
3. Adopt the competitors' own standards (the shadcn registry schema, DTCG 2025.10, VPAT/ACR) rather than building
   rivals to them.

Status (2026-10-30): items 1, 2, 6, 7 and 11 are done; 3, 4, 5 and 10 are partly done; 8 is a draft and 9 needs a person
with a screen reader. Per-task detail is in [tasks.md](../../tasks.md) Phases 16 and 18. Core has **no members yet**,
which is the honest result while the screen-reader matrix is empty: `bin/generate-core` reports 40 candidates, criterion
(a) met by 3, (b) by 38 (since Firefox and WebKit joined every example app's e2e, P18-T1), (c) by 0. The native-platform
audit stands at 52 components: 25 native, 18 hand-rolled with a reason, 9 candidates (`bin/check-native-primitives`).

## Scope

### In scope

The eleven items below, mapped to the COMPARE.md row each one answers, and what is deliberately not adopted.

### Explicitly out of scope

- **Handing users a finished visual design.** The "ship a good-looking app this week" row is a deliberate trade-off
  ([theme](../theme/index.md)). The starters in [bootstrap-lessons](../bootstrap-lessons/index.md) and the token-only
  themes in [daisyui-lessons](../daisyui-lessons/index.md) are the planned answer, and this topic adds nothing to them.
- **A vendor relationship or SLA.** One unpaid maintainer cannot offer one. Item 10 makes the support that does exist
  explicit; it does not pretend to be a contract.
- **New catalog rows.** Every item here deepens existing components.

## Limits of the review

- **Read on 2026-10-29:**
  - search results and release notes for shadcn CLI 3 (namespaced registries, MCP server), Base UI 1.x, Ark UI and
    Zag.js, Web Awesome 3, React Aria's quality page, DTCG 2025.10, Penpot design tokens, and the NLnet NGI Zero
    Commons Fund;
  - Baseline status of CSS anchor positioning, customizable `<select>` and command invokers.
- **Not read:**
  - competitor source code;
  - the shadcn-svelte and shadcn-vue registry docs (item 5 must check them before it ports beyond React);
  - interest-invoker browser status;
  - the Sovereign Tech Agency's current programmes.
- **Third-party figures.** Version numbers and browser versions come from the cited pages and were not reproduced here.
  The sources disagree on some browser versions; the figures below are the ones web.dev and MDN give.

## The seven rows, today

| COMPARE.md row                    | State of the art (2026-10)                                                                                                                                                                                                                                                                                                                                    | Lily today (measured 2026-10-29)                                                                                                                                                                                                                                                                                                                 | Items      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Production-proven behaviour       | Base UI reached 1.0 in December 2025 (1.6.0 by June 2026; Accordion keyboard aligned with APG). Ark UI runs one Zag.js state machine per component under React, Solid, Vue **and Svelte**. React Aria names its matrix: NVDA with Firefox and Chrome, VoiceOver on iOS, TalkBack with Chrome. Popover API is Baseline 2025, anchor positioning Baseline 2026. | Keyboard logic is ported by hand to each framework; Angular reached the 23 keyboard components only on 2026-10-22 (P12-T4). The `shared/` modules cover typeahead and grid and overflow navigation, not the popup patterns. Svelte has 13 listbox, 16 menu and 5 tooltip components. 14 Svelte components use `popover`; none uses `commandfor`. | 1, 2, 3, 4 |
| Ship a good-looking app this week | DaisyUI, Flowbite, shadcn, Skeleton.                                                                                                                                                                                                                                                                                                                          | Out of scope (see above).                                                                                                                                                                                                                                                                                                                        | —          |
| A design language to adopt        | DTCG 2025.10 is the first stable format (Format, Color and Resolver modules). Penpot has native tokens with JSON import and export (whether its export is strict DTCG is disputed). Figma imports through Tokens Studio.                                                                                                                                      | `themes/tokens/*.json` follow 2025.10 for `color` (1,162) and `dimension` (341), but 114 tokens use a non-standard `$type: "fluidDimension"`. A strict parser rejects them. No Resolver document: 57 separate files.                                                                                                                             | 6          |
| Actual GOV.UK / NHS compliance    | govuk-frontend and nhsuk-frontend are maintained and audited by their owners.                                                                                                                                                                                                                                                                                 | Migration guides exist. No record of which upstream version each public-sector theme took its reference from, so drift is invisible.                                                                                                                                                                                                             | 11         |
| Vendor, SLA, support              | Commercial systems.                                                                                                                                                                                                                                                                                                                                           | No published support or deprecation policy beyond SECURITY.md.                                                                                                                                                                                                                                                                                   | 10         |
| Conformance statement / VPAT      | Carbon, Spectrum, USWDS publish conformance material.                                                                                                                                                                                                                                                                                                         | Accessibility statement and audit-readiness pack exist. All 20 rows of `docs/screen-reader-matrix.md` are empty. No ACR. 151 of 582 components are `stable`.                                                                                                                                                                                     | 2, 7, 8    |
| Copy-paste ownership              | shadcn CLI 3 installs from any namespaced registry (`@registry/name`) and ships an MCP server, so a third-party registry needs no CLI of its own.                                                                                                                                                                                                             | `/r/{slug}.json` exists for all 582 components, but in Lily's own schema (metadata and repo paths, no file contents). `lily add` is a proposal awaiting a decision (P10-T6).                                                                                                                                                                     | 5          |

COMPARE.md also has two factual problems. It says Ark UI supports "React, Vue, Solid", but Ark UI now ships Svelte too. It
says "nothing else in the table spans this range", but that holds only because Web Awesome is not in the table, and
custom elements work in every framework. Radix and React Aria are recommended in the prose but have no matrix column;
Base UI is absent entirely.

## The items

### 1. Correct COMPARE.md and widen the matrix

Fix the Ark UI framework list. Add Radix, Base UI, React Aria and Web Awesome columns to `compare/compare.tsv`, and
regenerate with `bin/generate-comparisons`. Restate difference 1 as what is true against Web Awesome. Lily's
components are framework-native rather than wrapped custom elements: no shadow DOM, server-rendered in Nunjucks and
Blazor without hydration, and one class contract across them. It is not that Lily is the only system usable everywhere.

- Answers: credibility of the whole page, which is Lily's main sales document.
- Check: `bin/generate-comparisons` prints the four new columns. COMPARE.md contains no claim that a column contradicts.

### 2. A named core tier with published proof

Name about 40 components "Lily Core": the interactive set in [audit-readiness tier 1](../../docs/audit-readiness.md)
(form family, the pickers, dialog, tabs, menus, accordion, pagination, sortable tables, skip link). Core is the only
tier COMPARE.md may call proven. A component enters Core only when all of these hold:

- keyboard and ARIA-state tests in all eight libraries;
- e2e in Chromium, Firefox and WebKit;
- its row of the screen-reader matrix filled for at least the combinations React Aria names, plus JAWS with Chrome and
  VoiceOver with Safari on macOS.

Publish a `/quality` page in the style of React Aria's quality page, generated from that data.

- Answers: production-proven behaviour and conformance.
- Check: a generator builds the Core list from the evidence, and `bin/test` fails if a Core component loses any of it.

### 3. One behaviour core, thin framework adapters

Ark UI gets parity across four frameworks because the behaviour lives once, in a Zag.js state machine, and each framework
binds it. Lily ports the behaviour eight times, and RFC 3 records that defects shipped in exactly that hand-ported code.

Extend `shared/` from navigation helpers to framework-free state machines or reducers for the hand-rolled popup and
composite patterns:

- listbox, menu and menubar;
- combobox;
- tabs;
- disclosure;
- dialog focus management;
- roving tabindex.

Each machine gets one test suite. Each library gets a thin adapter.

This is the delivery vehicle for P12-T10 (`@lilydesignsystem/core`) and P12-T11 (logic out of the monolithic helpers),
and the long-term fix for P12-T4.

- Answers: production-proven behaviour. One proof covers eight frameworks.
- Check: the listbox machine drives the Svelte and React listboxes, the existing tests pass unchanged, and both
  adapters are under 100 lines. Done, and extended 2026-10-29 (P18-T10) to Vue, Angular, HTML and Web Components;
  Blazor (C#) and Nunjucks (markup only) keep their own. Open: the menu, combobox, tabs, disclosure, dialog-focus and
  roving-tabindex machines.
- Needs a maintainer decision: the core-package question (P12-T10).

### 4. Platform first: use the primitives browsers already test

Audit the listbox, menu, tooltip, dialog and popover components for native replacements:

| Need                  | Native primitive          | Status                                         |
| --------------------- | ------------------------- | ---------------------------------------------- |
| Top layer and dismiss | Popover API, `<dialog>`   | Baseline                                       |
| Declarative opening   | `command` / `commandfor`  | Interop 2025                                   |
| Placement             | CSS anchor positioning    | Baseline January 2026                          |
| Styled select         | `appearance: base-select` | Chromium only, so progressive enhancement only |

Record the native primitive each component relies on in its `AGENTS.md` and its `/r/{slug}.json`. Prototype the
preference pickers as a native `<select>` that is enhanced with `base-select` where supported. That is the evidence
RFC 3 asks for: native mobile and screen-reader behaviour, without losing visual control where the browser allows it.

- Answers: production-proven behaviour. Behaviour delegated to the browser inherits the browser's testing.
- Check: every audited component records "native" or "hand-rolled because …". The RFC 3 prototype runs in the
  example apps with the `@supports` fallback.
- Status (2026-10-30): the audit is recorded for 52 components in `native-primitives.tsv`, each `AGENTS.md` and
  `/r/{slug}.json`, and checked by `bin/check-native-primitives`. Now native: the dialog family and drawer, sheet and
  slide-out-drawer (`showModal()`, P14-T4, P18-T6); popover, popup and contextual-help (P18-T8) and dropdown-menu,
  split-button, action-group and context-menu (P18-T11) on `popover="auto"` with `command`/`commandfor`. The 9
  remaining candidates are cascader, coachmark, combobox, floating-panel, hover-card, mentions-input, popconfirm-dialog,
  tooltip and tree-select. The `variant="select"` prototype is in all eight theme-pickers (P18-T12) and its e2e runs
  in the HTML example only, in Chromium and WebKit; Firefox, the engine without `base-select`, was not run.

### 5. A shadcn-compatible registry instead of a bespoke CLI

shadcn CLI 3 installs from any namespaced registry, so Lily can get shadcn's copy tooling, and its MCP discovery, by
publishing in shadcn's schema. Building `lily add` from scratch is not needed for that.

Emit `registry.json` and `registry-item` files with inlined file contents under `/r/react/`. Document
`npx shadcn add @lily/button`, and test it in CI against a scratch Next.js project. Then check whether shadcn-svelte and
shadcn-vue accept the same remote items, and add `/r/svelte/` and `/r/vue/` if they do. Keep the existing
`/r/{slug}.json` metadata files at their URLs.

This resolves P10-T6 as follows. Adopt the shadcn path for copying. Build only the part shadcn lacks, update tracking
(`lily outdated` / `lily diff`), and only if a user asks for it.

- Answers: copy-paste ownership.
- Check: `npx shadcn add` of three components (one with a dependency) into a scratch app builds and passes its tests in
  CI.
- Status (2026-10-30): `bin/generate-registries` writes the items to `lilydesignsystem.github.io/static/r/react/` (one
  per component plus helper modules); the `shadcn-registry` CI job exists in `.github/workflows/ci.yml` and was replayed
  locally, but no GitHub run is recorded. Svelte and Vue are not emitted.

### 6. Strict DTCG 2025.10 tokens

- Validate `themes/tokens/*.json` against the 2025.10 Format schema in `bin/test`.
- Move `fluidDimension` under `$extensions["com.lilydesignsystem"]` on a standard `dimension` token whose `$value` is
  the floor, so strict tools read a usable value and Lily tools still read the fluid one.
- Add a Resolver document that expresses the 63 themes' shared structure, including the patient and practitioner
  variants and the light and dark modes, as sets and modifiers.
- Test one theme's import into Penpot (open source, native tokens) and into Figma through Tokens Studio, and document
  both on the not-planned Figma page (P5-T5).

- Answers: the design-language row, using the standard rather than a Figma library.
- Check: the schema check passes in `bin/test`, and a strict 2025.10 parser (for example Style Dictionary 5 or Terrazzo)
  loads every theme without warnings.

### 7. A self-assessed conformance report for Core

Publish an Accessibility Conformance Report in the VPAT 2.5 WCAG edition for the Core tier only. Label it **self-assessed**
on every page, and generate it from the item 2 evidence so that it cannot claim more than the tests show. A
self-assessed ACR is a recognised document that procurement teams can read. It is not an audit, and it says so.

- Answers: conformance statement / VPAT.
- Check: every "Supports" cell links to the test or the screen-reader matrix row behind it. The report regenerates in
  `bin/test`.

### 8. Fund an external audit of Core

Turn [audit-readiness](../../docs/audit-readiness.md) into a funding application. Facts checked 2026-10-29 (sources in
[free-open-source-funding](../free-open-source-funding/index.md)):

- **The NLnet NGI Zero Commons Fund closed** on 2026-06-01, and NGI Zero Review ended 2026-07-31. NLnet's open calls
  (Restack, CodeSupply) are a weak fit; its HAN University WCAG audit service is still listed, for grantees only.
- **NLnet GenAI policy 2.0 (2026-10-20)** forbids AI-written proposals, and the September 2026 call makes work
  "(mostly) generated by LLMs" ineligible. Lily's implementations are disclosed as AI-generated
  ([AI_STATEMENT.md](../../AI_STATEMENT.md)), so the maintainer must write any proposal and propose human-written fixes.
- **Sovereign Tech Agency:** the Fund's minimum is €50,000 and it currently excludes user-facing applications.

`docs/funding/ngi-zero-commons-application.md` holds planning notes, not submittable text.

- Answers: conformance, and partly support, since funding is the only route to more than one maintainer.
- Check: one application submitted, with its outcome recorded.

### 9. Fill the screen-reader matrix

This is the cheapest high-value proof Lily lacks: 20 rows prepared on 2026-08-28 and none filled. Even a maintainer's
own VoiceOver pass on macOS and iOS is real evidence, if it is recorded with versions.

- Answers: production-proven behaviour and conformance. Prerequisite for items 2 and 7.
- Check: at least two combinations filled for all 20 rows, each with an issue or PR reference.

### 10. A published support policy

Add a support policy to `MAINTAINERS.md`, synced by `bin/sync-special-files`. It states:

- which versions receive fixes (latest minor only, until 1.0);
- the security-fix target from SECURITY.md;
- the deprecation notice period;
- what "best effort" means;
- a bus-factor plan: a second person with publish rights on npm and NuGet.

- Answers: the vendor and support row, honestly.
- Check: the policy exists in every subproject copy, and the second publisher is recorded.

### 11. Record and watch public-sector reference versions

For each GOV.UK, NHS England, NHS Scotland, NHS Wales, DHCW and USWDS theme, record the upstream package and version its
visual reference was taken from. Add a `bin/check-theme-references` report that prints themes whose upstream has a newer
major release. A report, not a gate: upstream releases must not break Lily's build.

- Answers: the "actual GOV.UK or NHS compliance" row. Lily cannot be the real thing, but it can say how far each theme is
  from it.
- Check: the report runs and lists every public-sector theme with its recorded version.

## Priority

1. **Items 1 and 9 first.** They are cheap, and they fix the credibility of what Lily already says.
2. **Then items 4 and 6.** These are mechanical and reduce future proof cost.
3. **Then items 2, 3 and 5.** These are the structural work. Item 3 needs the P12-T10 decision, and item 5 resolves
   P10-T6.
4. **Items 7 and 8 follow item 2.** Items 10 and 11 can land at any time.

This agrees with Phase 12's advice to defer new components until the guarantees catch up. RFC 1 (is 582 too many?) is
best answered by Core: the catalog can stay broad if the claims are scoped to the proven part.

## Not adopted

- **A maintained Figma component library.** P5-T5 decided this on 2026-08-29. Item 6 improves the token path instead.
- **Zag.js as a dependency.** It has no Angular, Blazor, Nunjucks or Alpine adapter, and adopting it for three
  frameworks would split the parity that is Lily's first difference. Lily takes the architecture from it (item 3), not
  the package.
- **Shadow DOM, Web Awesome's model.** It conflicts with the single class contract and with theme CSS reaching into
  components.
- **Default visual design.** Out of scope; see above.
- **Claiming GOV.UK or NHS compliance.** Lily never claims it. Item 11 measures distance; it does not certify.

## Acceptance criteria

- [x] COMPARE.md and `compare/compare.tsv` carry the Radix, Base UI, React Aria and Web Awesome columns;
      `bin/generate-comparisons --check` passes (item 1).
- [x] `bin/generate-core --check` runs in `bin/test` and writes `core.json`, `docs/core.md`, the `/quality` page and the
      ACR (items 2 and 7).
- [ ] At least one component meets all three Core criteria (blocked on item 9).
- [~] Listbox runs on `shared/listbox-machine.ts` in six libraries; the other machines are not started (item 3).
- [x] Every audited overlay or popup component records its native-platform decision; `bin/check-native-primitives`
      passes (item 4).
- [ ] The 9 native-platform candidates are decided (item 4).
- [ ] The `shadcn-registry` CI job has a green GitHub run (item 5).
- [x] `bin/check-dtcg-tokens` passes in `bin/test`; `themes/tokens/lily.resolver.json` exists (item 6).
- [ ] Penpot and Figma (Tokens Studio) imports tested and documented (item 6).
- [ ] One funding application submitted and its outcome recorded (item 8).
- [ ] Two screen-reader combinations filled for all 20 matrix rows (item 9).
- [~] Support policy in `MAINTAINERS.md`; the second publisher is not yet named (item 10).
- [x] `themes/references.tsv` and `bin/check-theme-references` exist (item 11).

## Related topics

- [accessibility](../accessibility/index.md): the screen-reader matrix and axe baselines Core depends on.
- [testing](../testing/index.md): the suites and e2e engines behind criteria (a) and (b).
- [theme](../theme/index.md): the DTCG token source (item 6) and reference versions (item 11).
- [free-open-source-funding](../free-open-source-funding/index.md): item 8's funding facts.
- [headless-improvements](../headless-improvements/index.md): the shared-core question (P12-T10) behind item 3.

## Sources

- [shadcn CLI 3.0 and MCP changelog](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp); [shadcn MCP docs](https://ui.shadcn.com/docs/mcp)
- [InfoQ: Base UI v1](https://www.infoq.com/news/2026/02/baseui-v1-accessible); [Base UI release notes](https://unpkg.com/@base-ui/react@1.6.0/docs/react/overview/releases.md)
- [Zag.js](https://zagjs.com/); [Ark UI overview (DeepWiki)](https://deepwiki.com/chakra-ui/ark)
- [React Aria quality](https://react-aria.adobe.com/quality)
- [Web Awesome 3.6.0 llms.txt](https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.6.0/dist/llms.txt)
- [DTCG 2025.10 first stable version](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/); [Technical reports 2025.10](https://www.designtokens.org/tr/2025.10/)
- [Penpot design tokens](https://penpot.app/collaboration/design-tokens); [Penpot export is Tokens Studio format, not DTCG 2025.10](https://community.penpot.app/t/token-export-is-tokens-studio-format-not-dtcg-2025-10/10544)
- [web.dev: new on the web platform, January 2026](https://web.dev/blog/web-platform-01-2026?hl=de); [Chrome: customizable select](https://developer.chrome.com/blog/a-customizable-select); [MDN: customizable select](https://developer.mozilla.org/docs/Learn_web_development/Extensions/Forms/Customizable_select); [Chrome I/O 2025 web UI recap](https://developer.chrome.com/blog/new-in-web-ui-io-2025-recap)
- [NGI Zero Commons Fund](https://ngi.eu/ngi-projects/ngi-zero-commons-fund/); [NLnet NGI0](https://nlnet.nl/NGI0/)

---

Lily™ and Lily Design System™ are trademarks.
