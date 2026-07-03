# Changelog — Lily Design System

All notable changes to the canonical catalog and monorepo are documented
here. Per-catalog helper changelogs live in each
`lily-design-system-*-helpers/CHANGELOG.md`.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).
The living specification is [spec/index.md](spec/index.md); its §14.1 mirrors these
highlights.

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
  theme stylesheets targeting the Lily class hooks: NHS England, NHS
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
