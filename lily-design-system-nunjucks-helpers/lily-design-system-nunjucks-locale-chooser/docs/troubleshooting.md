# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "Clicking the button does nothing"

**Likely cause.** `locale-chooser.client.js` has not run. The control is
an icon button plus a listbox, and every interactive behaviour — open,
close, focus movement, arrow keys, typeahead, selection — lives in that
module. The server-rendered markup is inert. This is a genuine no-JS
regression from the native `<select>` this macro used to render; there
is no fallback to fall back to.

**Fixes.**

- Confirm a `<script type="module">` on the page imports the client and
  calls `autoInit()` (or `initLocaleChooser(root)`).
- Check the Console for a module-resolution error and the Network panel
  for a 404 on the client.js path.
- Check the CSP `script-src` directive allows the module's origin.
- If JavaScript is genuinely unavailable in your deployment target, this
  helper is the wrong tool — render a server-side list of
  locale-prefixed links instead, which is the better pattern for
  language choice anyway. The only no-JS affordance here is the
  pre-filled hidden input, which lets an enclosing form submit carry a
  locale.

## "Cannot find module './locales.js'"

**Likely cause.** `locale-chooser.client.js` imports `./locales.js` for
the built-in label table and the RTL sets, but the source in this
package is `locales.ts`. Vitest and Vite resolve that at test and build
time; a browser loading the raw module does not.

**Fixes.**

- Run the client through your bundler (Vite, esbuild, Rollup, webpack)
  with the package source on the resolution path — the normal case.
- Or compile `locales.ts` to `locales.js` and serve it alongside the
  client module.
- Or hand-write a `locales.js` exporting `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, and `RTL_SCRIPT_SUBTAGS`. Only the last two are
  needed if you supply all your own `localeLabels`.

## "The listbox opens but the arrow keys do nothing"

**Likely cause.** Focus never reached the `<ul>`. The client calls
`list.focus()` on open, which requires the `tabindex="-1"` the macro
renders, and it attaches the keydown handler to the list rather than to
the document. Hand-written or post-processed markup that drops
`tabindex="-1"` breaks the entire keyboard contract.

**Fix.** Keep `tabindex="-1"` on the `<ul role="listbox">`, and check
that no consumer script or CSS is moving focus away on open.

## "Typeahead does not find the locale I type"

**Likely cause.** Typeahead matches the **rendered option label**, not
the code. Without a `localeLabels` entry, an option renders its raw code
(`fr`), so typing "français" finds nothing.

**Fixes.**

- Supply `localeLabels`, which is what you want for display anyway.
- Remember the buffer resets 500 ms after the last keystroke, so a slow
  typist searches for a single character repeatedly rather than a
  prefix.
- Match is a prefix match on the label as rendered, so a label like
  `"(FR) Français"` is found by `(`, not by `f`.

## "The wrong locale is applied on load"

**Likely cause.** Resolution order. The client resolves:

```
value > storage > navigator (when enabled) > defaultValue > "en" > first
```

The usual surprise is a `localStorage` entry from an earlier visit
outranking your `defaultValue` — which is correct behaviour, since
`defaultValue` is the "no signals at all" fallback.

**Fixes.**

- Pass the locale you actually want as `value`; it beats storage.
- Clear the key while developing:
  `localStorage.removeItem("my-app:locale")`.
- If `detectFromNavigator` is on, check `navigator.languages` in the
  Console — it matches language-only, so `fr-CH` lands on your `fr`.

## "The server renders one locale and the client applies another"

**Expected**, if you set `storageKey` or `detectFromNavigator` without
passing `value`. Neither `localStorage` nor `navigator` exists at
Nunjucks render time, so the macro resolves its `aria-selected` from the
narrower `value or defaultValue or ("en" if present else locales[0])`,
and the client corrects it on init.

The user never sees an inconsistent *control* — the listbox is closed
and the button inert until the client runs — but they may see a
flash of the wrong `lang`/`dir` layout.

**Fix.** Resolve the locale server-side and pass it as `value`. A
cookie written from `onChange` is the standard approach; see
[recipes.md](./recipes.md) and [ssr.md](./ssr.md).

## "The page flashes LTR before flipping to RTL"

**Likely cause.** The same gap. `dir` is written by the client on
init, so the browser paints the LTR layout first. On an RTL locale this
is much more visible than a colour change would be — the whole layout
moves.

**Fix.** Render `dir` server-side from the same value you pass as
`value`. The `isRtlLocale` helper is importable in Node, so your
Nunjucks host can compute it at render time:

```js
import { isRtlLocale } from "./locale-chooser.client.js";
// <html lang="{{ locale }}" dir="{{ dir }}">
const dir = isRtlLocale(locale) ? "rtl" : "ltr";
```

See [rtl.md](./rtl.md).

## "`Intl.DateTimeFormat` throws RangeError"

**Likely cause.** You passed an underscored code. `"en_US"` is
accepted by this helper as a convenience, but it is not a valid BCP 47
tag and `Intl.*` rejects it.

**Fix.** Normalise with the exported helper first:
`new Intl.DateTimeFormat(bcp47LocaleTag(code))`. The `lang` attribute
the client writes is already hyphenated; only `onChange` and the hidden
input report your original form. See [bcp47.md](./bcp47.md).

## "Two controls on the page interfere with each other"

**Likely cause.** They share a `name`, so they share the default id
prefix `locale-chooser-{name}` — duplicate listbox and option ids, and
`aria-controls` / `aria-activedescendant` resolving to whichever element
the browser finds first.

**Fix.** Give each instance a distinct `name`, or pass distinct `id`s
when they must share one. Nunjucks macros cannot generate per-instance
ids automatically — see
[macro-opts-reference.md](./macro-opts-reference.md).

Note also that two controls do not update each other's `aria-selected`;
each client instance snapshots its own options at init. See
[recipes.md](./recipes.md).

## "Options in some languages render at the wrong size"

**Likely cause.** Options carry `lang`, and `lang` participates in font
selection. A stack tuned for Latin text falls back to a system font for
Arabic, Devanagari, or CJK, often at a different optical size and
baseline.

**Fix.** Set a font stack with coverage for your locale list on
`.locale-chooser-option`, and avoid a fixed `line-height` that clips
tall scripts. Do not "fix" it by removing `lang` — that is the WCAG
3.1.2 conformance.

## "The glyph is a tofu box, or renders blue"

**Likely cause.** Font coverage. The macro emits U+1F310 GLOBE WITH
MERIDIANS followed by U+FE0E VARIATION SELECTOR-15; VS15 requests the
monochrome text presentation, but it is a request and a platform with
no text presentation for the codepoint will still show the colour emoji.
A platform with neither shows tofu.

**Fix.** Override the glyph with an inline SVG via the `{% call %}`
block, keeping `aria-hidden="true"` on it. Because the glyph is
decorative, a missing glyph is a visual failure rather than an
accessibility one — the accessible name survives — but it does cost the
"this is the language switcher" affordance. See
[custom-rendering.md](./custom-rendering.md).

## "`localStorage` writes fail in Safari private mode"

**Not a bug.** Every storage access is wrapped in try/catch, so a
throwing `localStorage` degrades to "no persistence" rather than
breaking the control. The selection still applies for the session.

**Fix**, if persistence matters in those contexts: use a cookie
instead, written from `onChange`, and pass it back as `value`.

## "Nothing happens when I change a `data-lily-*` attribute at runtime"

**Not a bug.** The client snapshots its configuration and its option
list at init. Nunjucks renders once; there is no reactivity to
re-read attributes, and adding or removing `<li>`s afterwards is
invisible to the runtime.

**Fix.** Call `controller.destroy()`, update the DOM, then
`initLocaleChooser(root)` again.

## See also

- [macro-opts-reference.md](./macro-opts-reference.md) — every opt.
- [ssr.md](./ssr.md) — the render-time / runtime split.
- [bcp47.md](./bcp47.md) — tag normalisation.
- [rtl.md](./rtl.md) — direction handling.
- [accessibility.md](./accessibility.md) — the tradeoffs, stated plainly.
