# Props reference

Field-by-field reference for every public prop. The contract is
owned by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

`aria-label` on **both** the trigger `<button>` and the
`<ul role="listbox">`. Always supplied, always translatable.

The button is icon-only, so this is its *entire* accessible name —
there is no visible text to fall back to. A wrong, missing, or
untranslated `label` leaves the control announced as a bare "button".

There is a wrinkle here that theme-select does not have: a locale
select is the one control a user reaches for **when the page is in a
language they cannot read**. If `label` is translated into the current
page language, the user who landed on the wrong locale cannot find it.
Two common answers:

- Keep `label` in the current UI language, and rely on the globe glyph
  being a recognised affordance.
- Give `label` a bilingual value — `"Language / Idioma"` — for the
  small set of locales your audience actually mixes.

Pick deliberately; the component has no opinion.

> **Removed in the icon-button rewrite:** `placeholder`. It described
> the leading `<option>` of the old native `<select>`, and there is no
> `<select>` left to pin. Delete the prop from your usage; the
> `.locale-select-placeholder` class hook is gone too.

## `locales` — required, string[]

The locale codes the select exposes as options — one
`<li role="option">` per entry, in array order.

Codes are accepted in either separator form: `"en_US"` and `"en-US"`
are both understood. The code you pass is the code you get back from
`update:value` and `change` — the component never rewrites your
"consumer form". Only the DOM `lang` attribute is normalised to the
BCP 47 hyphen form. See [bcp47.md](./bcp47.md) for why that split
exists.

Array order is the keyboard order: `ArrowDown` walks it forwards,
`Home` / `End` jump to `locales[0]` / the last entry, and `ArrowUp` on
the closed button opens with the last entry active.

Order the array the way your audience thinks, not alphabetically by
English name. Most-used locales first is usually right; see
[`../examples/nhs-style.vue`](../examples/nhs-style.vue).

## `value` — optional, string (v-model:value)

The active locale code. Two-way bindable with `v-model:value` so the
surrounding code can read and write the selection.

When supplied as a non-empty string, the select treats it as the
authoritative initial value — `storageKey`, `detectFromNavigator`, and
`defaultValue` are all skipped on first mount. This is what makes the
server-resolved case work: a cookie read during SSR becomes `value`,
and nothing client-side second-guesses it.

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "lily-design-system-vue-locale-select";

const locale = ref("fr");
</script>

<template>
    <LocaleSelect label="Language" :locales="['en', 'fr']" v-model:value="locale" />
    <p>Active: {{ locale }}</p>
</template>
```

## `defaultValue` — optional, string

The initial locale when nothing else resolves one. Sits *after*
storage and navigator detection in the resolution order, so it is a
floor, not an override.

If omitted, the floor is `"en"` when `"en"` is in `locales`, otherwise
`locales[0]`.

## `storageKey` — optional, string

When set, the select writes the selected code to
`localStorage[storageKey]` on every change, and reads it back on the
next mount.

Namespace the key — `"my-app:locale"` — so two apps on the same origin
do not fight. Writes are wrapped in `try` / `catch`: Safari private
mode and storage-quota errors are swallowed rather than thrown, so a
blocked write degrades to "the choice does not persist", never to a
crash.

Persistence is opt-in on purpose. A locale preference is arguably
personal data, and some deployments must not write it without consent.

## `detectFromNavigator` — optional, boolean, default `false`

When `true` and nothing more authoritative resolved a value, the
select matches `navigator.languages` (falling back to
`navigator.language`) against `locales` and uses the first hit.

Matching is two-pass, per
[`matchNavigatorLanguage`](../LocaleSelect.vue): an exact match wins
first (treating `-` and `_` as equivalent, case-insensitively), then a
language-only match — `navigator` says `fr-CA`, you offer `fr`, the
user gets `fr`. If neither pass hits, detection yields `""` and
resolution falls through to `defaultValue`.

Off by default because it is a fingerprinting-adjacent read and
because many apps want a deterministic first paint. It mirrors
`detectFromSystem` on theme-select.

## `name` — optional, string, default `"locale"`

The `name` of the hidden `<input type="hidden">` the component
renders, so the selection posts with a surrounding form. It is **not**
the name of a `<select>` — there is no `<select>` any more.

Set it when the value posts under a different field name, or when two
locale selects sit in one form.

## `target` — optional, HTMLElement | null

The element that receives `lang` and `dir`. Defaults to
`document.documentElement` (`<html>`).

Point it at a subtree element to scope a locale change to one region
of the page rather than the whole document — a preview pane, a
comment thread, an embedded quotation. See
[`../examples/scoped-target.vue`](../examples/scoped-target.vue).

Scoping is the correct tool when the page itself stays in one language
and only a fragment changes; WCAG 3.1.2 (Language of Parts) is exactly
this case.

## `applyDir` — optional, boolean, default `true`

When `true` the select writes `dir="rtl"` or `dir="ltr"` alongside
`lang`. Set it to `false` to write `lang` only.

Turn it off when something else already owns direction — an RTL-aware
framework, a CMS that renders `dir` server-side, or a layout that
deliberately stays LTR while the text language changes. Note that
turning it off does not make RTL text render LTR; it just stops the
component from asserting an opinion.

See [rtl.md](./rtl.md) for what `dir` actually changes.

## `localeLabels` — optional, Record<string, string>

Per-code display-label overrides, consulted before the built-in table.

The default label chain is: `localeLabels` → the built-in
436-row table in [`../locales.ts`](../locales.ts) → an opportunistic
`Intl.DisplayNames` lookup → the raw code. The `Intl` step is wrapped
in `try` / `catch` and never throws on an unknown code.

The single most common use is endonyms — showing each language in its
own language, which is what a user scanning for their language
actually needs:

```vue
<LocaleSelect
    label="Language"
    :locales="['en', 'fr', 'de', 'ar']"
    :locale-labels="{ en: 'English', fr: 'Français', de: 'Deutsch', ar: 'العربية' }"
/>
```

Each `<li>` carries its own `lang`, so a screen reader pronounces an
endonym with the right voice without further work.

The exported [`localeName(code)`](../LocaleSelect.vue) helper resolves
a code through the built-in table alone, if you want the same labels
outside the component. It mirrors `themeName(slug)` on theme-select.

## `class` — optional, string

Appended to the root `<div>` after the base `locale-select` hook, so
the root reads `class="locale-select my-hook"`. Every other
class hook is component-owned and stable — see
[styling.md](./styling.md).

Arbitrary extra attributes (`id`, `data-*`, event listeners) fall
through to the same root `<div>` via Vue's default `inheritAttrs`
behaviour; they do not need a prop.

## Events

| Event          | Payload  | Fires                                              |
| -------------- | -------- | -------------------------------------------------- |
| `update:value` | `string` | On selection. Drives `v-model:value`.              |
| `change`       | `string` | After the select has applied `lang` / `dir` / storage. |

`change` is the side-effect hook: cookie writes, imperative i18n
library calls (`setLocale()`), analytics. It carries the
**consumer-form** code, not the BCP 47 tag — run it through
`bcp47LocaleTag()` if you need the hyphen form.

Both fire on user selection. Neither fires for the initial resolved
value on mount unless that resolution changed the value.

## See also

- [concepts.md](./concepts.md) — the mental model and lifecycle.
- [bcp47.md](./bcp47.md) — consumer form vs. BCP 47 tag.
- [rtl.md](./rtl.md) — direction handling.
- [i18n-integration.md](./i18n-integration.md) — vue-i18n, Paraglide.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
