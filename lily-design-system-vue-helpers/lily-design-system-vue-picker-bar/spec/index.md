# PickerBar — Specification (Vue helper)

Canonical contract ported from
[the Svelte package's spec/index.md](../../lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar/spec/index.md)
(`lily-design-system-svelte-picker-bar`). Same § numbering; framework
idiom swapped (props/emits instead of props/callback-props, `v-bind`
instead of prop-bag spread).

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
text-size, share), forwarding each picker's required and optional
props, and supplying two catalog-specific defaults (§5.1, §5.2) so the
common case needs no configuration beyond accessible names, a themes
URL, and a locale list. Out of scope: any new interaction, state, or
DOM application beyond what the four wrapped pickers already do —
`PickerBar` owns no lifecycle of its own.

## 3. HTML

```html
<div class="picker-bar {class}">
  <div class="theme-picker">…</div>
  <div class="locale-picker">…</div>
  <div class="text-size-picker">…</div>
  <div class="share-picker">…</div>
</div>
```

Each child is the real, unmodified picker component from its own
package — same class hooks, same ARIA, same keyboard contract as
documented in that package's own `spec/index.md`. `PickerBar` adds no
markup of its own beyond the root wrapper. Extra attributes
(`data-testid`, `id`, …) land on the root via Vue's default
single-root `inheritAttrs` fallthrough — the same mechanism every
sibling picker in this catalog already relies on, no manual
`v-bind="$attrs"` needed.

## 4. Props

| Prop            | Type                                | Required | Default              |
| --------------- | ------------------------------------ | -------- | --------------------- |
| `labels`         | `{ theme, locale, textSize, share }` | yes      | —                      |
| `themesUrl`      | `string`                             | yes      | —                      |
| `themes`         | `string[]`                           | no       | `DEFAULT_THEMES` (§5.1) |
| `themeProps`     | `Partial<ThemePicker Props>`         | no       | `{}`                   |
| `locales`        | `string[]`                           | yes      | —                      |
| `localeProps`    | `Partial<LocalePicker Props>`        | no       | `{}`                   |
| `sizes`          | `string[]`                           | no       | `DEFAULT_SIZES` (§5.2)  |
| `textSizeProps`  | `Partial<TextSizePicker Props>`      | no       | `{}`                   |
| `shareTargets`   | `ShareTarget[]`                      | no       | `[]`                   |
| `shareProps`     | `Partial<SharePicker Props>`         | no       | `{}`                   |
| `class`          | `string`                             | no       | `""`                   |

`labels` carries the four accessible names as one object, following
`date-time-picker`'s precedent (AGENTS/helpers.md): four structural
labels this catalog did not invent get no English default. There is no
top-level `label` — it would be ambiguous across four controls.

Each `*Props` bag accepts that picker's own optional props (excluding
the ones `PickerBar` already lifts to the top level — `themesUrl` /
`themes`, `locales`, `sizes`, `targets`) and is applied to that picker
via `v-bind="{picker}Props"`, placed **after** `PickerBar`'s own
`:prop` bindings in the template — Vue resolves duplicate keys on a
component tag in source order, so a key present in the bag wins over
`PickerBar`'s default. `PickerBar` is a thin wrapper: it pre-wires two
defaults (§5) and otherwise gets out of the way.

## 4.1 Events

Vue separates props from events, unlike the Svelte canonical's
`onChange` callback prop inside each `*Props` bag. `PickerBar`
re-emits each wrapped picker's own event under a bar-scoped, fully
typed name instead of accepting an untyped `onChange` key inside a
props bag:

| PickerBar event    | Forwarded from              |
| ------------------- | ---------------------------- |
| `theme-change`       | `ThemePicker`'s `change`     |
| `locale-change`      | `LocalePicker`'s `change`    |
| `text-size-change`   | `TextSizePicker`'s `change`  |
| `share`              | `SharePicker`'s `share`      |
| `copy`               | `SharePicker`'s `copy`       |
| `native-share`       | `SharePicker`'s `nativeShare`|

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
(via `themeProps`'s default-slot override) can reuse the same
ordering, and so a test can assert against it directly rather than
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
therefore binds `defaultValue="normal"` to its `TextSizePicker` unless
`textSizeProps.defaultValue` overrides it.

## 6. Accessibility

WCAG 2.2 AAA target, unchanged from each wrapped picker's own
contract (§6 of `theme-picker`, `locale-picker`, `text-size-picker`,
and `share-picker`'s respective specs) — `PickerBar` introduces no new
interaction, so it introduces no new accessibility surface. `labels`
supplies the four accessible names; there is no default that would
hardcode English text.

## 7. Acceptance criteria

- §7.1 Renders a `<div class="picker-bar {class}">` root, with extra
  attributes falling through onto it.
- §7.2 Renders exactly the four pickers — theme, locale, text-size,
  share — in that order, each accessibly named from `labels`.
- §7.3 Forwards `themesUrl` to `ThemePicker`; `themes` omitted resolves
  to `DEFAULT_THEMES` (45 entries, `abyss` first, the 8 UK/US themes
  last as a group).
- §7.4 Forwards `locales` to `LocalePicker` — required, no default.
- §7.5 `class` renders as `"picker-bar {class}"` (trimmed) on the root.
- §7.6 An explicit `themes` prop overrides `DEFAULT_THEMES`.
- §7.7 `themeProps` (e.g. `storageKey`) reaches the nested
  `ThemePicker` and takes effect.
- §7.8 `sizes` omitted resolves to `DEFAULT_SIZES` (seven entries,
  largest-to-smallest, titled exactly `Largest` … `Smallest`).
- §7.9 The nested `TextSizePicker` initial value is `"normal"` unless
  `textSizeProps.defaultValue` overrides it.
- §7.10 `shareTargets` reaches the nested `SharePicker`'s list.
- §7.11 `PickerBar` re-emits each wrapped picker's own change/action
  event under a bar-scoped name (§4.1).

## 8. Relationship to the six `*-picker` helpers

`PickerBar` wraps four of the six `*-picker` helpers in
AGENTS/helpers.md without altering any of their individual contracts —
existing counts, markup, and keyboard behaviour for `theme-picker`,
`locale-picker`, `text-size-picker`, and `share-picker` are unchanged.
It is additive: a seventh package in this catalog, built on top of the
other six the same way a real consumer would compose them — declared
as ordinary npm `dependencies`, not vendored or duplicated source.

## 9. Build note (Vue-specific, not part of the Svelte canonical)

Unlike the Svelte catalog (whose `svelte-package` build copies source
files without bundling), this catalog's `build.mjs` compiles each
sub-package with **Vite library mode**, which bundles by default. The
four sibling packages are added to `vite.lib.config.ts`'s
`rollupOptions.external` (alongside `vue`) so `PickerBar`'s built
`dist/index.js` keeps real `import … from "lily-design-system-vue-*-picker"`
statements instead of inlining each sibling's implementation — verified
by inspecting the built output, not just by absence of a build error.

Declaration emission (`vue-tsc`) hit a separate, real defect while
building this package: loading more than one pre-built
`{Pascal}.vue.d.ts` shim into one `vue-tsc` program throws
`TS6200: Definitions of the following identifiers conflict with those
in another file` for the `__VLS_*` globals each shim declares — since
`PickerBar.vue`'s template renders all four siblings at once, this is
unavoidable via `tsconfig` `paths` pointing at the real generated
declarations. Fixed with a local, unpublished `shims.d.ts` (loose,
`any`-typed ambient module declarations for the four specifiers,
included only for this package's own build via a generic addition to
`build.mjs`'s throwaway tsconfig) that sidesteps the conflicting
generated shims entirely. This only weakens *this package's own local
build-time* type-checking of the four nested components — the
*published* `dist/PickerBar.vue.d.ts` still imports the real `Props`
types from each sibling's bare specifier, so a real consumer installing
`lily-design-system-vue-picker-bar` gets full type safety from their
own installed copies of the four dependencies.
