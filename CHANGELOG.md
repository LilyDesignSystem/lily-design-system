# Changelog — Lily Design System™

All notable changes to the canonical catalog and monorepo are documented
here. Per-catalog helper changelogs live in each
`lily-design-system-*-helpers/CHANGELOG.md`.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).
The living specification is [spec/index.md](spec/index.md); its §14.1 mirrors these
highlights.

## Helpers renamed to `*-chooser` — 2026-07-21

### Changed (BREAKING — all helper packages)

- Every helper in all seven catalogs is renamed:

  | Was | Now |
  | --- | --- |
  | `lily-design-system-{fw}-theme-select` | `lily-design-system-{fw}-theme-chooser` |
  | `lily-design-system-{fw}-locale-select` | `lily-design-system-{fw}-locale-chooser` |
  | `lily-design-system-{fw}-text-size-select` | `lily-design-system-{fw}-text-size-chooser` |
  | `lily-design-system-{fw}-share-button` | `lily-design-system-{fw}-share-chooser` |

- Full depth: directories, npm / NuGet package ids, exported symbols
  (`ThemeSelect` → `ThemeChooser`, `nextShareButtonId` →
  `nextShareChooserId`, …), CSS class hooks and every derivative,
  `data-lily-*-select` → `data-lily-*-chooser`, Angular selectors, HTML
  custom-element tags, and the `--lily-select-icon-scale` custom
  property → `--lily-chooser-icon-scale`.
- `themeName` / `localeName` / `sizeName` and the DOM events
  (`themechange`, `share`, `copy`, …) are unchanged — none said "select".
- **`share-chooser` loses its naming exception.** Its trigger hook was
  `share-button-trigger` because `.share-button-button` read badly; the
  new name removes the problem, so it is plain `.share-chooser-button`.

### NOT renamed

- The **catalog components** `theme-select` and `theme-select-option` —
  two of the 490 in `components.tsv` — keep their names, along with
  their `components/` docs, headless implementations, example demos and
  github.io routes. They are a different thing from the helpers and are
  cross-checked by `bin/test`.

### Changed (themes)

- The 45 `themes/*.css` rename the helper hooks and **delete the
  `:has(> .{helper}-button)` guard**. That guard existed only because the
  helper and the catalog `theme-select` component shared the
  `.theme-select` hook and had to be told apart; distinct names remove
  the collision outright. The catalog component keeps its
  `select.theme-select` form-field rule.

### Changed (versions)

- Every helper package resets to **0.1.0**. A renamed package has no
  history under its new name, so numbering a first release 0.4.0 would
  imply releases that never existed. Nothing had been published, so the
  reset costs nothing. Each CHANGELOG preserves its pre-rename history
  below a provenance heading.

### Fixed

- **`el?.scrollIntoView(...)` guarded the element but not the method.**
  jsdom implements no `scrollIntoView`, so the call threw inside the
  keydown handler of the canonical theme-chooser and locale-chooser —
  *after* `activeIndex` was assigned, so 45 unhandled exceptions went by
  with the suite still green and that code path never running. Now
  `el?.scrollIntoView?.(...)`. Same shape as the earlier `CSS.escape`
  bug; the other six catalogs had each independently added the guard.
- Several catalog build scripts hardcoded package names and would have
  silently built nothing after the rename. The nunjucks, html, vue and
  angular scripts now discover packages and **fail loudly** when they
  find none, closing the "published a package with no code in it"
  failure mode for good.

### Verification

- 1231 tests pass with **unchanged counts** in every catalog (127
  svelte, 182 react, 181 vue, 205 angular, 193 html, 221 nunjucks, 122
  blazor). A rename must not move a test count; where one moved it was a
  test asserting the retired `share-button-trigger` exception, rewritten
  rather than deleted.

## Helpers — text-size-select 0.2.0, share-button 0.1.0 — 2026-07-21

### Changed (BREAKING — text-size-select)

- **`text-size-select` is no longer a native `<select>`.** It is now an
  icon button opening a WAI-ARIA APG listbox, matching `theme-select`
  and `locale-select` — it was the last native `<select>` among the
  helpers, so all three now share one shape. Button glyph is `"A"`
  (U+0041): the obvious candidate U+1F5DB has no real glyph in common
  font stacks and falls back to a crude bitmap shape, and it means
  *decrease* rather than *size*.
- `sizeName` exported to mirror `themeName` / `localeName`. No
  first-visit detection prop — unlike `prefers-color-scheme` and
  `navigator.languages`, the platform exposes no preferred text size.
- Released at **0.2.0** in all seven catalogs.

### Added — `share-button` 0.1.0

- A new helper, and the first that owns an **action** rather than a user
  preference: it applies nothing to the document and persists nothing.
  `AGENTS/helpers.md`'s definition of a helper is widened accordingly.
- A single-glyph button (↪, U+21AA) opens the **native share sheet**
  where the browser provides one, and otherwise a **disclosure list** of
  consumer-supplied destinations plus **copy the page URL**.
- **No social-network endpoints ship with it.** Which networks belong in
  a product is an editorial and privacy decision, share URLs change, and
  networks die. Consumers pass `targets`, each with its own
  `href(url, title, text)`.
- **Destinations are real `<a>` elements, not `role="menuitem"`.** A
  menuitem role strips middle-click, open-in-new-tab and
  copy-link-address — affordances users reach for on exactly this kind
  of list — and the APG suggests a disclosure when items are links. Copy
  is a real `<button>`.
- The copy item renders only when `copyLabel` is supplied; a default
  would be a hardcoded English string. `copiedLabel` /
  `copyFailedLabel` are announced in a polite live region, since copying
  is otherwise silent.
- A dismissed (rejected) native sheet ends the interaction rather than
  falling through to the list, which would resurrect UI the user just
  dismissed.

### Fixed

- **`CSS.escape` threw under jsdom in all three `*-select` helpers.**
  jsdom has no `CSS` object at all, so the call raised inside the keydown
  handler — *after* `activeIndex` had been assigned, so every suite
  stayed green while that code path never ran. Replaced with
  `document.getElementById`, which needs no escaping for these generated
  ids.
- **`bin/publish-helpers` globbed `lily-design-system-*-select`**, so a
  `share-button` package would have been silently skipped at release.
  The globs are now broad and lean on the existing package.json / dist /
  `*.csproj` guards.
- `text-size-select` had no `CHANGELOG.md` in the svelte, angular, or
  html catalogs; added, so the release record is complete across all
  seven.

### Changed (themes)

- The 45 `themes/*.css` style the `share-button` hooks and carry each
  glyph's optical correction. The four glyphs ink materially different
  fractions of their em box — ◑ 0.842, 🌐 0.996, `"A"` 0.673, ↪ 0.633 —
  so each has its own `--lily-select-icon-scale` (1, 0.845, 1.25,
  1.331). Measured against each icon's *computed* `font-family` and
  verified in a browser: 0.02px spread across all four.

## Helpers 0.4.0 — 2026-07-20

### Changed (BREAKING — helpers)

- **`theme-select` and `locale-select` are no longer native `<select>`
  elements.** Each is now a single-glyph **icon button that opens a
  listbox** — ◑ (U+25D1) for theme-select, 🌐 (U+1F310 + U+FE0E) for
  locale-select. A single character is the smallest footprint a header
  control can have; it also removes the reason the short-lived 0.3.0
  placeholder-pinning existed, so the `placeholder` prop is **removed**
  from both.
- New DOM: `<div class="{helper}">` wrapping a hidden input (form
  participation, carries `name`), a `<button class="{helper}-button">`
  whose only content is an `aria-hidden` glyph span, and a
  `<ul class="{helper}-list" role="listbox" hidden>` of
  `<li class="{helper}-option" role="option" aria-selected>`. The
  consumer's `children` slot now overrides the **glyph**, not the
  options.
- Keyboard follows the WAI-ARIA APG **listbox** pattern, hand-built
  because the native semantics are gone: ArrowDown / ArrowUp / Enter /
  Space open (ArrowUp starts on the last option), focus moves to the
  list, the cursor is `aria-activedescendant` (mirrored to `data-active`
  for CSS), arrows clamp rather than wrap, Home / End jump, printable
  characters typeahead over labels, Enter / Space select and return
  focus to the button, Escape closes without changing the value, Tab
  closes and moves on.
- `text-size-select` is untouched and remains a native `<select>` at
  0.1.0.
- **`AGENTS/helpers.md` amended.** Its "Native `<select>` only" rule —
  written when the June 2026 migration removed the radio-group picker —
  now describes two deliberate shapes, and records the full keyboard
  contract. The radio-group markup remains forbidden.

### Changed (harmonisation)

- The two helpers are now symmetric, which they had quietly stopped
  being:
  - **Glyph presentation.** The globe gains U+FE0E VARIATION
    SELECTOR-15 so it renders monochrome rather than as a colour emoji,
    matching ◑. Verified in Chromium.
  - **Exported label resolver.** theme-select exports `themeName` to
    mirror locale-select's `localeName`; the internal `labelFor`
    delegates to it, removing the hand-duplicated title-casing rule that
    had spread into examples across every catalog. (Nunjucks cannot
    delegate — its macro title-cases in template syntax — so agreement
    is enforced by a test instead.)
  - **First-visit detection.** theme-select gains `detectFromSystem`
    and the exported `matchSystemTheme`, mirroring
    `detectFromNavigator` / `matchNavigatorLanguage`, at the same
    position in the resolution order:
    `value > storage > detection > defaultValue > fallback > first`.
  - **File shape.** locale-select gains the shared docs it lacked
    (props/attributes reference, styling, custom-rendering, recipes,
    troubleshooting), and its examples are renamed off the stale
    radio-group names (`01-radios`, `02-select`, `03-buttons` — none of
    which had rendered radios, a select, or buttons since June).

### Fixed

- **nunjucks theme-select resolution order.** It resolved
  `storage > value` while every other package resolved `value > storage`;
  Svelte is canonical, so it is flipped. A consumer passing a
  server-resolved `opts.value` from a cookie — precisely what the
  nunjucks catalog exists for — previously had it silently overridden by
  stale `localStorage`. BREAKING for consumers setting both `value` and
  `storageKey`.
- **The `lily-themes` example listed 41 theme slugs and was missing four
  themes** (`adobe-spectrum`, `mozilla-protocol`,
  `united-kingdom-government-digital-service`,
  `united-states-web-design-system`) in every catalog. The prose also
  called them "Lily / DaisyUI themes", wrong on both count and
  attribution — only 35 of the 45 are DaisyUI-derived.

### Changed (themes)

- The 45 `themes/*.css` stylesheets now style the button and popup
  (`{helper}-button`, `{helper}-icon`, `{helper}-list`, plus
  `[data-active]` for the keyboard cursor and `[aria-selected]` for the
  applied value, which are deliberately distinct). Scoped by
  `:has(> .{helper}-button)`, and the native-select rules narrowed to
  `select.theme-select`, so the catalog `theme-select` component — a
  real `<select>` sharing the class hook — keeps its form-field styling.

### Accessibility

- The 0.3.0 placeholder tradeoff is gone; three new ones are documented
  honestly in every package's `docs/accessibility.md` rather than
  glossed: an icon-only control's accessible name rests **entirely** on
  `aria-label`; a hand-rolled listbox has weaker assistive-tech support
  than a native `<select>`, and a native select remains the better
  choice for some audiences; and the glyph is a font-dependent character
  that may substitute or fail to render. The nunjucks packages
  additionally state that **without JavaScript the control cannot be
  operated at all**, which the native `<select>` could.

## Helpers 0.3.0 — 2026-07-20

### Changed (BREAKING — helpers)

- **`theme-select` and `locale-select` are now placeholder-pinned in all
  seven `*-helpers` catalogs.** The closed `<select>` always displays a
  short placeholder word ("Theme", "Locale") instead of the name of the
  active theme or locale, so the control is only ever as wide as that
  word rather than as wide as the longest option. Each renders a leading
  `<option class="{helper}-option {helper}-placeholder" value="">`
  carrying a new optional `placeholder` prop (defaults to the existing
  `label`, so nothing is hardcoded), and pins the element's own selection
  to it — snapping back after every change.
- DOM contract changes accordingly: option count is `choices.length + 1`,
  the first option's value is `""`, and `selectEl.value` no longer tracks
  the selection. The bindable `value` prop remains the single source of
  truth, and every downstream behaviour — managed `<link>` swapping,
  `data-theme`, `lang` / `dir`, persistence, navigator detection,
  `onChange`, initial-value resolution, SSR safety — is unchanged.
- Accessibility tradeoff, documented in each package's
  `docs/accessibility.md`: the active theme/locale is no longer announced
  as the combobox value. Consumers who need it surface it separately via
  visible text or a polite live region driven from `value` / `onChange`.
- `text-size-select` is untouched and keeps ordinary bound-select
  behaviour.

### Changed (themes)

- The 45 `themes/*.css` stylesheets size the two placeholder-pinned
  helpers to the placeholder word — `field-sizing: content` for Chromium
  with a `max-width: 12ch` fallback elsewhere. The rule is scoped with
  `:has(> .{helper}-select-placeholder)` so it targets the helper
  packages only; the catalog `theme-select` component shares the class
  hook but displays its real value and keeps its full-width form-field
  sizing.
- `.locale-select-option` now inherits the select's surface and text
  colours, matching `.theme-select-option`.

The helper packages still ship zero CSS.

### Added (helpers)

- The compensating status region is the default pattern in every helper's
  examples and quick-start: a visible `aria-live="polite"` element
  reporting the active theme/locale, with a `{helper}-status` class hook.
  Placeholder-pinning means the control no longer announces its value to
  a screen reader, and against the WCAG 2.2 AAA target a documented
  suggestion was not enough — the pattern adopters copy now has the
  compensation in it. Each `docs/accessibility.md` keeps an explicit
  "what this does and does not fix" note.

### Fixed (helpers)

- nunjucks: pre-hydration flash when `opts.value` was set. The initial
  value now travels as a `data-lily-*-select-value` attribute instead of
  a server-rendered `selected` on the real option, so the placeholder is
  the only selected option in the server HTML and nothing flashes before
  hydration. Resolution order unchanged.

### Released

- theme-select and locale-select at **0.3.0** in all seven catalogs
  (12 npm `package.json`, 2 NuGet `.csproj`); text-size-select stays at
  0.1.0. Publish with `bin/publish-helpers`.

## 0.6.0 — 2026-07-03

### Added

- **`bin/generate-registries`** — regenerates every example-app catalog
  registry (three `components.ts` files, `ComponentData.cs`, the two
  embedded HTML arrays, the github.io registry, the four
  `component-demos.ts` copies, and the root `index.md` listing) from
  `components.tsv` plus the canonical SvelteKit demo map, so hand-copied
  registries can no longer drift.
- **`bin/check-links`** — verifies every relative markdown link in
  tracked `*.md` files resolves (rsync-synced AGENTS copies excluded);
  exits non-zero on breakage.
- **CI** (`.github/workflows/ci.yml`) — runs `bin/test`,
  `bin/check-links`, a tracked-`node_modules`/`dist` guard, a
  registries-are-freshly-generated check, and the six JS-framework
  helpers test suites.
- **Upstream issue draft** for the Analog SSG route-injection bug
  (`lily-design-system-angular-examples/docs/analog-ssg-issue.md`), with
  the full engineering log relocated from the spec to
  `docs/analog-ssg-notes.md`.

### Changed

- **`bin/test` now fails.** Errors previously printed to stderr while
  the script exited 0; failures now set a flag and the script exits
  non-zero. New consistency checks: duplicate slugs / PascalCase names
  in `components.tsv`, `components/` directory ↔ catalog parity, exactly
  one CSS hook per slug in `css-style-sheet-template.css`, and
  entry-count parity for all twelve example-app registries.
- **Helpers released as 0.2.0** (`theme-select`, `locale-select` — the
  breaking radio-group → native-`<select>` migration, with CHANGELOG
  entries per package and per catalog); `text-size-select` stays 0.1.0
  (born select-based). 14 manifests bumped.
- **`spec/index.md` slimmed from 76 KB to under 40 KB** — the category
  table, naming tables, Reuters detail, demo-strategy table, and
  completed-work history now defer to topic docs and `CHANGELOG.md`;
  §11.4–§11.7 test counts are labelled as dated verification snapshots.

### Fixed

- The new `bin/test` checks immediately caught and led to fixing: a
  duplicate `.date-time-local-input` hook in the CSS template, and
  duplicate single-line `input` / `menu-item` entries in the three
  JS-framework registries.
- `bin/check-links` caught and led to fixing 89 genuinely broken
  markdown links: 75 wrong-depth `components/{slug}` links in Svelte
  component copies, wrong-depth `themes/` and `AGENTS/` links in helper
  docs, a `locales.tsv` link from the relocated locale-select spec, and
  a malformed Mozilla link in `comparisons/index.md`.
- `.claude/settings.local.json` untracked and ignored.
- Verified this release: `bin/test` and `bin/check-links` green; 372 JS
  helper tests, 1,497 Blazor headless bUnit tests, and 51 Blazor helpers
  tests pass.

## 0.5.0 — 2026-07-03

### Added

- **Helpers layer.** Seven `*-helpers` subprojects (Svelte canonical +
  React, Vue, Angular, HTML, Nunjucks, Blazor ports). Each catalog ships
  three native-`<select>` helpers — `theme-select`, `locale-select`,
  `text-size-select` — at v0.1.0 with npm/NuGet manifests, per-catalog
  `build.js` dist pipelines, and per-catalog CHANGELOGs. The helpers were
  first written as radio-group "pickers" (2026-06-05) and converted to
  native `<select>` controls (2026-06-17).
- **Reference themes.** A root `themes/` directory with 45 standalone
  theme stylesheets targeting the Lily™ class hooks: NHS England, NHS
  Scotland, and NHS Wales (patient + practitioner variants), GOV.UK GDS,
  USWDS, Adobe Spectrum, Mozilla Protocol, and general-purpose themes.
- **`bin/publish-helpers`** release script for the 21 helper packages.
- **Root `CHANGELOG.md`** (this file).
- **`AGENTS/helpers.md`** modular reference doc, loaded by `AGENTS.md`
  and synced to the implementation subprojects.

### Changed

- **Spec-driven development moves from `spec.md` files to `spec/`
  directories.** Every unit's specification now lives in a `spec/`
  directory entered via `spec/index.md`: the repo root (the former
  monolithic `spec.md` merged with the topic hub into `spec/index.md`,
  alongside the existing `spec/{topic}/index.md` deep-dives), all 21
  implementation subprojects, all 490 component directories, all 490
  `lilydesignsystem.github.io` route directories, and the 21 helper
  packages (two of which pioneered the layout). 1,022 files moved,
  relative links depth-adjusted, and every `spec.md` reference across
  the repo updated. `bin/test` now verifies `spec/index.md`, and the
  scaffolders create `spec/` directories.
- **Catalog: 492 → 490 components.** The June migration of `theme-picker`
  → `theme-select` had collided with the pre-existing `theme-select`
  (duplicate slug in `components.tsv`, duplicate CSS hooks, duplicated
  registry/demo entries, orphaned `ThemePicker*` implementation files
  whose contents defined a second `ThemeSelect`). Resolved by merging
  onto the native-`<select>` `theme-select` and dropping the radio-group
  picker and its `theme-select-button` companion. Stale files, barrel
  exports, demo-registry entries, e2e specs, and stylesheet rules removed
  across all 14 implementation subprojects and
  `lilydesignsystem.github.io`.
- **Scaffolders match the verification gate.** `bin/create-component-directory`
  and `bin/create-implementation-directory` scaffolded the retired
  `plan.md` / `tasks.md` pair, which `bin/test` rejects; they now scaffold
  the spec layout `bin/test` verifies (`spec/index.md`, per the refactor
  above).
- **`bin/sync` skips helpers catalogs**, which keep their own `AGENTS/`
  conventions rather than the canonical root set.
- Docs harmonised: helpers + themes in the spec architecture (§3),
  `bin/publish-helpers` in tooling (§9), `spec/helpers/` rewritten for the
  `<select>` contracts and the third helper, `spec/theme/` +
  `AGENTS/theme.md` document `themes/`, counts updated everywhere.

### Fixed

- **Example-app catalog registries backfilled to the full 490.** The
  SvelteKit, Next.js, Nuxt, and HTML+CSS+JS apps' components-index
  registries were missing the 80 national personal identifier entries
  (they listed 410); the `lilydesignsystem.github.io` registry was
  missing the five 0.4.0 additions (485). All now match `components.tsv`
  exactly.
- `lily-design-system-nunjucks-headless` no longer tracks its
  `node_modules/` in git (2,553 files untracked); root `.gitignore` gains
  `dist/` and `node_modules/`.
- Six example apps' `nhs.css` dropped a conflicting leftover
  `.theme-select { display: flex }` rule (renamed from the old
  `.theme-picker`); all 45 `themes/*.css` dropped stale `.theme-select` /
  `.theme-select-button` selectors from the picker selector lists;
  the Nunjucks Eleventy app dropped a broken
  `theme-select-button.css` import.
- **Helper docs de-"picker"ed.** ~290 files across the 7 helpers
  catalogs swept from the pre-migration "picker" / radio-group prose to
  the shipped native-`<select>` terminology. The svelte-helpers catalog
  `AGENTS/accessibility.md` and `AGENTS/testing.md` were rewritten from
  the obsolete fieldset+radiogroup contract to the `<select>` contract.
  Intentional usages kept: "OS-native picker" (the mobile select UI),
  consumer-subclass examples (`SwatchPicker extends ThemeSelect`), and
  backlog items proposing future radio-group sibling variants. Stale
  `multiple-pickers` example links fixed (the Svelte example file is
  renamed `multiple-selects.svelte` to match the other six catalogs);
  angular-helpers CHANGELOG package names corrected to the `-select`
  names. All 372 helper tests across the six JS-framework catalogs pass.

## 0.4.0 — 2026-05-30

- Catalog grows from 487 to 492 components: adds `question`, `answer`,
  `addressograph-box`, `barcode-image`, `draft`; rewrites `comment` as a
  generic discourse element; renames `qr-code` → `qr-code-image`.
  All changes propagated across the 14 implementation subprojects and
  `lilydesignsystem.github.io`.
- `AGENTS/components.md` trimmed from 55 KB to 7 KB by pointing at the
  canonical `components.tsv` instead of duplicating the catalog.

## 0.3.0 — 2026-05-30

- Seventh framework pair lands: Angular 20 headless library (verified
  974/974 vitest, ng-packagr APF build, Storybook 492/492) and Angular +
  Analog.js example app (SSG initially blocked upstream; build fixed
  2026-06-15 via Analog 1.22.5 + Vite 6).
- Canonical national-identifier reference files committed at root and
  propagated to all subprojects.

## 0.2.0 — 2026-05-24

- 80 national personal identifier components added across 30+ countries
  (catalog 407 → 492 over Phases 1–2).
- axe-core baseline reaches full pass on every example app; responsive
  viewport sweep ported to all 6 example apps.
- `spec/index.md` replaces the older split `plan.md` / `tasks.md`.

---

Lily™ and Lily Design System™ are trademarks.
