# Changelog — @lilydesignsystem/solid-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).

## 0.3.0 — 2026-11-21

- **Added:** `wholeCardLink` on `card`: with `href`, the heading link carries `data-lily-card-link`, so the themes' shared "Whole-card link"
  section makes the whole card its target and draws its focus ring round the card.
- **Added:** `statistic` takes a `change` (with `trend`: up, down or flat, as `data-trend`) and an "as of" time
  (`asOf` with `asOfLabel`, rendered as a `<time>`); it draws no arrow, and every word is yours.
- **Added:** `observation-view` takes `meterValue`, `meterMin` and `meterMax` (with optional `meterLow`, `meterHigh` and
  `meterOptimum`) and draws an `aria-hidden` native `<meter>`; the value, range and flag stay the text.
- **Fixed:** `tool-bar` uses the shared toolbar keys.
- Other changes in this range, including the 2026-11-20 backlog batch, are recorded in the root
  [CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## 0.2.0 — 2026-11-18 (breaking)

- **Breaking:** the 164 national personal identifier components (an `-input` and a `-view` for each of 82 identifier
  types) move to their own package, `@lilydesignsystem/solid-headless-identifiers`. They are removed, not re-exported;
  this package now has the 473 other catalog components.
- **Migration:** install the identifiers package and change the import; the components, their props, class hooks and
  behaviour are unchanged.

  ```sh
  pnpm add @lilydesignsystem/solid-headless-identifiers
  ```

  ```tsx
  // before
  import { UnitedKingdomNationalHealthServiceNumberInput } from "@lilydesignsystem/solid-headless";
  // after
  import { UnitedKingdomNationalHealthServiceNumberInput } from "@lilydesignsystem/solid-headless-identifiers";
  ```

## 0.1.1 — 2026-11-18

- Fix: a form reset no longer empties bound fields. Solid writes a bound `value` or `checked` as the DOM property, so the
  browser's reset (which restores each field's attribute default) cleared them, and a field whose value had not changed
  was never written again. Every bound text-like `<input>`, `<textarea>`, checkbox and radio now binds `defaultValue` or
  `defaultChecked` to the same value; `Select`, `SelectWithExtras` and `ThemeSelect` put the bound value back after a
  reset; `QuantityInputDiv` marks its unit option `defaultSelected`.

## 0.1.0 — 2026-11-17

- First release: all 637 catalog components for Solid 2.0 (`solid-js` and `@solidjs/web` ^2.0.0 as peers), with the
  same root elements, class hooks, ARIA, keyboard contracts and no English defaults as the other Lily catalogs.
- Two builds: `dist/source` keeps the JSX, for the `solid` export condition (a Solid app compiles it for the browser
  or the server); `dist/index.js` is compiled for the browser, for any other bundler. Types in `dist/source`.
- `class`, not `className`. A default applies when a prop is `undefined` (`withDefaults`), and ARIA and data booleans
  render `"true"` / `"false"` (`attr`), as in the other catalogs.
- The pure modules `clinical-format` and `ips-sections` are exported beside the components.
- The monorepo [CHANGELOG](../CHANGELOG.md) has the detail.
