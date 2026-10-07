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

A single page-header row that composes five of the `*-picker`
helpers in this catalog — `search-picker`, `theme-picker`,
`locale-picker`, `text-size-picker`, and `share-picker` — with two
catalog-specific defaults pre-wired, so a consumer can call one macro
instead of assembling and configuring five. `search-picker` sits first
in the row (added after the 0.1.0 release; see §8). `motion-picker` and `date-time-picker`
are deliberately excluded: the former has no natural page-header spot
next to the other three preference pickers picked for this bar, and
the latter is a form control, not a header control — see
[AGENTS/helpers.md](../../../AGENTS/helpers.md).

## 2. Scope

In scope: a macro rendering the five picker macros in a fixed order
(search, theme, locale, text-size, share), forwarding each picker's required
and optional params, and supplying two catalog-wide defaults (§5.1,
§5.2). Out of scope: any new markup, interaction, or lifecycle beyond
what the five wrapped pickers already own — `picker-bar` owns nothing
of its own except the convenience `autoInit`/`initPickerBar` wiring in
§4.3.

## 3. Nunjucks-specific deviations from the Svelte canonical

### 3.1 Cross-package macro imports, not a bundler

The Svelte canonical imports its five sibling components as ordinary
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
one picker composes the five macros directly instead of using
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
five nested picker roots inside one `picker-bar` root and calls each
sibling's own `init{X}Picker` on them, and `autoInit(opts)` does that
for every `[data-lily-picker-bar-root]` on the page. This is optional —
calling the five siblings' own `autoInit()` separately works exactly
the same, since each already scans the whole document for its own hook
regardless of nesting.

### 3.4 `searchProps` is split between the macro and the client

The Svelte canonical's `searchProps` bag forwards anything — including
the function-valued `navigate` and `onSearch` — to `SearchPicker`. A
Nunjucks macro cannot carry a function (search-picker's own spec §3.3),
so `searchProps` exists on both sides of the split, exactly as the
other `*Props` objects already do: the macro's `searchProps` forwards
the renderable options (`placeholder`, `value`, `action`, `name`, `id`,
`classes`, `attributes`), and `initPickerBar(root, { searchProps })` /
`autoInit({ searchProps })` hands the client options (`navigate`,
`onSearch`, and an overriding `action`) to search-picker's own
`initSearchPicker`.

## 4. Macro parameters

Single `opts` object (see `picker-bar.njk`'s own header comment for the
authoritative, most detailed list):

| Param           | Type                                  | Required | Default              |
| --------------- | -------------------------------------- | -------- | --------------------- |
| `labels`        | `{ search, searchInput, searchSubmit, theme, locale, textSize, share }` | yes | — |
| `themesUrl`     | `string`                                | yes      | —                      |
| `locales`       | `array<string>`                        | yes      | —                      |
| `themes`        | `array<string>`                        | no       | `DEFAULT_THEMES` (§5.1) |
| `sizes`         | `array<string>`                        | no       | `DEFAULT_SIZES` (§5.2)  |
| `shareTargets`  | `array<object>`                        | no       | `[]`                   |
| `searchProps`   | `object`                                | no       | `{}`                   |
| `themeProps`    | `object`                                | no       | `{}`                   |
| `localeProps`   | `object`                                | no       | `{}`                   |
| `textSizeProps` | `object`                                | no       | `{}`                   |
| `shareProps`    | `object`                                | no       | `{}`                   |
| `classes`       | `string`                                | no       | `""`                   |
| `attributes`    | `object`                                | no       | `{}`                   |

`labels` carries seven required accessible names, with no English
default: `search` names the search picker's icon button and search
landmark, `searchInput` its field, and `searchSubmit` its `⏎` submit
button — passed as search-picker's `label`, `inputLabel`, and
`submitLabel` — and `theme`, `locale`, `textSize`, `share` name the
other four pickers' buttons.

Each `*Props` object accepts that picker's own optional params
(excluding the ones already lifted to the top level: `themesUrl` /
`themes`, `locales`, `sizes`, `targets`) — see each sibling macro's
own header comment for its full param list.

### 4.3 `picker-bar.client.js` exports

`initPickerBar(root, opts)`, `autoInit(opts)`, `DEFAULT_THEMES`,
`DEFAULT_SIZES`, plus re-exports of the five siblings' own
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
seven accessible names (three for search-picker's button/landmark,
field, and `⏎` button; one for each of the other four pickers); there is no default that would hardcode English
text. Like every other helper in this catalog, none of the wrapped
pickers is operable until their client.js modules run — see each
sibling's own `docs/ssr.md`; `picker-bar` adds nothing here.

## 7. Acceptance criteria

- §7.1 Renders a `<div class="picker-bar {classes}"
  data-lily-picker-bar-root>` root, extra attributes spread onto it.
- §7.2 Renders exactly the five pickers — search, theme, locale,
  text-size, share — in that order, each accessibly named from
  `labels`.
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
- §7.12 `search-picker` is the first picker in the row; its search
  landmark is named by `labels.search`, its field by
  `labels.searchInput`, and its `⏎` button by `labels.searchSubmit`.
- §7.13 The search options reach `search-picker`: with
  `searchProps.action` `"/search"` on the macro and a `navigate` spy in
  `initPickerBar`'s `searchProps`, searching `foo` navigates to
  `/search?foo`.
- §7.14 Each of the five nested pickers renders its `.{helper}-picker-tooltip` and `initPickerBar` wires it (hover shows, leave hides); the bar adds no tooltip of its own.

## 7a. The optional leftmost link picker (added 2026-10-07)

`link-picker` — a home icon opening a disclosure of **page links the app defines** — is the leftmost picker, but only when the
app supplies them:

- **Props:** `links` (array of `{ id?, label, href, current?, newTab? }`, default none), `labels.link` (the picker's accessible
  name, required only when `links` is given), and `linkProps` (macro: `name`, `id`, `classes`, `attributes`; client: `navigate`, `onNavigate`, which a macro cannot carry). There is no default list and no English.
- §L1 With `links` non-empty and `labels.link` set, a `link-picker` renders FIRST — before search — named from `labels.link`, listing
  exactly `links`.
- §L2 With `links` omitted or empty, or `labels.link` missing, no link picker renders and search is first (§7.2 and the search clause unchanged).
- §L3 `initPickerBar(root, {{ linkProps }})` wires the link picker and passes `linkProps` (`navigate`).
- §L4 The links are real `<a href>` elements (not a menu).


## 8. Relationship to the `*-picker` helpers

`picker-bar` wraps five of the `*-picker` helpers in this catalog
without altering any of their individual contracts — existing counts,
markup, and keyboard behaviour for `search-picker`, `theme-picker`,
`locale-picker`, `text-size-picker`, and `share-picker` are unchanged.
`search-picker` joined the bar, first in the row, after 0.1.0
(unreleased; breaking, because `labels` gained three required names —
see CHANGELOG.md). It is additive: a
separate package in this catalog, built on top of the wrapped pickers the
same way a real consumer would compose them — declared as ordinary npm
`dependencies` in `package.json`, not vendored or duplicated source.
