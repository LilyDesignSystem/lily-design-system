# Props reference

Field-by-field reference for every public prop. The contract is owned
by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

`aria-label` on **both** the trigger `<button>` and the popup
`<ul role="listbox">`. Always supplied, always translatable.

Because the button renders only an `aria-hidden` glyph, this prop is
the control's *entire* accessible name — there is no visible text to
fall back on.

For a locale select this carries a wrinkle worth thinking about: the
label is written in one specific language, and this is the control a
user reaches for precisely when they cannot read the page. A
multilingual label, or pairing the glyph with the active locale's
endonym via `children`, are both reasonable answers. See
[accessibility.md § Tradeoff 1](./accessibility.md#tradeoff-1--the-accessible-name-rests-entirely-on-aria-label).

## `placeholder` — removed

This prop existed in 0.3.0 to name the pinned option of a native
`<select>`. There is no `<select>` and no pinned option any more, so
the prop is gone. Passing it is a no-op — it falls through `restProps`
onto the root `<div>` as a stray `placeholder` attribute.

If you were using it to give the closed control a short visible word,
render that word yourself with the `children` snippet, which replaces
the button's glyph.

## `locales` — required, string[]

The locale codes the select exposes as options, in the order they
should appear. Accepts either separator form: `"en"`, `"en_US"`, and
`"en-US"` all work, and the bindable `value` mirrors back whichever
form you supplied.

Only the DOM writes are normalised to the BCP 47 hyphen form. See
[bcp47.md](./bcp47.md).

The array is the complete set of what the app supports; the component
never crawls, fetches, or introspects a translation backend. For all
436 built-in codes:

```ts
import { defaultLocaleLabels } from "../LocaleChooser.svelte";
const ALL = Object.keys(defaultLocaleLabels);
```

Be deliberate before doing that — see the note on long lists in
[recipes.md](./recipes.md).

## `value` — optional, string (bindable)

The active locale code, in *your* form. Two-way bindable with
`bind:value={locale}` so the surrounding code can read and write the
selection.

When supplied as a non-empty string, the select treats it as the
authoritative initial value: `storageKey`, navigator detection, and
`defaultValue` are all skipped on first mount. This is what makes the
server-resolved SSR pattern work — see [ssr.md](./ssr.md).

## `defaultValue` — optional, string

Used during initial-value resolution when `value` is empty, nothing was
stored, and navigator detection did not match (or is off). If
`defaultValue` is itself empty, the resolver falls back to `"en"` (when
present in `locales`) and then to `locales[0]`.

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the select:

- reads the stored code during initial-value resolution, ranked above
  navigator detection and `defaultValue`;
- writes the code to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently swallowed —
the select continues to work in-memory.

Storage beats navigator detection on purpose: a user who explicitly
picked a language keeps it even when travelling with a device set to
something else.

For a preference that must survive on the *server* (so SSR can paint
the right `lang` before hydration), use a cookie instead — see
[ssr.md](./ssr.md).

## `detectFromNavigator` — optional, boolean — defaults to `false`

When `true` and neither `value` nor storage supplied a code, resolve
`navigator.languages` (falling back to `[navigator.language]`) against
`locales` on first mount:

1. Exact match, case-insensitively and treating `-` and `_` as
   equivalent.
2. Language-only match: `"fr-CA"` matches the first entry whose base
   language is `fr`.

The first navigator entry that hits either rule wins. If none match,
resolution falls through to `defaultValue`.

```
value > storage > detectFromNavigator > defaultValue > "en" > locales[0]
```

This mirrors `detectFromSystem` in `theme-chooser`. The underlying
`matchNavigatorLanguage(navLangs, locales)` helper is exported if you
want to call it yourself — on the server against `Accept-Language`, for
instance.

Off by default because guessing a language and getting it wrong is
worse than showing a known default: the user then has to navigate a
page in a language they did not choose to find the control that fixes
it.

## `name` — optional, string — defaults to `"locale"`

The `name` attribute of the hidden `<input type="hidden">` that carries
the value for form submission. The value submitted is the
consumer-form code, not the BCP 47 tag.

Unlike `theme-chooser`'s `name`, it has no second job — there is no
managed `<link>` here — so multiple selects on one page only need
distinct names if they submit to the same form.

## `target` — optional, HTMLElement | null

Element that receives `lang` and (unless `applyDir` is `false`) `dir`
on each apply. Defaults to `document.documentElement` (i.e. `<html>`).

Pass a specific element to scope a locale to one region of the page —
a multilingual content panel, say — leaving the document language
alone. See [`../examples/scoped-target.svelte`](../examples/scoped-target.svelte).

Note that a scoped target satisfies WCAG 3.1.2 (Language of Parts) for
that region, but the page as a whole still needs a correct `lang` for
3.1.1 (Language of Page). Do not use `target` to avoid setting the
document language.

## `applyDir` — optional, boolean — defaults to `true`

When `true`, every apply also writes `dir="rtl"` or `dir="ltr"` to the
target, derived from `isRtlLocale(code)`.

Set it to `false` when you manage direction yourself — for instance
when your framework or CMS already writes `dir`, or when you want
`dir="auto"`. The select then writes only `lang` and never touches
`dir`, not even to remove a stale one.

Do not disable it merely because you have no RTL locales in the list:
writing `dir="ltr"` explicitly is harmless and makes the intent
visible.

## `localeLabels` — optional, Record<string, string>

Per-code display label override. When a code is absent, labels resolve
via:

1. `defaultLocaleLabels[code]` from the built-in 436-row table.
2. `Intl.DisplayNames` for the environment locale, if available and
   non-empty. Used opportunistically; never throws.
3. The raw code.

Two things depend on the labels beyond appearance:

- **Typeahead** matches label prefixes, so labels decide which
  keystrokes jump where.
- **Per-option `lang`** is set from the code regardless of the label,
  so an English label under `lang="fr"` is a small inaccuracy. Prefer
  endonyms — "Français", "العربية", "Cymraeg" — which are both
  accurate under `lang` and readable by the person who needs them. See
  [accessibility.md](./accessibility.md#per-option-lang-is-important).

## `onChange` — optional, (locale: string) => void

Called synchronously after every successful apply, including the one
that resolves the initial value on mount. The argument is the
**consumer-form** code (`"en_US"`), not the BCP 47 tag (`"en-US"`).

The usual place to drive an i18n library, write a cookie, or send
analytics. See [i18n-integration.md](./i18n-integration.md).

## `children` — optional, Snippet<[ChildArgs]>

**Replaces the glyph inside the trigger button.** It does *not* render
the options — the listbox and its `<li role="option">` children are
component-owned and always emitted.

The snippet receives:

```ts
type ChildArgs = {
  /** Currently selected locale code (consumer form, not BCP 47-normalised). */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a locale code to its display label. */
  labelFor: (locale: string) => string;
};
```

When supplied, no `.locale-chooser-icon` span is emitted. The
pre-listbox `tagFor` and `isRtl` members are gone; use the exported
`bcp47LocaleTag` and `isRtlLocale` helpers instead.

See [custom-rendering.md](./custom-rendering.md) for patterns.

## `class` — optional, string

Extra CSS class hook on the root `<div>`. Always emitted after
`"locale-chooser"`, so consumer styles can use either selector.

## `...restProps` — any HTML attributes

Spread onto the root `<div>`. Use to attach `data-*`, `id`, event
handlers, and ARIA overrides.

Note that attributes intended for the *button* — `aria-labelledby`,
`title`, `disabled` — land on the root instead. Pass them
deliberately, or wrap the select.

---

Lily™ and Lily Design System™ are trademarks.
