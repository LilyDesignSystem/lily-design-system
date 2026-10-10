# PickerBar — Specification (Blazor helper)

Ported from the canonical
[Svelte package's spec/index.md](../../../lily-design-system-svelte-picker-bar/spec/index.md)
with the same § numbering; only framework-specific detail differs.

## 1. Purpose

A single page-header row that composes five of the `*-picker`
helpers — `search-picker`, `theme-picker`, `locale-picker`,
`text-size-picker`, and `share-picker` — with sensible catalog-wide
defaults pre-wired, so a consumer can drop one component into a header
instead of assembling and configuring five. Search comes first in the
row (maintainer-directed, 2026-10-02). `motion-picker` and `date-time-picker` are
deliberately excluded: the former has no natural page-header spot next
to the other three preference pickers picked for this bar, and the
latter is a form control, not a header control — see
[AGENTS/helpers.md](../../../AGENTS/helpers.md).

## 2. Scope

In scope: rendering the five pickers in a fixed order (search, theme,
locale, text-size, share), forwarding each picker's required and optional
parameters, and supplying two catalog-specific defaults (§5.1, §5.2)
so the common case needs no configuration beyond accessible names, a
themes URL, and a locale list. Out of scope: any new interaction,
state, or DOM application beyond what the five wrapped pickers already
do — `PickerBar` owns no lifecycle of its own; it renders no
`IJSRuntime` calls, sets no attributes on `<html>`, and writes nothing
to storage.

## 3. Markup

```html
<div class="picker-bar {CssClass}" ...AdditionalAttributes>
  <div class="search-picker">…</div>
  <div class="theme-picker">…</div>
  <div class="locale-picker">…</div>
  <div class="text-size-picker">…</div>
  <div class="share-picker">…</div>
</div>
```

Each child is the real, unmodified `SearchPicker` / `ThemePicker` /
`LocalePicker` / `TextSizePicker` / `SharePicker` component from its own sibling
package — same class hooks, same ARIA, same keyboard contract as
documented in that package's own `spec/index.md`. `PickerBar` adds no
markup of its own beyond the root wrapper.

## 4. Parameters

| Parameter            | Type                              | Required | Default                |
| --------------------- | ---------------------------------- | -------- | ------------------------ |
| `Labels`               | `PickerBarLabels`                  | yes      | —                        |
| `SearchAttributes`     | `Dictionary<string, object>?`      | no       | `null`                   |
| `ThemesUrl`            | `string`                           | yes      | —                        |
| `Themes`               | `IReadOnlyList<string>`            | no       | `DefaultThemes` (§5.1)   |
| `ThemeAttributes`      | `Dictionary<string, object>?`      | no       | `null`                   |
| `Locales`              | `IReadOnlyList<string>`            | yes      | —                        |
| `LocaleAttributes`     | `Dictionary<string, object>?`      | no       | `null`                   |
| `Sizes`                | `IReadOnlyList<string>`            | no       | `DefaultSizes` (§5.2)    |
| `TextSizeAttributes`   | `Dictionary<string, object>?`      | no       | `null`                   |
| `ShareTargets`         | `IReadOnlyList<ShareTarget>`       | no       | empty                    |
| `ShareAttributes`      | `Dictionary<string, object>?`      | no       | `null`                   |
| `CssClass`             | `string`                           | no       | `""`                     |
| `AdditionalAttributes` | `Dictionary<string, object>?`      | no       | `null` (spread on root)  |

`Labels` carries the seven accessible names as one `PickerBarLabels`
record (`Search`, `SearchInput`, `SearchSubmit`, `Theme`, `Locale`,
`TextSize`, `Share`, all `required`), following
`DateTimePickerLabels`'s precedent (AGENTS/helpers.md): structural
labels this catalog did not invent get no English default. Search
needs three — `Search` (its icon button and search landmark),
`SearchInput` (the field) and `SearchSubmit` (the `⏎` button), passed
as `SearchPicker`'s `Label` / `InputLabel` / `SubmitLabel` — the others
one each. There is no top-level `Label` — it would be ambiguous across
five controls.

Each `*Attributes` dictionary is splatted (`@attributes="…"`) onto
that picker **after** `PickerBar`'s own explicit parameters, so a key
in the dictionary — `Action`, `Navigate`, `Placeholder`, `OnSearch`
(as an `EventCallback<SearchEventArgs>`), `StorageKey`, `DetectFromSystem`, `DefaultValue`,
`Value`, `Name`, `Target`, a `*Labels` map, `ChildContent`, `OnChange`,
or `CssClass` on that specific child — overrides `PickerBar`'s
default, matching Blazor's own last-value-wins attribute merge order.
`PickerBar` is a thin wrapper: it pre-wires two defaults (§5) and
otherwise gets out of the way.

## 5. Defaults

### 5.1 `DefaultThemes`

All 45 Lily reference theme slugs (`themes/` at the repo root),
**sorted alphabetically except that every United Kingdom and United
States government/public-sector theme sorts last, as its own
alphabetical group** — 37 general-purpose and public-sector themes
first (`abyss` … `wireframe`), then 8 UK/US themes
(`united-kingdom-government-digital-service` …
`united-states-web-design-system`). Same maintainer-directed ordering
as the canonical Svelte spec §5.1 — general-purpose themes lead
because most consumers are choosing a visual style, not a
jurisdiction; the UK/US public-sector themes group at the bottom
because they are usually chosen as a set by a specific deployment.

Exposed as the public static `PickerBar.DefaultThemes` so a consumer
building a custom listbox (via a `ChildContent` render fragment inside
`ThemeAttributes`) can reuse the same ordering, and so a test can
assert against it directly.

### 5.2 `DefaultSizes`

The seven-step text-size scale, largest first: `largest`, `larger`,
`large`, `normal`, `small`, `smaller`, `smallest`. Each slug is a
single hyphen-free word, so `TextSizePicker`'s own default label
resolver (title-case each hyphen-separated word) already renders
exactly the requested label — "largest" → "Largest" — with no
`SizeLabels` override needed.

`TextSizePicker`'s own initial-value fallback (`DefaultValue` →
`"medium"` if offered → `Sizes[0]`) does not fit this seven-step scale
(`"medium"` is not one of its seven slugs, and falling back to
`Sizes[0]` would silently start every consumer at "Largest").
`PickerBar` therefore passes `DefaultValue="normal"` to its
`TextSizePicker` unless `TextSizeAttributes["DefaultValue"]` overrides
it.

## 6. Accessibility

WCAG 2.2 AAA target, unchanged from each wrapped picker's own
contract (§6 of `search-picker`, `theme-picker`, `locale-picker`,
`text-size-picker`, and `share-picker`'s respective specs) —
`PickerBar` introduces no new interaction, so it introduces no new
accessibility surface. `Labels` supplies all seven accessible names
(three for search: button, field, `⏎`); there is no default that would
hardcode English text.

## 7. Acceptance criteria

- §7.1 Renders a `<div class="picker-bar {CssClass}">` root, extra
  attributes spread onto it.
- §7.2 Renders exactly the five pickers — search, theme, locale,
  text-size, share — in that order, each accessibly named from `Labels`.
- §7.3 Forwards `ThemesUrl` to `ThemePicker`; `Themes` omitted resolves
  to `DefaultThemes` (45 entries, `abyss` first, the 8 UK/US themes
  last as a group).
- §7.4 Forwards `Locales` to `LocalePicker` — required, no default.
- §7.5 `CssClass` renders as `"picker-bar {CssClass}"` (trimmed) on
  the root.
- §7.6 An explicit `Themes` parameter overrides `DefaultThemes`.
- §7.7 `ThemeAttributes` (e.g. `StorageKey`) reaches the nested
  `ThemePicker` and takes effect.
- §7.8 `Sizes` omitted resolves to `DefaultSizes` (seven entries,
  largest-to-smallest, titled exactly `Largest` … `Smallest`).
- §7.9 The nested `TextSizePicker` initial value is `"normal"` unless
  `TextSizeAttributes["DefaultValue"]` overrides it.
- §7.10 `ShareTargets` reaches the nested `SharePicker`'s list.
- §7.11 `LocaleAttributes`, `ShareAttributes` reach their respective
  pickers, the same way `ThemeAttributes` and `TextSizeAttributes` do
  (§7.7, §7.9).
- §7.12 Search is the first picker; its field and `⏎` button are
  named from `Labels.SearchInput` and `Labels.SearchSubmit`.
- §7.13 `SearchAttributes` (e.g. `Action`, `Navigate`) reaches the
  nested `SearchPicker`: with `Action` `"/search"` and a `Navigate`
  spy, a search for `foo` navigates to `/search?foo`.

## 7a. The optional leftmost link picker (added 2026-10-07)

`link-picker` — a home icon opening a disclosure of **page links the app defines** — is the leftmost picker, but only when the
app supplies them:

- **Props:** `links` (array of `{ id?, label, href, current?, newTab? }`, default none), `labels.link` (the picker's accessible
  name, required only when `links` is given), and `LinkAttributes` (splatted onto the nested `LinkPicker`); `Labels.Link` is `string?`. There is no default list and no English.
- §L1 With `links` non-empty and `labels.link` set, a `link-picker` renders FIRST — before search — named from `labels.link`, listing
  exactly `links`.
- §L2 With `links` omitted or empty, or `labels.link` missing, no link picker renders and search is first (§7.2 and the search clause unchanged).
- §L3 `LinkAttributes` reach the nested `LinkPicker`.
- §L4 The links are real `<a href>` elements (not a menu).


## 8. Relationship to the six `*-picker` helpers

`PickerBar` wraps five of the `*-picker` helpers in AGENTS/helpers.md
without altering any of their individual contracts — existing counts,
markup, and keyboard behaviour for `search-picker`, `theme-picker`,
`locale-picker`, `text-size-picker`, and `share-picker` are unchanged.
It is additive: a package in this catalog built on top of the other
pickers the same way a real consumer would compose them —
`ProjectReference`d from source in this monorepo, which `dotnet pack`
turns into a real NuGet `<dependency>` on each sibling's own published
version, not vendored or duplicated source.
