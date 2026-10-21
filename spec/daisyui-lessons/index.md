# Lessons from daisyUI (planned work)

## Summary

Eleven improvements to Lily, plus items not adopted, proposed 2026-10-21 from
a review of [daisyUI](https://daisyui.com/) (v5.7.50): a free Tailwind CSS
plugin of semantic component classes (`btn`, `card`, `toggle`), 68 components,
35 built-in themes made of CSS variables, and a strong AI surface (per-page
Markdown, a skill file, an official MCP server). daisyUI is not just an
inspiration: **Lily's themes descend from it**. 35 of the 57 `themes/` are
daisyUI-derived (credited in each file's header, see
[CHANGELOG](../../CHANGELOG.md)), and Lily already uses its token set. The
useful question is therefore what Lily has *not* taken. Nothing here is built
yet: each item is an open acceptance criterion.

## Scope

### In scope

The eleven items below, each with a deliverable, a source of truth and a
check; a list of components worth evaluating; and what is deliberately not
adopted.

### Explicitly out of scope

- A Tailwind dependency, Tailwind plugin packaging, or utility classes (root
  spec rule, repeated in [theme](../theme/index.md)).
- daisyUI's decorative components (Aura, Hover 3D card, Hover Gallery, Text
  Rotate): motion and decoration are the consumer's.
- Selling templates.

## Limits of the review

Read: the home page, the themes and colors docs, the components index, the
Button page, and `llms.txt` (which is a skill file, not a link map). The
`/docs/llms/` page returned 404. Not read: the config page, the changelog and
v5 upgrade guide, the Blueprint MCP server's actual tools, the theme
generator's internals, and the per-component pages other than Button.

## What Lily already matches

So these are not proposed again: the `--color-base-100/200/300`,
`--color-base-content`, `--color-primary` … `-content` semantic tokens;
`--radius-selector/field/box`, `--size-selector/field`, `--border`, `--depth`
and `--noise` (present in the themes); `color-scheme` per theme; `data-theme`
switching; a theme picker in the docs; docs in 46+ languages against daisyUI's
roughly 25; a comparisons page; DTCG token files under `themes/tokens/`; and
per-component When to Use / When Not to Use guidance.

## The items

### 1. Token-only themes on `[data-theme]`, with one shared component sheet

daisyUI themes are *only* variables: `data-theme="x"` works on `<html>` or
**any element**, and themes nest, so a section can be forced to another
theme. Lily's themes are not: each file carries its token block and then the
component rules for the whole catalog. Measured 2026-10-21: every one of the
57 files is 134 KB (about 29 KB gzipped) and the component section is
**byte-identical across all 57** (one md5). Each theme also selects
`:root[data-theme="x"]`, so it can only apply to the whole document.

- **Deliverable:** split into one shared `themes/lily-components.css`
  (component rules, reading only tokens) and 57 token-only theme files of
  about 100 lines each, selecting `[data-theme="x"]` (plus `:root` for the
  default) so a theme can be scoped to any subtree and two themes can coexist
  on one page.
- **Wins:** `theme-picker` swaps a ~3 KB file instead of ~29 KB gzipped; the
  component sheet is cached once; nested sections ("force this card dark")
  work; the mode-axis question in
  [bootstrap-lessons](../bootstrap-lessons/index.md) item 2 becomes tractable.
- **Risks to test first:** `color-scheme` on a subtree; the default-theme
  `:where(:root, …)` cascade; anchor-positioned popups inside a scoped theme;
  `bin/sync` copies of `themes/` into the seven example apps and the docs site.
- **Not breaking:** keep emitting the current self-contained files as a
  generated "standalone" build for one minor release, so existing
  `<link>` users do not break.
- **Check:** `bin/check-theme` asserts the component section is shared and the
  theme files hold tokens only; an e2e test renders two themes side by side.

### 2. Build only the CSS you use

daisyUI's plugin can include or exclude components and themes. A Lily
consumer using ten components ships all ~3,700 lines.

- **Deliverable:** `bin/build-css --components button,card,field --themes nord,dark`
  (and a published `@lilydesignsystem/css` equivalent) that slices the shared
  component sheet by base class, using the class-first rule that already makes
  each component's rules findable, and emits a minimal stylesheet plus the
  requested token files.
- **Depends on:** item 1.
- **Rule:** the slicer reads the component rules' selectors only; it never
  rewrites them. A component's rules must be self-contained or declare their
  dependencies (for example `data-table` pulling `table`).
- **Check:** a test builds the slice for five components and asserts the page
  renders identically to the full sheet in the example app (Playwright
  screenshot with a tolerance of zero).

### 3. A theme generator on the docs site

daisyUI has a Theme Generator (and a Playground). Lily has token files, a
DTCG pipeline (`bin/generate-theme-tokens`), `bin/check-theme` and a contrast
report, but no page where an adopter builds a theme.

- **Deliverable:** a docs-site page: pick the semantic tokens (base 100/200/300,
  primary…error and their `-content`, the three radius tokens, border, depth),
  see live component previews, see the contrast table update, and download the
  token-only CSS (item 1) and the DTCG JSON.
- **Rule:** the page refuses to export a theme whose `-content` pairs fail the
  chosen contrast floor, unless the user explicitly accepts the failure, and
  then says so in the exported file's header.
- **Check:** a test generates a theme and runs it through `bin/check-theme`.

### 4. A variant vocabulary: `data-color`, `data-size`, `data-variant`

daisyUI documents each component as a table of class types: Component, Part,
Style, Color, Size, Behavior, Modifier (`btn`, `btn-primary`, `btn-sm`,
`btn-outline`, `btn-wide`). Lily's headless layer has no variant vocabulary:
variants are whatever the example app invents.

- **Deliverable:** a stable vocabulary of `data-*` attributes (not classes, so
  the base-class-first rule and the headless rule hold): `data-color` (the
  semantic names: `primary`, `secondary`, `accent`, `neutral`, `info`,
  `success`, `warning`, `error`), `data-size` (`xs` … `xl`), `data-variant`
  (`solid`, `outline`, `soft`, `ghost`, `link`), plus per-component modifiers
  documented in a **Variants** table in each component's `AGENTS.md`.
- **Themes:** all 57 style the attributes (`[data-color="primary"]`).
- **Overlap:** state attributes are item 1 of
  [shardsui-lessons](../shardsui-lessons/index.md); agree one naming rule for
  both (`data-` plus a lower-case word) so they cannot collide.
- **Check:** `bin/check-data-attributes` (shardsui-lessons item 1) extended
  with the variant allow-list.

### 5. Use the native `:user-invalid` for validation styling

daisyUI's Validator styles invalid fields with CSS and a hint element, with no
script. Bootstrap needs `.was-validated` to avoid showing required fields as
invalid on load. The platform now solves that: `:user-invalid` /
`:user-valid` match only after the user has interacted.

- **Deliverable:** in `field`, `error-message` and the 57 themes, style
  invalid state with `:user-invalid` and `[aria-invalid="true"]` (the latter for
  server-rendered errors), and show the linked error text with
  `:has(:user-invalid)`. This replaces the `data-validated` form hook proposed
  in [bootstrap-lessons](../bootstrap-lessons/index.md) item 8 and the timing in
  [coss-ui-lessons](../coss-ui-lessons/index.md) item 5; update both.
- **Before committing:** confirm the support floor against the browser policy
  recorded in the root spec; if it is below the floor, keep the form hook as
  the fallback and document both.
- **Rule:** the headless layer still ships no validation rules.
- **Check:** an e2e test: a required empty field is not styled invalid on
  load, is after blur, and a server-rendered `aria-invalid` field is.

### 6. Per-page AI links and "view source CSS"

Each daisyUI component page offers *Copy docs*, *Open in ChatGPT*, *Open in
Claude* (a prompt pre-filled with the raw Markdown URL), *Markdown doc*, *View
source CSS* and a "Text version for AI prompts". This extends item 3 of
[coss-ui-lessons](../coss-ui-lessons/index.md), which proposes only the
Markdown link.

- **Deliverable:** on `/components/{slug}`: Copy Markdown, Open in Claude, Open
  in ChatGPT (links, no embedded SDK, no network call from the page), View
  source (the component's rules in the shared sheet from item 1, and its
  snippet in each catalog).
- **Rule:** the links carry only the public Markdown URL; no page content, no
  tracking parameters. Opening an external service is outward-facing, so each
  link is a plain `<a>` the user chooses to follow.
- **Check:** `bin/check-links`; `bin/generate-sitemap --check`.

### 7. A rules file written for AI assistants, with a discovery protocol

daisyUI's `llms.txt` is a *skill file*: rules addressed to the assistant
("use only current class names", "if the user does not request a variant, use
the default", "use `primary` once per page", "do not use `tailwind.config.js`
with v4"), a **component discovery protocol** ("match the meaning, even when
the words differ from component names"), and a uniform entry per component
(summary, docs link, class names, syntax with placeholders, rules).
Lily's `llms.txt` is a curated link map by design
([llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md)).

- **Deliverable:** keep the curated map and add, beside it, generated rules
  files: `llms-rules.md` (the assistant-facing rules: base class first, text
  is a prop, never hard-code strings, prefer the most specific element, use
  the suffix table, `data-color` once-per-page guidance, no inline styles)
  and one `llms-components-{category}.md` per category, because 571 entries
  will not fit in one file the way daisyUI's 68 do. Each entry: summary, tag,
  base class, props, required ARIA, a one-line **Use when** and **Not when**
  (from the existing When to Use / When Not to Use bullets), and a placeholder
  snippet.
- **Discovery protocol:** a short section telling the assistant to match the
  user's intent against the Use-when lines, not slug names, and to prefer a
  catalog component over hand-written markup.
- **Generated, drift-checked** from `components/*/AGENTS.md`, like
  `bin/generate-api-docs`. This deliberately reopens the "no `llms-full.txt`"
  decision: the reason recorded there (a curated map beats a dump) still holds
  for `llms.txt`; the rules files are the *second* tier. Record the decision.
- **Check:** `--check` drift mode in `bin/test`; a size budget per file.

### 8. A read-only MCP server

daisyUI ships an official UI-design MCP server ("Blueprint"). Lily has skills
and docs but no server an agent can query for a component.

- **Deliverable:** `lily-design-system-mcp`, a read-only stdio MCP server
  exposing four tools: `list_components(category?)`, `get_component(slug)`
  (the manifest from [coss-ui-lessons](../coss-ui-lessons/index.md) item 2),
  `find_component(intent)` (match against the Use-when lines from item 7) and
  `check_markup(html)` (base class first, accessible name present, no inline
  styles, no hard-coded strings in known text positions).
- **Rule:** offline and read-only: it reads the generated manifests shipped in
  the package; no network, no file writes, no execution.
- **Depends on:** the manifests (coss item 2) and the rules files (item 7).
- **Check:** protocol tests over stdio; `check_markup` is tested against the
  catalog's own snippets (all must pass) and against deliberately broken ones.

### 9. Enforce the colour-pair contract

daisyUI states the rule plainly: always pair a colour with its own `-content`;
body text is `base-content`; muted text is `base-content` at reduced opacity,
not a separate colour; use `primary` once per page. Lily has the pairs and
the `--lily-error-text` pattern (error mixed into `base-content`), but
`bin/check-theme --contrast` is **report only**.

- **Deliverable (a):** a "Using colour tokens" page: the pair rule, the muted-text
  rule (mix into `base-content`, never a free colour), the status-text rule
  already in [theme](../theme/index.md), and the "one primary action per view"
  guidance.
- **Deliverable (b):** make the pair contrast a gate in `bin/test`: every
  `--color-X` / `--color-X-content` pair at AA at least, with a checked-in
  per-theme allow-list of known failures, each with a reason and an owner, so
  the number can only go down. Publish the table (bootstrap-lessons item 5b).
- **Check:** `bin/test` fails on a new unlisted failing pair.

### 10. Document the disabled-link and non-button pitfalls

daisyUI's Button page says what the class alone does not do: a class-disabled
button still needs `tabindex="-1"`, `role="button"` and `aria-disabled="true"`;
a non-button element acting as a button needs `role="button"`; a radio or
checkbox styled as a button needs an `aria-label`.

- **Deliverable:** a **Disabled and look-alike** section in `button`,
  `link`-type components and the choice-chip pattern: native `disabled` for
  buttons; for links, which cannot be disabled, `aria-disabled="true"`, no
  `href` (or a click guard) and removal from the tab order; never style a
  non-button as a button when a `<button>` fits. Goes under the **Known
  limitations** section from bootstrap-lessons item 5.
- **Check:** a test per documented case.

### 11. Integrations, and a playground

daisyUI lists about 40 install guides (Next.js, Vite, Vue, Laravel, Rails, …)
and has a Playground. Lily has nine per-framework tutorials and the 571-page
example apps.

- **Deliverable (a):** short install guides for the server-rendered hosts that
  suit the HTML, Nunjucks, Web Components and Alpine catalogs: Laravel, Rails,
  Django, Phoenix, Astro, Eleventy, Hugo, Jekyll, WordPress. Each is a
  starter-level page (bootstrap-lessons item 10a) with one snippet and one
  theme.
- **Deliverable (b):** a docs-site playground: edit a Lily HTML snippet, pick a
  theme from the picker, see the result and the axe result, share by URL.
  Recipes ([coss-ui-lessons](../coss-ui-lessons/index.md) item 1) open in it.
- **Rule:** the playground runs entirely in the browser; the shared URL holds
  the snippet in the fragment, so nothing is stored server-side.
- **Check:** each guide's snippet is built in CI.

## Components worth evaluating (not yet items)

daisyUI components with no Lily counterpart, none added on this evidence
alone. Each needs a real ARIA contract to qualify, per the root spec:

| daisyUI | Lily today | Verdict to reach |
| ------- | ---------- | ---------------- |
| Dock | none | A bottom navigation bar for small screens: a `nav` with `aria-current`; probably a recipe over `tab-bar` or `section-nav` rather than a component |
| Indicator | none | A badge anchored to a corner of another element: a positioning wrapper; a recipe over `badge` |
| Swap | `toggle-button` | Likely already covered; document the two-icon pattern |
| Speed dial / FAB group | `float-button` | A disclosure of actions; a recipe over `float-button` + `dropdown-menu` |
| Countdown | `timer` | `timer` is structural; a countdown is the consumer's logic; document, do not add |
| Filter, Validator, OTP, Calendar | `data-filter-form`, `field`, `one-time-password-input`, `calendar-*` | Covered |

## Not adopted

| daisyUI idea | Why not |
| ------------ | ------- |
| Tailwind plugin, 600+ utility classes | A CSS framework dependency; ruled out |
| `theme-controller` checkbox (a CSS-only theme switch) | Cannot persist the choice or satisfy the picker's listbox contract; `theme-picker` stays |
| Aura, Hover 3D, Text Rotate | Decorative motion; the consumer's |
| "88% fewer class names" as a claim | Lily's classes are hooks, not styling; the comparison does not apply |
| One-file `llms.txt` holding every component | Does not scale to 571; item 7 splits by category |

## Acceptance criteria

- [ ] 1. Themes are token-only on `[data-theme]` with one shared component sheet; scoped and side-by-side themes work; the standalone build still ships for one minor release.
- [ ] 2. `bin/build-css` slices the shared sheet by component, screenshot-identical to the full sheet.
- [ ] 3. The theme generator page exports a contrast-checked theme.
- [ ] 4. The `data-color` / `data-size` / `data-variant` vocabulary is documented, styled by all 57 themes and allow-list checked.
- [ ] 5. Invalid styling uses `:user-invalid` and `aria-invalid`; the bootstrap and coss validation items are updated to match.
- [ ] 6. Component pages carry Copy Markdown, Open in Claude / ChatGPT and View source links.
- [ ] 7. `llms-rules.md` and the per-category component files are generated and drift-checked; the llms-full decision is recorded.
- [ ] 8. The read-only MCP server ships with its four tools and protocol tests.
- [ ] 9. The pair-contrast gate is in `bin/test` with a shrinking allow-list; the colour-token page exists.
- [ ] 10. The disabled and look-alike guidance is in the affected components, each case tested.
- [ ] 11. The integration guides build in CI; the playground runs fully client-side.
- [ ] The components-to-evaluate table is decided row by row.

## Related topics

[theme](../theme/index.md), [theme-picker](../theme-picker/index.md),
[accessibility](../accessibility/index.md),
[llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md),
[agent-skills](../agent-skills/index.md),
[bootstrap-lessons](../bootstrap-lessons/index.md),
[coss-ui-lessons](../coss-ui-lessons/index.md),
[shardsui-lessons](../shardsui-lessons/index.md),
[citations](../citations/index.md).

## Sources

- [daisyUI](https://daisyui.com/) (v5.7.50 home page; read 2026-10-21), [themes](https://daisyui.com/docs/themes/), [colors](https://daisyui.com/docs/colors/), [components](https://daisyui.com/components/), [Button](https://daisyui.com/components/button/), [llms.txt](https://daisyui.com/llms.txt).
- Lily's own state, measured 2026-10-21: [themes/](../../themes/) (57 files, 134 KB each, identical component sections), [CHANGELOG.md](../../CHANGELOG.md) (35 of 57 themes daisyUI-derived), [bin/check-theme](../../bin/check-theme).
- [MDN: :user-invalid](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid) for item 5's support floor.
