# PickerBar — Specification (HTML helper)

Canonical contract ported from `lily-design-system-svelte-picker-bar`
(see that package's `spec/index.md`, the reference for every framework
port). This file follows its § numbering.

## 1. Purpose

A single page-header element, `<picker-bar>`, that composes four of the
six `*-picker` helpers — `theme-picker`, `locale-picker`,
`text-size-picker`, and `share-picker` — with sensible catalog-wide
defaults pre-wired, so a consumer can drop one custom element into a
header instead of assembling and configuring four. `motion-picker` and
`date-time-picker` are deliberately excluded — see the Svelte spec §1
and [AGENTS/helpers.md](../../../AGENTS/helpers.md).

## 2. Scope

In scope: rendering the four pickers in a fixed order (theme, locale,
text-size, share) inside one `<div class="picker-bar {class}">`,
forwarding each picker's required and optional configuration, and
supplying two catalog-specific defaults (§5.1, §5.2). Out of scope: any
new interaction, state, or DOM application beyond what the four wrapped
custom elements already do — `<picker-bar>` owns no lifecycle of its
own.

## 3. HTML

```html
<picker-bar>
  <div class="picker-bar {class}">
    <theme-picker>…</theme-picker>
    <locale-picker>…</locale-picker>
    <text-size-picker>…</text-size-picker>
    <share-picker>…</share-picker>
  </div>
</picker-bar>
```

`<picker-bar>` itself is a light-DOM custom element (matching every
other helper in this catalog): it renders a `<div class="picker-bar
{class}">` as its one child, which in turn holds the four real,
unmodified sibling elements — same class hooks, same ARIA, same
keyboard contract as documented in that element's own `spec/index.md`.

## 4. Attributes and properties

| Attribute      | Property        | Type                          | Required | Default              |
| -------------- | ---------------- | ------------------------------ | -------- | --------------------- |
| —              | `labels`         | `PickerBarLabels`              | yes      | —                      |
| `themes-url`   | `themesUrl`      | `string`                       | yes      | —                      |
| `themes`       | `themes`         | `string[]` (CSV attr)          | no       | `DEFAULT_THEMES` (§5.1) |
| —              | `themeProps`     | `Partial<ThemePickerProps>`    | no       | `{}`                   |
| `locales`      | `locales`        | `string[]` (CSV attr)          | yes      | —                      |
| —              | `localeProps`    | `Partial<LocalePickerProps>`   | no       | `{}`                   |
| `sizes`        | `sizes`          | `string[]` (CSV attr)          | no       | `DEFAULT_SIZES` (§5.2)  |
| —              | `textSizeProps`  | `Partial<TextSizePickerProps>` | no       | `{}`                   |
| —              | `shareTargets`   | `ShareTarget[]`                | no       | `[]`                   |
| —              | `shareProps`     | `Partial<SharePickerProps>`    | no       | `{}`                   |
| `class`        | `className`\*    | `string`                       | no       | `""`                   |

\* `class` on the `<picker-bar>` host element itself, read via the
standard `getAttribute("class")` / `element.className`, following this
catalog's existing convention (e.g. `<theme-picker>`).

`labels` (`{ theme, locale, textSize, share }`, the four accessible
names) and `shareTargets` (its `href` is a function) are **property-only**
— no honest attribute encoding exists for either, the same reasoning
`date-time-picker`'s `labels` and `share-picker`'s `targets` already
document. There is no default for `labels`' four strings (all resolve
to `""` until set) — a nav control this catalog invented gets no
English default, matching `date-time-picker`'s precedent.

The four `*Props` bags (`themeProps`, `localeProps`, `textSizeProps`,
`shareProps`) are also property-only. Each is applied via
`Object.assign(childElement, bag)` **before** the child element is
connected to the document — so a property that reflects to an attribute
(`storageKey`, `detectFromSystem`, `defaultValue`, `value`, `name`,
`extension`, a `*Labels` map, …) still takes effect during the child's
own first-connect initial-value resolution, exactly as if the consumer
had set it directly. Applied after `<picker-bar>`'s own defaults, so
anything in a bag overrides them.

Composed elements are exposed as read-only properties once rendered:
`themePicker`, `localePicker`, `textSizePicker`, `sharePicker` each
return that child's live element instance (or `null` before first
render), for a consumer who wants to read state or attach a listener
after mount rather than pre-configure via a `*Props` bag.

`themes`, `locales`, and `sizes` follow the same CSV-attribute /
`string[]`-property convention as `theme-picker`'s own `themes`,
`locale-picker`'s own `locales`, and `text-size-picker`'s own `sizes` —
including the same round-trip limitation: an attribute and a property
both collapse to the same comma-separated string, so an explicitly
empty override (`themes=""` or `el.themes = []`) is indistinguishable
from "unset" and resolves to the built-in default rather than an empty
list. This is a pre-existing limitation of the CSV encoding, not new to
`<picker-bar>`.

## 5. Defaults

### 5.1 `DEFAULT_THEMES`

Identical array, identical ordering rationale, to the canonical Svelte
spec §5.1: all 45 Lily reference theme slugs, alphabetical except the 8
UK/US government/public-sector themes moved to their own alphabetical
group at the bottom.

### 5.2 `DEFAULT_SIZES`

Identical to the canonical Svelte spec §5.2: the seven-step scale
`largest`, `larger`, `large`, `normal`, `small`, `smaller`, `smallest`.
`<text-size-picker>`'s own initial-value fallback (`defaultValue` →
`"medium"` if offered → `sizes[0]`) does not fit this scale, so
`<picker-bar>` sets `defaultValue="normal"` on its `<text-size-picker>`
child before `textSizeProps` is applied, unless `textSizeProps`
overrides it.

## 6. Accessibility

WCAG 2.2 AAA target, unchanged from each wrapped picker's own contract
— `<picker-bar>` introduces no new interaction, so it introduces no new
accessibility surface. `labels` supplies the four accessible names;
there is no default that would hardcode English text.

## 7. Acceptance criteria

- §7.1 Renders a `<div class="picker-bar {class}">` inside the
  `<picker-bar>` host.
- §7.2 Renders exactly the four pickers — theme, locale, text-size,
  share — in that order, each accessibly named from `labels`.
- §7.3 Forwards `themesUrl` to `<theme-picker>`; `themes` omitted
  resolves to `DEFAULT_THEMES` (45 entries, `abyss` first, the 8 UK/US
  themes last as a group).
- §7.4 Forwards `locales` to `<locale-picker>` — required, no default.
- §7.5 Extra attributes set on the `<picker-bar>` host stay on the
  host (e.g. `data-testid`), not injected into the inner wrapper.
- §7.6 An explicit `themes` property/attribute overrides
  `DEFAULT_THEMES`.
- §7.7 `themeProps` (e.g. `storageKey`) reaches the nested
  `<theme-picker>` and takes effect on first connect (persistence
  actually occurs).
- §7.8 `sizes` omitted resolves to `DEFAULT_SIZES` (seven entries,
  largest-to-smallest).
- §7.9 The nested `<text-size-picker>`'s initial value is `"normal"`
  unless `textSizeProps.defaultValue` overrides it.
- §7.10 `shareTargets` reaches the nested `<share-picker>`'s `targets`.
- §7.11 `localeProps`, `shareProps` reach their respective pickers, the
  same way `themeProps` and `textSizeProps` do (§7.7, §7.9).

## 8. Relationship to the six `*-picker` helpers

Wraps four of the six `*-picker` helpers without altering any of their
individual contracts — existing markup, attributes, and keyboard
behaviour for `<theme-picker>`, `<locale-picker>`, `<text-size-picker>`,
and `<share-picker>` are unchanged. Depends on the four wrapped
packages as ordinary npm `dependencies`, not vendored or duplicated
source — the same way a real consumer composing them by hand would;
the catalog `build.js` marks each of a package's own `dependencies` as
external so the built `dist/` keeps those bare imports rather than
bundling or erroring on them.
