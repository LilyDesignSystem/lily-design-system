# PickerBar — Specification (React helper)

Ports [the canonical Svelte package's spec/index.md](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar/spec/index.md)
one-to-one; only framework-specific detail (React function component +
props instead of Svelte runes) differs. Same § numbering.

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
props, and supplying two catalog-specific defaults (§5.1, §5.2) so the
common case needs no configuration beyond accessible names, a themes
URL, and a locale list. Out of scope: any new interaction, state, or
DOM application beyond what the five wrapped pickers already do —
`PickerBar` owns no lifecycle of its own.

## 3. HTML

```html
<div class="picker-bar {className}" ...restProps>
  <div class="search-picker">…</div>
  <div class="theme-picker">…</div>
  <div class="locale-picker">…</div>
  <div class="text-size-picker">…</div>
  <div class="share-picker">…</div>
</div>
```

Each child is the real, unmodified picker component from its own
package — same class hooks, same ARIA, same keyboard contract as
documented in that package's own `spec/index.md`. `PickerBar` adds no
markup of its own beyond the root wrapper.

## 4. Props

| Prop            | Type                                | Required | Default              |
| --------------- | ------------------------------------ | -------- | --------------------- |
| `labels`         | `{ search, searchInput, searchSubmit, theme, locale, textSize, share }` | yes | — |
| `searchProps`    | `Partial<SearchPicker Props>`        | no       | `{}`                   |
| `themesUrl`      | `string`                             | yes      | —                      |
| `themes`         | `string[]`                           | no       | `DEFAULT_THEMES` (§5.1) |
| `themeProps`     | `Partial<ThemePicker Props>`         | no       | `{}`                   |
| `locales`        | `string[]`                           | yes      | —                      |
| `localeProps`    | `Partial<LocalePicker Props>`        | no       | `{}`                   |
| `sizes`          | `string[]`                           | no       | `DEFAULT_SIZES` (§5.2)  |
| `textSizeProps`  | `Partial<TextSizePicker Props>`      | no       | `{}`                   |
| `shareTargets`   | `ShareTarget[]`                      | no       | `[]`                   |
| `shareProps`     | `Partial<SharePicker Props>`         | no       | `{}`                   |
| `className`      | `string`                             | no       | `""`                   |

`labels` carries the seven accessible names as one object, following
`date-time-picker`'s precedent (AGENTS/helpers.md): structural labels
this catalog did not invent get no English default. Search needs three
— `search` (its icon button and search landmark), `searchInput` (the
field) and `searchSubmit` (the `⏎` button), passed as `SearchPicker`'s
`label`, `inputLabel` and `submitLabel` — the others one each. There
is no top-level `label` — it would be ambiguous across five controls.

Each `*Props` bag accepts that picker's own optional props (excluding
the ones `PickerBar` already lifts to the top level — `themesUrl` /
`themes`, `locales`, `sizes`, `targets`, and search's three labels) and is spread onto that picker
**after** `PickerBar`'s own props, so anything in the bag — including
`storageKey`, `detectFromSystem`, `defaultValue`, `value`, `name`,
`target`, a `*Labels` map, `className`, `onChange`, or a `children`
render prop — wins over `PickerBar`'s default. `PickerBar` is a thin
wrapper: it pre-wires two defaults (§5) and otherwise gets out of the
way.

## 5. Defaults

### 5.1 `DEFAULT_THEMES`

All 45 Lily reference theme slugs (`themes/` at the repo root),
**sorted alphabetically except that every United Kingdom and United
States government/public-sector theme sorts last, as its own
alphabetical group** — 37 general-purpose and public-sector themes
first (`abyss` … `wireframe`), then 8 UK/US themes
(`united-kingdom-government-digital-service` …
`united-states-web-design-system`). This is a maintainer-directed
ordering, not derived from any existing catalog rule: most consumers
picking a theme are choosing a visual style, not a jurisdiction, so the
general-purpose themes lead; the UK/US public-sector themes are grouped
at the bottom because they are usually chosen as a set by a specific
deployment rather than browsed individually.

Exported as a named constant so a consumer building a custom listbox
(via `themeProps.children`) can reuse the same ordering, and so a test
or a future port can assert against it directly rather than
re-deriving it from `themes/`.

### 5.2 `DEFAULT_SIZES`

The seven-step text-size scale, largest first: `largest`, `larger`,
`large`, `normal`, `small`, `smaller`, `smallest`. Each slug is a
single hyphen-free word, so `text-size-picker`'s own default
`labelFor` (title-case each hyphen-separated word) already renders
exactly the requested label — "largest" → "Largest" — with no
`sizeLabels` override needed.

`text-size-picker`'s own initial-value fallback (`defaultValue` →
`"medium"` if offered → `sizes[0]`) does not fit this seven-step scale
(`"medium"` is not one of its seven slugs, and falling back to
`sizes[0]` would silently start every consumer at "Largest"). `PickerBar`
therefore passes `defaultValue="normal"` to its `TextSizePicker`
unless `textSizeProps.defaultValue` overrides it.

## 6. Accessibility

WCAG 2.2 AAA target, unchanged from each wrapped picker's own
contract (§6 of `search-picker`, `theme-picker`, `locale-picker`,
`text-size-picker`, and `share-picker`'s respective specs) — `PickerBar` introduces no new
interaction, so it introduces no new accessibility surface. `labels`
supplies all seven accessible names; there is no default that would
hardcode English text.

## 7. Acceptance criteria

- §7.1 Renders a `<div class="picker-bar {className}">` root, extra
  attributes spread onto it.
- §7.2 Renders exactly the five pickers — search, theme, locale,
  text-size, share — in that order, each accessibly named from `labels`.
- §7.3 Forwards `themesUrl` to `ThemePicker`; `themes` omitted resolves
  to `DEFAULT_THEMES` (45 entries, `abyss` first, the 8 UK/US themes
  last as a group).
- §7.4 Forwards `locales` to `LocalePicker` — required, no default.
- §7.5 `className` renders as `"picker-bar {className}"` (trimmed) on
  the root.
- §7.6 An explicit `themes` prop overrides `DEFAULT_THEMES`.
- §7.7 `themeProps` (e.g. `storageKey`) reaches the nested
  `ThemePicker` and takes effect.
- §7.8 `sizes` omitted resolves to `DEFAULT_SIZES` (seven entries,
  largest-to-smallest, titled exactly `Largest` … `Smallest`).
- §7.9 The nested `TextSizePicker` initial value is `"normal"` unless
  `textSizeProps.defaultValue` overrides it.
- §7.10 `shareTargets` reaches the nested `SharePicker`'s list.
- §7.11 `localeProps`, `shareProps` reach their respective pickers, the
  same way `themeProps` and `textSizeProps` do (§7.7, §7.9).
- §7.12 Search is the first picker; its field and `⏎` button are
  named from `labels.searchInput` and `labels.searchSubmit`.
- §7.13 `searchProps` (e.g. `action`, `navigate`) reaches the nested
  `SearchPicker`: with `action: "/search"`, a search for `foo`
  navigates to `/search?foo`.
- §7.14 Each nested picker renders its own `-tooltip` element holding its
  button's `label`, `hidden` at rest (the tooltip is the pickers' own
  contract; the bar adds nothing).

## 7a. The optional leftmost link picker (added 2026-10-07)

`link-picker` — a home icon opening a disclosure of **page links the app defines** — is the leftmost picker, but only when the
app supplies them:

- **Props:** `links` (array of `{ id?, label, href, current?, newTab? }`, default none), `labels.link` (the picker's accessible
  name, required only when `links` is given), and `linkProps` (extra `LinkPicker` props, e.g. `navigate`, `onNavigate`). There is no default list and no English.
- §L1 With `links` non-empty and `labels.link` set, a `link-picker` renders FIRST — before search — named from `labels.link`, listing
  exactly `links`.
- §L2 With `links` omitted or empty, or `labels.link` missing, no link picker renders and search is first (§7.2 and the search clause unchanged).
- §L3 `linkProps` reaches the nested `LinkPicker` (`navigate`).
- §L4 The links are real `<a href>` elements (not a menu).


## 8. Relationship to the six `*-picker` helpers

`PickerBar` wraps five of the `*-picker` helpers in AGENTS/helpers.md
without altering any of their individual contracts — existing counts,
markup, and keyboard behaviour for `search-picker`, `theme-picker`,
`locale-picker`, `text-size-picker`, and `share-picker` are unchanged.
It is additive: a seventh package in each `*-helpers` catalog, built on
top of the other six the same way a real consumer would compose them —
declared as ordinary npm `dependencies`, not vendored or duplicated
source.

## 9. Framework-specific note: the build must externalize its siblings

Unlike Svelte's `svelte-package` (which copies `.svelte` source
unmodified and never resolves imports), `tsup` is a real bundler and by
default inlines any importable module it can resolve — including a
sibling `lily-design-system-react-*` package's whole compiled `dist/`.
Because this catalog's `build.js` (added alongside this package) runs
from the catalog root rather than each package's own directory, tsup's
own "treat a package's declared `dependencies` as external" heuristic
never sees `package.json`'s `dependencies` field either. `build.js`
works around both by discovering every `lily-design-system-react-*`
sibling directory and passing each as `--external` to every build — a
no-op for a package that doesn't import it, and correct for
`picker-bar`, whose `dist/index.js` must keep its five bare imports
(`@lilydesignsystem/react-search-picker`, `-theme-picker`, `-locale-picker`,
`-text-size-picker`, `-share-picker`) unresolved, exactly like the
canonical Svelte package's `dist/PickerBar.svelte` does.
