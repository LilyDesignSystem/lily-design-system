# `<lily-picker-bar>` — Specification

Single source of truth for the `@lilydesignsystem/web-components-picker-bar`
HTML helper. This file drives implementation, testing, and
documentation: anything not in this spec is out of scope; anything in
this spec must be exercised by a test.

Ported from the canonical Svelte helper
[`@lilydesignsystem/svelte-picker-bar`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar/spec/index.md).
Per [`AGENTS/helpers.md`](../../../AGENTS/helpers.md) the Svelte side
wins on behaviour; this file records the vanilla-custom-element idiom
and the places the API shape could not be carried over verbatim
(§4.3 property-only members, §4.4 the connect-then-append build order).

Sibling files:

- `picker-bar.ts` — the implementation (custom-element class)
- `picker-bar.test.ts` — vitest + jsdom spec exercising every clause in §7
- `index.ts` — barrel re-export + side-effectful registration (of `<lily-picker-bar>` and, transitively, its four wrapped pickers)
- `index.md` — user-facing guide

---

## 1. Purpose

A single page-header row that composes four of the six Lily `*-picker`
helpers in this catalog — `<lily-theme-picker>`, `<lily-locale-picker>`,
`<lily-text-size-picker>`, and `<lily-share-picker>` — with two
catalog-specific defaults pre-wired, so a consumer can drop one
custom element into a header instead of assembling and configuring
four. `<lily-motion-picker>` and `<lily-date-time-picker>` are
deliberately excluded: the former has no natural page-header spot next
to the other three preference pickers picked for this bar, and the
latter is a form control, not a header control — see
[AGENTS/helpers.md](../../../AGENTS/helpers.md).

## 2. Scope

In scope: rendering the four pickers in a fixed order (theme, locale,
text-size, share), forwarding each picker's required and optional
attributes/properties, and supplying two catalog-wide defaults (§5)
so the common case needs no configuration beyond accessible names, a
themes URL, and a locale list. Out of scope: any new interaction,
state, or DOM application beyond what the four wrapped pickers already
do — `<lily-picker-bar>` owns no lifecycle of its own.

## 3. Architectural decisions

- **A helper, but not a preference/action/form-value lifecycle.** It
  is a pure **composition**. It applies nothing to the document and
  persists nothing itself; every behaviour it exhibits belongs to one
  of the four wrapped pickers.
- **Depends on the four wrapped packages as real npm `dependencies`,
  not vendored source.** `picker-bar.ts` imports
  `@lilydesignsystem/web-components-theme-picker`,
  `-locale-picker`, `-text-size-picker`, and `-share-picker` by
  package name — the same way any consumer composing them by hand
  would — and the catalog `build.js`/tsup step is configured to leave
  those four specifiers unbundled (`--external`), so the published
  `dist/index.js` still imports them by name and a real install
  resolves them from `node_modules`.
- **Light DOM, no Shadow DOM.** As with every sibling helper, the
  consumer's CSS reaches the rendered markup through the kebab-case
  class hooks directly.

## 4. Public API

### 4.1 Observed attributes

| Attribute    | Type   | Required | Default             | Purpose                                                              |
| ------------ | ------ | -------- | -------------------- | ---------------------------------------------------------------------- |
| `themes-url` | string | yes      | —                     | Forwarded to `<lily-theme-picker>`'s `themes-url`.                    |
| `themes`     | CSV    | no       | `DEFAULT_THEMES` (§5.1) | Forwarded to `<lily-theme-picker>`'s `themes`.                        |
| `locales`    | CSV    | yes      | —                     | Forwarded to `<lily-locale-picker>`'s `locales`. No catalog default. |
| `sizes`      | CSV    | no       | `DEFAULT_SIZES` (§5.2)  | Forwarded to `<lily-text-size-picker>`'s `sizes`.                     |
| `class`      | string | no       | `""`                  | Extra class on the rendered root `<div>`.                            |

Array attributes are comma-separated strings, matching every other
picker in this catalog; the matching JS property accepts a real
`Array<string>`.

### 4.2 JS properties mirroring the attributes above

`themesUrl`, `themes`, `locales`, `sizes` — writing the property
writes the attribute (`themes`/`locales`/`sizes` as CSV); reading it
reads the attribute (parsed back to an array for the three list
properties).

### 4.3 Property-only members

These cannot be expressed as attributes — they hold objects and
functions — and so are JS-property-only, matching this catalog's
existing convention for `<lily-share-picker>`'s `targets` and
`<lily-date-time-picker>`'s `labels`:

| Property        | Type                                     | Required | Default                         |
| ---------------- | ----------------------------------------- | -------- | --------------------------------- |
| `labels`         | `{ theme, locale, textSize, share }`      | yes      | `{ theme:"", locale:"", textSize:"", share:"" }` |
| `shareTargets`   | `ShareTarget[]` (re-exported from `share-picker`) | no | `[]`                              |
| `themeProps`     | `Partial<ThemePickerProps>`               | no       | `{}`                               |
| `localeProps`    | `Partial<LocalePickerProps>`              | no       | `{}`                               |
| `textSizeProps`  | `Partial<TextSizePickerProps>`            | no       | `{}`                               |
| `shareProps`     | `Partial<SharePickerProps>`               | no       | `{}`                               |

`labels`' default is four empty strings, not English text — mirroring
`<lily-date-time-picker>`'s own `DEFAULT_LABELS` exactly (see its
`spec/index.md`). An omitted `labels` renders four unnamed controls
rather than a name this catalog invented.

Each `*Props` bag accepts that picker's own optional properties
(excluding the ones `<lily-picker-bar>` already lifts to the top
level) and is applied via `Object.assign(childElement, bag)` **after**
the bar's own base configuration, so any key present in the bag —
`storageKey`, `detectFromSystem`, `defaultValue`, `value`, `name`,
`target`, a `*Labels` map, `onChange`, or a `renderButtonContent`
override — wins over `<lily-picker-bar>`'s default.

### 4.4 Build order (implementation detail, not part of the public contract)

The four wrapped pickers are constructed via `document.createElement`
and configured **after** the bar's own root `<div>` is already
connected to the document (`this.replaceChildren(root)` runs before
any child is appended, not after). Appending a still-detached
subtree in one move relies on the engine recursively firing
`connectedCallback` for every descendant custom element, and jsdom
does not do this reliably; connecting the parent chain first and then
appending each child guarantees its `connectedCallback` fires
immediately, in every environment. This is why `<lily-theme-picker>`
etc. must never be rendered by appending them into a detached wrapper
here — a change this package's own contributors should not
"simplify" away.

## 5. Defaults

### 5.1 `DEFAULT_THEMES`

All 45 Lily reference theme slugs (`themes/` at the repo root),
**sorted alphabetically except that every United Kingdom and United
States government/public-sector theme sorts last, as its own
alphabetical group** — 37 general-purpose and public-sector themes
first (`abyss` … `wireframe`), then 8 UK/US themes
(`united-kingdom-government-digital-service` …
`united-states-web-design-system`). Exported as a named constant.

### 5.2 `DEFAULT_SIZES`

The seven-step text-size scale, largest first: `largest`, `larger`,
`large`, `normal`, `small`, `smaller`, `smallest`. Each slug is a
single hyphen-free word, so `<lily-text-size-picker>`'s own default
`labelFor` (title-case each hyphen-separated word) already renders
exactly the requested label — "largest" → "Largest" — with no
`size-labels` override needed.

`<lily-text-size-picker>`'s own initial-value fallback (`default-value`
→ `"medium"` if offered → `sizes[0]`) does not fit this seven-step
scale (`"medium"` is not one of its seven slugs, and falling back to
`sizes[0]` would silently start every consumer at "Largest").
`<lily-picker-bar>` therefore sets `default-value="normal"` on its
`<lily-text-size-picker>` unless `textSizeProps.defaultValue`
overrides it.

## 6. Accessibility

WCAG 2.2 AAA target, unchanged from each wrapped picker's own
contract — `<lily-picker-bar>` introduces no new interaction, so it
introduces no new accessibility surface. `labels` supplies the four
accessible names; there is no default that would hardcode English
text.

## 7. Acceptance criteria

- §7.1 Renders a `<div class="picker-bar {class}">` root inside the
  `<lily-picker-bar>` host.
- §7.2 Renders exactly the four pickers — theme, locale, text-size,
  share — in that order, each accessibly named from `labels`.
- §7.3 Forwards `themes-url` to `<lily-theme-picker>`; `themes` omitted
  resolves to `DEFAULT_THEMES` (45 entries, `abyss` first, the 8
  UK/US themes last as a group).
- §7.4 Forwards `locales` to `<lily-locale-picker>` — required, no
  default.
- §7.5 `class` renders as `"picker-bar {class}"` (trimmed) on the
  root.
- §7.6 An explicit `themes` attribute/property overrides
  `DEFAULT_THEMES`.
- §7.7 `themeProps` (e.g. `storageKey`) reaches the nested
  `<lily-theme-picker>` and takes effect.
- §7.8 `sizes` omitted resolves to `DEFAULT_SIZES` (seven entries,
  largest-to-smallest, titled exactly `Largest` … `Smallest`).
- §7.9 The nested `<lily-text-size-picker>` initial value is `"normal"`
  unless `textSizeProps.defaultValue` overrides it.
- §7.10 `shareTargets` reaches the nested `<lily-share-picker>`'s list.

## 8. Relationship to the six `*-picker` helpers

`<lily-picker-bar>` wraps four of the six `*-picker` helpers in
AGENTS/helpers.md without altering any of their individual contracts —
existing attributes, markup, and keyboard behaviour for
`<lily-theme-picker>`, `<lily-locale-picker>`, `<lily-text-size-picker>`,
and `<lily-share-picker>` are unchanged. It is additive: a seventh
package in this catalog, built on top of the other six the same way a
real consumer would compose them.
