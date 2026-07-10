# Concepts

How `LocaleSelect` thinks about locale, where it sits in your
stack, and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocaleSelect` (this helper).        |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `LocaleSelect` (auto-detected from the locale; opt out with `:apply-dir="false"`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (`vue-i18n`, `@intlify`, Tolgee, Paraglide, raw `Intl`). |

The helper owns the first two and signals the third via a bindable
`value` (via `v-model:value`), a `change` event, and the `lang`
attribute (which most i18n libraries don't read directly — they
react to the bindable).

The split matters because it lets you swap your i18n library
without rewriting the select, and it lets the select stay
headless: zero CSS, zero string tables, zero dependencies beyond
Vue.

## What "headless" means here

The select:

- Renders semantic HTML (`<select>` + `<option>`) with the
  implicit `combobox` / `option` ARIA the browser provides for a
  native select.
- Carries a stable kebab-case class hook (`locale-select`,
  `locale-select-option`) on every element so your CSS can target
  it without prefixes or specificity tricks.
- Ships **no** colour, spacing, typography, font, icon, or
  animation decisions. You supply all of that.
- Ships **no** translated strings. The `label` prop and
  `localeLabels` prop are passed through verbatim.

## The lifecycle

Each instance manages a single bindable `value`:

```
       ┌───────────────────────────────────────────┐
       │   onMounted — resolves once                │
       │                                            │
   value (consumer) ─── if empty ───► storage ──► navigator ──► defaultValue ──► "en" ──► locales[0]
       │                                            │
       │  writes back via emit("update:value", …)   │
       └───────────────────────────────────────────┘
                       │
                       ▼
       ┌───────────────────────────────────────────┐
       │   watch(props.value) — every value change  │
       │                                            │
       │   target.lang = BCP-47(value)              │
       │   target.dir  = rtl|ltr                    │
       │   localStorage.setItem(...)                │
       │   emit("change", value)                    │
       └───────────────────────────────────────────┘
```

Both DOM mutation and storage are side effects, so they belong in
`watch` / `onMounted`, not in computed values.

## Why a native `<select>` by default

Three reasons:

1. **Scales to long lists**. A native `<select>` stays compact and
   pops the OS-native picker on mobile, so it handles 2 or 200
   locales without layout cost.
2. **Symmetry with `ThemeSelect`**. The sibling helper in this
   directory uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Escape hatch is one slot away**. The default scoped slot
   hands you the full state machine — locales, value, `setLocale`,
   `tagFor`, `isRtl`, `labelFor` — so a button group or custom
   `<option>` markup is a 10-line rewrite, not a fork.

For an always-visible list of a few locales, use the slot to render
a button group. See [examples/03-buttons.vue](../examples/03-buttons.vue).

## Why a separate `value` and `target.lang`

The bindable `value` is in **consumer form** — whatever you put
into `locales` (`en_US` or `en-US` or `en`). It round-trips
losslessly.

The `target.lang` attribute is in **BCP 47 form** — always hyphens
(`en-US`). This is what `<html>` and the HTML spec require.

Keeping them separate means:

- Your existing locale store (CLDR-style `en_US`) stays untouched.
- `<html lang>` is spec-compliant without consumer code touching
  the conversion.
- Two-way `v-model:value` Just Works.

## Where storage fits in

`storageKey` is optional and opt-in. When set:

- Selection writes synchronously to `localStorage`.
- On a fresh mount with no `value` prop, the stored value is read
  back.
- Storage errors (private mode, quota) are swallowed silently;
  the select degrades to the default.

If you have a server (Nuxt 3, Astro SSR, etc.), prefer a cookie
instead — it survives the round-trip and avoids a flash of default
locale on first paint. Pass the cookie value as the initial
`value` prop. See [docs/ssr.md](./ssr.md).

## Where navigator detection fits in

`detectFromNavigator` is opt-in. When set, the first mount
inspects `navigator.languages` and picks the first entry whose
language matches something in your `locales` array. The match
algorithm is simple (exact first, language-only second) — not
RFC 4647 best-fit. If you need stronger negotiation, run your own
resolver and pass the result as `value`.

## How to test it

Three layers, mirroring the lifecycle:

1. **Pure helpers** — `bcp47LocaleTag`, `isRtlLocale`,
   `localeName`, `matchNavigatorLanguage` are pure functions.
   Unit-test them in isolation.
2. **DOM contract** — after mount, assert
   `document.documentElement.lang` and `.dir`. Drive a `setValue`
   on the `<select>` and assert again.
3. **Bindable + change event** — drive `value` programmatically
   and assert the same DOM observations; assert that `change` was
   emitted.

See [../LocaleSelect.test.ts](../LocaleSelect.test.ts) for the
reference suite that covers every `spec/index.md` §7 acceptance item.

## Vue-specific notes

### `defineModel` vs explicit `update:value`

The select uses `defineProps` + `defineEmits` rather than
`defineModel` so it can suppress the bind-back during initial-value
resolution (when the resolved value matches the supplied value).
`defineModel` would write back unconditionally on every internal
change, which is fine for most components but breaks the
"controlled when supplied non-empty" contract documented in
`spec/index.md` §3.

### Scoped slot props in templates

Vue scoped slots use kebab-case attributes on the component side
(`:set-locale="setLocale"`) and camelCase on the consumer side
(`{ setLocale }`). The `SlotArgs` TypeScript type uses camelCase
for autocomplete; the template uses kebab-case. Both are correct.

### `v-model:value` vs `v-model`

The select exposes its bindable on `value`, not the default
`modelValue`. Always use `v-model:value="locale"`. This matches
the Svelte canonical's `bind:value` semantics and keeps the
API symmetric across frameworks.

---

Lily™ and Lily Design System™ are trademarks.
