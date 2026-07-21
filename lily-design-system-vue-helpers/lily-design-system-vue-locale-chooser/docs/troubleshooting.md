# Troubleshooting

Symptom-first. Each entry names the usual cause and the fix.

## "The listbox pushes the rest of the page down when it opens"

The component ships no CSS, so the `<ul>` is in normal flow. Position
it yourself:

```css
.locale-chooser { position: relative; }
.locale-chooser-list { position: absolute; inset-block-start: 100%; z-index: 50; }
```

See [styling.md](./styling.md#positioning-the-listbox).

## "The listbox is visible even when closed"

Something in your CSS is overriding the `hidden` attribute — usually a
blanket `ul { display: block }` or a `display` on
`.locale-chooser-list`. `hidden` is only a UA-stylesheet
`display: none`, so any author rule beats it.

```css
.locale-chooser-list[hidden] { display: none; }
```

## "Arrowing through the list does nothing visible"

Focus stays on the `<ul>` — that is the APG listbox pattern, which
tracks position with `aria-activedescendant` rather than moving DOM
focus. So `:focus` never matches an option. Style the attribute the
component actually sets:

```css
.locale-chooser-option[data-active] { background: #e5e7eb; }
```

## "The globe renders blue / as a colour emoji"

The glyph is U+1F310 followed by U+FE0E VARIATION SELECTOR-15, which
requests text presentation. Some platforms ignore VS15 when the first
font in the stack is a colour-emoji font. Force a text-first stack:

```css
.locale-chooser-icon {
    font-family: system-ui, "Segoe UI Symbol", sans-serif;
}
```

If you need a guaranteed monochrome mark, replace the glyph with an
inline SVG via the default slot — see
[custom-rendering.md](./custom-rendering.md#an-svg-icon-instead-of-the-glyph).

## "The button shows an empty box (tofu)"

No font in the stack has U+1F310. Same fix as above: add a font that
does, or swap in an SVG. Tofu is most common on stripped-down Linux
containers and some kiosk builds.

## "`Intl.DateTimeFormat` throws RangeError on my locale code"

You passed the consumer form. `Intl.*` wants BCP 47 hyphens:

```ts
new Intl.DateTimeFormat(bcp47LocaleTag(locale)); // "en_US" -> "en-US"
```

The component keeps your codes in whatever form you supplied and only
normalises what it writes to the DOM. See [bcp47.md](./bcp47.md).

## "`dir` never changes / the layout stays LTR"

Three candidates, in order of likelihood:

1. `apply-dir` is `false`. Then the component writes `lang` only.
2. Your CSS uses physical properties. `dir="rtl"` flips inline
   direction, but `margin-left` stays left. Use logical properties —
   `margin-inline-start`, `inset-inline-start`, `padding-inline`.
3. The locale is not detected as RTL. `isRtlLocale` checks script
   subtags and a base-language list. `ur` and `ar` work; a private-use
   tag will not. Pass the script subtag explicitly (`uz_Arab_AF`).

See [rtl.md](./rtl.md).

## "The wrong locale wins on first load"

Print the resolution order and check which step fires:

```
value > storage > detect-from-navigator > defaultValue > "en" > locales[0]
```

The most common surprise is a stale `localStorage` entry from an
earlier session outranking `default-value`. It should not outrank an
explicit `value` — if it appears to, confirm you are passing a
**non-empty** string. `:value="undefined"` and `:value="''"` both mean
"not supplied".

## "Locale does not persist across reloads"

- `storage-key` is not set. Persistence is opt-in.
- The write threw and was swallowed — Safari private mode, or a
  quota/permissions error. Check `localStorage.setItem` by hand in the
  console.
- You are in SSR and reading storage too early. Storage is client-only;
  use a cookie if the server needs to know. See [ssr.md](./ssr.md).

## "SSR hydration mismatch on `<html lang>`"

The server rendered one `lang` and the client resolved another —
usually because the server had no cookie and the client had
`localStorage` or `detect-from-navigator`.

Resolve on the server and pass the result as `value` so the client
cannot disagree. The Nuxt recipe is in
[recipes.md](./recipes.md#read-a-locale-cookie-before-render-nuxt-3).

## "`v-model:value` doesn't update"

The bindable is `value`, not the default `modelValue`. Write
`v-model:value="locale"`. A bare `v-model="locale"` binds
`modelValue`, which this component does not declare, so nothing
happens.

## "TypeScript complains about the v-model expression"

`v-model:value` needs a writable ref of `string`. A `computed` without
a setter, or a `ref<string | null>`, will not type-check. Narrow it:

```ts
const locale = ref<string>("en");
```

## "TypeScript says `placeholder` does not exist on Props"

Correct — it was removed with the native `<select>` in the
icon-button rewrite. There is no leading option to label any more.
Delete the prop; the `.locale-chooser-placeholder` hook is gone too.

## "My slot content isn't replacing the options"

It is not supposed to. The default slot replaces the **button glyph**
only; the option list is component-owned. Style
`.locale-chooser-option`, or render your own control alongside and bind
both to one ref. See
[custom-rendering.md](./custom-rendering.md#if-you-need-a-different-control-entirely).

## "Slot content is announced instead of my label"

It is not — `aria-label` on the button wins over descendant text, so
the screen reader reads `label` and ignores your slot. That is the
bug: sighted and non-sighted users now get different information. Mark
slot content `aria-hidden="true"`, and make `label` say what the slot
shows.

## "Typeahead jumps to the wrong option"

Typeahead matches the **display label**, not the code. With
`locale-labels` supplying endonyms, typing `g` will not find
`Deutsch`. That is intended — users type what they see. The buffer
resets after 500 ms of no keystrokes.

## "Two choosers fight over `<html lang>`"

Both default to `target = document.documentElement`, so the last one
to apply wins. If they are meant to be independent, give at least one
a scoped `target`. If they are meant to agree, bind both to the same
ref instead of running two lifecycles.

## "The word 'default' appears in my list"

The component never emits it. Something in `locales` literally
contains `"default"`, or a `locale-labels` entry does. Check the array
you are passing.

## "Options are clipped / the list can't scroll to the bottom"

`scrollIntoView({ block: "nearest" })` only works if the list is the
scroll container. Give it one:

```css
.locale-chooser-list { max-block-size: 20rem; overflow-y: auto; }
```

## "The list is cut off by an ancestor"

An ancestor has `overflow: hidden` (or a transform/filter creating a
containing block). The component does not portal. Move the chooser
outside that ancestor, or use CSS anchor positioning / a popover
library.

## "Mixed-script labels look clipped"

A fixed `block-size` on options clips Devanagari, Thai, and Arabic
ascenders and descenders. Use padding and `line-height` instead, and
never `letter-spacing` — it breaks cursive joining. See
[styling.md](./styling.md#sizing-for-mixed-scripts).

## "Nuxt's useHead clobbers my lang / dir"

Both write `<html>`. `useHead` re-applies on navigation and can undo
the component's write. Make `useHead` the single writer, driven by the
same ref the chooser binds to — the recipe in
[recipes.md](./recipes.md#read-a-locale-cookie-before-render-nuxt-3)
does this.

## "Inside `<Suspense>` the chooser shows the default for a frame"

`onMounted` runs after the suspense boundary resolves, so the
pre-resolution value paints first. Pass a server-resolved `value` so
the first paint is already correct.

## See also

- [props-reference.md](./props-reference.md) — every prop in detail.
- [styling.md](./styling.md) — hooks and baseline CSS.
- [accessibility.md](./accessibility.md) — the status-region pattern.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
