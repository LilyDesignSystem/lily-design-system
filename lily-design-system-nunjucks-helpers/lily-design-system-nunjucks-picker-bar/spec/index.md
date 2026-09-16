# PickerBar — Specification (Nunjucks)

Single source of truth for the `@lilydesignsystem/nunjucks-picker-bar`
Nunjucks helper. Ports [the Svelte package's
spec](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar/spec/index.md)
one-to-one; this file keeps the same § numbering and calls out every
Nunjucks-specific deviation explicitly.

Sibling files in this directory:

- `picker-bar.njk` — the macro implementation
- `picker-bar.client.js` — the convenience runtime (§4.3)
- `picker-bar.test.ts` — vitest spec exercising every clause in §4–§7
- `index.md` — user-facing readme

## 1. Purpose

A single page-header row that composes four of the six `*-picker`
helpers in this catalog — `theme-picker`, `locale-picker`,
`text-size-picker`, and `share-picker` — with two catalog-specific
defaults pre-wired, so a consumer can call one macro instead of
assembling and configuring four. `motion-picker` and `date-time-picker`
are deliberately excluded: the former has no natural page-header spot
next to the other three preference pickers picked for this bar, and
the latter is a form control, not a header control — see
[AGENTS/helpers.md](../../../AGENTS/helpers.md).

## 2. Scope

In scope: a macro rendering the four picker macros in a fixed order
(theme, locale, text-size, share), forwarding each picker's required
and optional params, and supplying two catalog-wide defaults (§5.1,
§5.2). Out of scope: any new markup, interaction, or lifecycle beyond
what the four wrapped pickers already own — `picker-bar` owns nothing
of its own except the convenience `autoInit`/`initPickerBar` wiring in
§4.3.

## 3. Nunjucks-specific deviations from the Svelte canonical

### 3.1 Cross-package macro imports, not a bundler

The Svelte canonical imports its four sibling components as ordinary
JS module specifiers, resolved by the consumer's bundler /
`node_modules`. A Nunjucks macro has no equivalent import system of its
own — `{% from "PATH" %}` is resolved by the Nunjucks `Environment`'s
configured search paths, not by Node module resolution. `picker-bar.njk`
therefore imports each sibling as
`{% from "lily-design-system-nunjucks-{name}-picker/dist/{name}-picker.njk" import ... %}`
— a path that resolves correctly once a consumer's `Environment` search
paths include `node_modules` (see index.md "Install"), because
`node_modules/lily-design-system-nunjucks-theme-picker/dist/theme-picker.njk`
is exactly where a real install puts it. In this monorepo's own
dev/test tree the same relative shape already holds without any extra
setup: each sibling package's built `dist/` sits at that exact path
relative to the catalog root.

### 3.2 No `children`/`{% call %}` passthrough

The Svelte canonical's `themeProps.children` (etc.) lets a consumer
override one wrapped picker's glyph. A Nunjucks macro call accepts at
most one `{% call %}` block, and `pickerBar(opts)` already needs none
of its own — there is nowhere to route a per-picker caller block to
one specific nested macro call. A consumer who needs a custom glyph on
one picker composes the four macros directly instead of using
`pickerBar`; this is a real, documented capability gap, not an
oversight.

### 3.3 A dedicated `autoInit`, because Nunjucks splits macro from runtime

Every other framework's `PickerBar`/`PickerBar` equivalent is a single
component with its own lifecycle hook. This catalog's helpers are
already split into a macro (markup) and a `*.client.js` module
(runtime) — see [AGENTS.md § The split](../../AGENTS.md). `picker-bar`
owns no lifecycle of its own (each wrapped picker's own `client.js`
already owns its own, independent of nesting), but `picker-bar.client.js`
still exists, as a convenience: `initPickerBar(root, opts)` finds the
four nested picker roots inside one `picker-bar` root and calls each
sibling's own `init{X}Picker` on them, and `autoInit(opts)` does that
for every `[data-lily-picker-bar-root]` on the page. This is optional —
calling the four siblings' own `autoInit()` separately works exactly
the same, since each already scans the whole document for its own hook
regardless of nesting.

## 4. Macro parameters

Single `opts` object (see `picker-bar.njk`'s own header comment for the
authoritative, most detailed list):

| Param           | Type                                  | Required | Default              |
| --------------- | -------------------------------------- | -------- | --------------------- |
| `labels`        | `{ theme, locale, textSize, share }`   | yes      | —                      |
| `themesUrl`     | `string`                                | yes      | —                      |
| `locales`       | `array<string>`                        | yes      | —                      |
| `themes`        | `array<string>`                        | no       | `DEFAULT_THEMES` (§5.1) |
| `sizes`         | `array<string>`                        | no       | `DEFAULT_SIZES` (§5.2)  |
| `shareTargets`  | `array<object>`                        | no       | `[]`                   |
| `themeProps`    | `object`                                | no       | `{}`                   |
| `localeProps`   | `object`                                | no       | `{}`                   |
| `textSizeProps` | `object`                                | no       | `{}`                   |
| `shareProps`    | `object`                                | no       | `{}`                   |
| `classes`       | `string`                                | no       | `""`                   |
| `attributes`    | `object`                                | no       | `{}`                   |

Each `*Props` object accepts that picker's own optional params
(excluding the ones already lifted to the top level: `themesUrl` /
`themes`, `locales`, `sizes`, `targets`) — see each sibling macro's
own header comment for its full param list.

### 4.3 `picker-bar.client.js` exports

`initPickerBar(root, opts)`, `autoInit(opts)`, `DEFAULT_THEMES`,
`DEFAULT_SIZES`, plus re-exports of the four siblings' own
`autoInit` under `autoInit{X}Picker` names, so a consumer who only
loaded `picker-bar.client.js` can still wire a standalone picker
outside any bar. See §3.3.

## 5. Defaults

### 5.1 `DEFAULT_THEMES`

All 45 Lily reference theme slugs (`themes/` at the repo root),
alphabetical except that every United Kingdom and United States
government/public-sector theme sorts last, as its own alphabetical
group — identical order to the Svelte canonical's `DEFAULT_THEMES`.
Held as two literal copies — one in `picker-bar.njk` (a macro cannot
import a JS constant) and one exported from `picker-bar.client.js` —
kept in agreement by a test that renders the macro and compares the
option order against the client.js export, the same pattern this
catalog already uses to keep `themeName`/`sizeName` (macro template
syntax vs. client.js function) in agreement.

### 5.2 `DEFAULT_SIZES`

The seven-step text-size scale, largest first: `largest`, `larger`,
`large`, `normal`, `small`, `smaller`, `smallest`. `text-size-picker`'s
own server-side fallback (`value or defaultValue or ("medium" if
present else sizes[0])`) does not fit this scale — `"medium"` is not
one of the seven slugs — so `pickerBar` passes
`defaultValue: textSizeProps.defaultValue | default("normal")` to its
nested `textSizePicker` call, same as the Svelte canonical.

## 6. Accessibility

WCAG 2.2 AAA target, unchanged from each wrapped picker's own contract
— `picker-bar` introduces no new interaction. `labels` supplies the
four accessible names; there is no default that would hardcode English
text. Like every other helper in this catalog, none of the wrapped
pickers is operable until their client.js modules run — see each
sibling's own `docs/ssr.md`; `picker-bar` adds nothing here.

## 7. Acceptance criteria

- §7.1 Renders a `<div class="picker-bar {classes}"
  data-lily-picker-bar-root>` root, extra attributes spread onto it.
- §7.2 Renders exactly the four pickers — theme, locale, text-size,
  share — in that order, each accessibly named from `labels`.
- §7.3 Forwards `themesUrl` to `theme-picker`; `themes` omitted
  resolves to `DEFAULT_THEMES` (45 entries, `abyss` first, the 8 UK/US
  themes last as a group).
- §7.4 Forwards `locales` to `locale-picker` — required, no default.
- §7.5 `attributes` spreads onto the root.
- §7.6 An explicit `themes` prop overrides `DEFAULT_THEMES`.
- §7.7 `themeProps` (e.g. `storageKey`) reaches the nested
  `theme-picker` and takes effect once `picker-bar.client.js` (or the
  sibling's own `autoInit`) has run.
- §7.8 `sizes` omitted resolves to `DEFAULT_SIZES` (seven entries,
  largest-to-smallest, titled exactly `Largest` … `Smallest`).
- §7.9 The nested `text-size-picker`'s server-resolved value is
  `"normal"` unless `textSizeProps.defaultValue` overrides it.
- §7.10 `shareTargets` reaches the nested `share-picker`'s list.
- §7.11 `localeProps`, `shareProps` reach their respective pickers, the
  same way `themeProps` and `textSizeProps` do (§7.7, §7.9).

## 8. Relationship to the six `*-picker` helpers

`picker-bar` wraps four of the six `*-picker` helpers in this catalog
without altering any of their individual contracts — existing counts,
markup, and keyboard behaviour for `theme-picker`, `locale-picker`,
`text-size-picker`, and `share-picker` are unchanged. It is additive: a
seventh package in this catalog, built on top of the other six the
same way a real consumer would compose them — declared as ordinary npm
`dependencies` in `package.json`, not vendored or duplicated source.
