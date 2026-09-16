# PickerBar — Specification (Angular helper)

Canonical contract:
[the Svelte package's spec/index.md](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar/spec/index.md).
This file mirrors its § numbering, adjusted for Angular idiom.

## 1. Purpose

A single page-header row that composes four of the six `*-picker`
helpers — `theme-picker`, `locale-picker`, `text-size-picker`, and
`share-picker` — with sensible catalog-wide defaults pre-wired, so a
consumer can drop one component into a header instead of assembling
and configuring four. `motion-picker` and `date-time-picker` are
deliberately excluded: the former has no natural page-header spot next
to the other three preference pickers picked for this bar, and the
latter is a form control, not a header control — see
[AGENTS/helpers.md](../../../AGENTS/helpers.md).

## 2. Scope

In scope: rendering the four pickers in a fixed order (theme, locale,
text-size, share), forwarding each picker's required and commonly-used
optional inputs, and supplying two catalog-specific defaults (§5.1,
§5.2). Out of scope: any new interaction, state, or DOM application
beyond what the four wrapped pickers already do — `PickerBar` owns no
lifecycle of its own.

## 3. HTML

```html
<div class="picker-bar {className}">
  <lily-theme-picker>…</lily-theme-picker>
  <lily-locale-picker>…</lily-locale-picker>
  <lily-text-size-picker>…</lily-text-size-picker>
  <lily-share-picker>…</lily-share-picker>
</div>
```

Each child is the real, unmodified component from its own package —
same class hooks, ARIA, and keyboard contract as documented in that
package's own `spec/index.md`. Angular does not strip the wrapping
custom-element host tag (`<lily-theme-picker>`), so each picker's own
root `<div class="theme-picker">` etc. sits one DOM level inside its
host tag, not as a direct child of `.picker-bar`. `PickerBar` adds no
markup of its own beyond the root wrapper.

## 4. Inputs

| Input                       | Type                     | Required | Default              |
| ---------------------------- | ------------------------ | -------- | --------------------- |
| `labels`                     | `PickerBarLabels`        | yes      | —                      |
| `themesUrl`                  | `string`                 | yes      | —                      |
| `themes`                     | `string[]`               | no       | `DEFAULT_THEMES` (§5.1) |
| `themeValue`                 | `string` (model, 2-way)  | no       | `""`                   |
| `themeDefaultValue`          | `string`                 | no       | `""`                   |
| `themeStorageKey`            | `string`                 | no       | `""`                   |
| `themeDetectFromSystem`      | `boolean`                | no       | `false`                |
| `themeName`                  | `string`                 | no       | `"theme"`              |
| `themeTarget`                | `HTMLElement \| null`    | no       | `null`                 |
| `themeLabels`                | `Record<string,string>`  | no       | `{}`                   |
| `locales`                    | `string[]`               | yes      | —                      |
| `localeValue`                | `string` (model, 2-way)  | no       | `""`                   |
| `localeDefaultValue`         | `string`                 | no       | `""`                   |
| `localeStorageKey`           | `string`                 | no       | `""`                   |
| `localeDetectFromNavigator`  | `boolean`                | no       | `false`                |
| `localeName`                 | `string`                 | no       | `"locale"`             |
| `localeTarget`                | `HTMLElement \| null`    | no       | `null`                 |
| `localeApplyDir`              | `boolean`                | no       | `true`                 |
| `localeLabels`                | `Record<string,string>`  | no       | `{}`                   |
| `sizes`                       | `string[]`               | no       | `DEFAULT_SIZES` (§5.2)  |
| `textSizeValue`                | `string` (model, 2-way)  | no       | `""`                   |
| `textSizeDefaultValue`         | `string`                 | no       | `"normal"`              |
| `textSizeStorageKey`           | `string`                 | no       | `""`                   |
| `textSizeName`                 | `string`                 | no       | `"text-size"`          |
| `textSizeTarget`                | `HTMLElement \| null`    | no       | `null`                 |
| `textSizeLabels`                | `Record<string,string>`  | no       | `{}`                   |
| `shareTargets`                  | `ShareTarget[]`          | no       | `[]`                    |
| `shareUrl` / `shareTitle` / `shareText` | `string`      | no       | `""`                    |
| `copyLabel` / `copiedLabel` / `copyFailedLabel` | `string` | no    | `""`                    |
| `shareStrategy`                  | `ShareStrategy`         | no       | `"auto"`                |
| `className`                      | `string`                | no       | `""`                    |

Outputs: `share` (`ShareEvent`), `copy` (`string`), `nativeShare`
(`string`) — forwarded from the wrapped `SharePicker` unmodified.
`themeValue`, `localeValue`, and `textSizeValue` are Angular `model()`
signals: each auto-generates a paired `{name}Change` output, so a
consumer can either two-way bind (`[(themeValue)]="…"`) or listen for
the change event, without `PickerBar` needing a separate forwarded
`onChange` callback the way the canonical Svelte contract's `*Props`
bag exposes one.

**Deviation from the canonical Svelte contract.** Svelte's `PickerBar`
exposes a `themeProps` / `localeProps` / `textSizeProps` / `shareProps`
object per picker, spread onto that picker after the bar's own props,
so literally any of that picker's props can be overridden. Angular has
no equivalent generic spread-onto-inputs mechanism for component
bindings — every binding is a named `[input]="…"` in the template — so
this port flattens each wrapped picker's most commonly needed optional
inputs onto `PickerBar`'s own inputs instead (prefixed `theme…`,
`locale…`, `textSize…`). This covers persistence, detection, initial
value, per-option label maps, the hidden-input `name`, and the DOM
`target` for the three preference pickers, and the full prop surface
for `share-picker` (it has few enough inputs to expose all of them). A
consumer who needs something not flattened here (e.g. a custom icon
template via `ThemePickerIcon`/`LocalePickerIcon`/etc.) drops down to
composing the four wrapped pickers directly instead of using
`PickerBar` — the same escape hatch any composed-page demo already
uses for one-off cases.

## 5. Defaults

### 5.1 `DEFAULT_THEMES`

Identical array, same ordering rationale, as
[the Svelte spec §5.1](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar/spec/index.md#51-default_themes):
all 45 Lily reference theme slugs, alphabetical, with the 8 UK/US
government/public-sector themes moved to their own alphabetical group
at the bottom.

### 5.2 `DEFAULT_SIZES`

Identical array, same rationale, as
[the Svelte spec §5.2](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar/spec/index.md#52-default_sizes):
the seven-step scale `largest`, `larger`, `large`, `normal`, `small`,
`smaller`, `smallest`. `text-size-picker`'s own initial-value fallback
does not fit this scale (`"medium"` is not one of the seven slugs), so
`PickerBar` passes `textSizeDefaultValue="normal"` by default.

## 6. Accessibility

WCAG 2.2 AAA target, unchanged from each wrapped picker's own
contract — `PickerBar` introduces no new interaction, so it introduces
no new accessibility surface. `labels` supplies the four accessible
names; there is no default that would hardcode English text.

## 7. Acceptance criteria

- §7.1 Renders a `<div class="picker-bar {className}">` root.
- §7.2 Renders exactly the four pickers — theme, locale, text-size,
  share — in that order, each accessibly named from `labels`.
- §7.3 Forwards `themesUrl` to `ThemePicker`; `themes` omitted resolves
  to `DEFAULT_THEMES` (45 entries, `abyss` first, the 8 UK/US themes
  last as a group).
- §7.4 Forwards `locales` to `LocalePicker` — required, no default.
- §7.5 (reserved — `className` covered by §7.1; no separate clause needed)
- §7.6 An explicit `themes` input overrides `DEFAULT_THEMES`.
- §7.7 `themeStorageKey` reaches the nested `ThemePicker` and takes effect.
- §7.8 `sizes` omitted resolves to `DEFAULT_SIZES` (seven entries,
  largest-to-smallest, titled exactly `Largest` … `Smallest`).
- §7.9 The nested `TextSizePicker` initial value is `"normal"` unless
  `textSizeDefaultValue` overrides it.
- §7.10 `shareTargets` reaches the nested `SharePicker`'s list.

## 8. Relationship to the six `*-picker` helpers

`PickerBar` wraps four of the six `*-picker` helpers in
AGENTS/helpers.md without altering any of their individual contracts —
existing counts, markup, and keyboard behaviour for `theme-picker`,
`locale-picker`, `text-size-picker`, and `share-picker` are unchanged.
It is additive: a seventh package in this catalog, built on top of the
other six the same way a real consumer would compose them — declared
as ordinary npm `dependencies` (`allowedNonPeerDependencies` in
`ng-package.json`), not vendored or duplicated source.
