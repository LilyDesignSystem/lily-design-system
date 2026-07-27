# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "The dropdown pushes the rest of the page down when it opens"

**Likely cause.** The package ships no CSS, including no positioning.
An unstyled `<ul>` is a block element in normal flow.

**Fix.** Give the root `position: relative` and the list
`position: absolute`. See [styling.md](./styling.md#positioning-is-yours).

## "The dropdown is always open" / "never opens"

**Likely cause.** Your CSS sets `display` on `.locale-chooser-list`,
overriding the UA stylesheet's `[hidden] { display: none }`. The
component toggles the `hidden` attribute; it does not set `display`.

**Fix.** Re-assert the rule after your own:

```css
.locale-chooser-list[hidden] { display: none; }
```

## "The dropdown opens on the wrong side after switching to Arabic"

**Likely cause.** Your positioning CSS uses `left` rather than
`inset-inline-start`. The control writes `dir="rtl"` to the document
root, which flips logical properties but not physical ones.

**Fix.** Use logical properties throughout: `inset-inline-start`,
`margin-inline`, `padding-inline`, `text-align: start`. See
[rtl.md](./rtl.md).

## "The globe renders as a blue emoji, not a monochrome glyph"

**Likely cause.** A stale copy of the glyph. The exported constant is
U+1F310 followed by **U+FE0E VARIATION SELECTOR-15**, which requests
text presentation; without VS15 the browser picks the colour-emoji
font.

**Fix.** If you hard-coded `"\u{1F310}"` in a `children` override,
import the constant instead:

```tsx
import { GLOBE_WITH_MERIDIANS } from "lily-design-system-react-locale-chooser";
```

If it is still coloured, your CSS font stack may be forcing an emoji
face. Try `font-variant-emoji: text` on `.locale-chooser-icon`, or put a
text-presentation face ahead of the emoji font.

## "The button shows an empty box (tofu) instead of a globe"

**Likely cause.** No font in the stack covers U+1F310.

**Fix.** Either add a font that does, or replace the glyph with an
inline SVG via the `children` render prop:

```tsx
<LocaleChooser label="Language" locales={locales}>
    {() => <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">…</svg>}
</LocaleChooser>
```

Remember `aria-hidden="true"` — see
[custom-rendering.md](./custom-rendering.md).

## "Screen reader announces the language twice"

**Likely cause.** Custom `children` content is not marked
`aria-hidden="true"`, so it is announced in addition to the button's
`aria-label`.

**Fix.** Hide every node your render prop returns. The button's name
comes from `label` and nothing else.

## "The button is announced as just 'button'"

**Likely cause.** `label` is missing, empty, or a whitespace string.
The glyph is `aria-hidden`, so `label` is the control's only accessible
name.

**Fix.** Always pass a non-empty, translated `label`.

## "`lang` is set but `dir` is not"

**Likely cause.** `applyDir={false}`, or a second control on the page
is writing `dir` and overwriting the first.

**Fix.** Let exactly one instance own direction. See the two-controls
recipe in [recipes.md](./recipes.md).

## "Hydration mismatch on the `<html>` element"

**Likely cause.** The server rendered `lang="en"` but the client
resolved a different locale from `localStorage` and rewrote the
attribute during the mount effect.

**Fix.** Resolve the locale on the server (cookie, `Accept-Language`)
and render it into `<html lang dir>` yourself, then pass the same value
as `value`. See [ssr.md](./ssr.md).

Note that the attribute write itself never causes a React hydration
error — the component writes it in an effect, after hydration. If you
see a genuine React mismatch warning, it is your own server markup
disagreeing with your client render, not the control.

## "The user's choice is not remembered"

**Likely causes, in order of likelihood.**

- `storageKey` is not set. Persistence is opt-in.
- The browser is blocking storage — Safari private mode, or a
  cookie-blocking extension. All storage access is wrapped in
  `try` / `catch`, so this fails silently by design.
- `value` is supplied and never updated from `onChange`. A controlled
  component whose owner ignores changes will snap back on every render.
- The key collides with another app on the same origin. Namespace it:
  `my-app:locale`.

## "`detectFromNavigator` does nothing"

**Likely cause.** It only applies on a first visit — when there is no
`value` and nothing in storage. Once a value is persisted, storage
wins by design.

**Fix.** Clear the key and reload:
`localStorage.removeItem("my-app:locale")`.

**Second cause.** Nothing in `navigator.languages` matched `locales`.
Matching is exact first, then language-only; a browser set to `pt-BR`
matches `pt` but nothing matches `zh` if you only offer `en` and `fr`.
Check it directly:

```ts
matchNavigatorLanguage(Array.from(navigator.languages), locales);
```

## "`onChange` fires on page load, before the user touched anything"

**Working as intended.** `onChange` fires after every applied change,
including the initial resolution, so listeners that swap translation
bundles stay in step on first paint.

**If you need user-initiated changes only,** compare against the
previous value in your handler, or track a `hasInteracted` flag.

## "`onChange` gives me `en_US` but `Intl` wants `en-US`"

**Working as intended.** The callback hands back the code in *your*
form so it round-trips against your own `locales` array.

**Fix.** Normalise at the boundary with the exported helper:

```ts
onChange={(code) => i18n.changeLanguage(bcp47LocaleTag(code))}
```

## "Typeahead jumps to the wrong option"

**Likely cause.** Typeahead matches the *rendered label*, not the code.
If you overrode `localeLabels` with endonyms, typing `g` for "German"
will not find "Deutsch".

**Fix.** This is correct behaviour — users search for what they see.
If you want code-based search, that is a filtering combobox, which is
outside this component's scope; see
[custom-rendering.md](./custom-rendering.md#why-it-is-glyph-only).

## "The active option scrolls out of view in a long list"

**Likely cause.** The list has no constrained height, so there is
nothing to scroll. The component calls
`scrollIntoView({ block: "nearest" })` as the cursor moves, which is a
no-op on an unscrollable element.

**Fix.** Give the list a `max-block-size` and `overflow-y: auto`.

## "Options in mixed scripts have punctuation on the wrong side"

**Likely cause.** The bidi algorithm is resolving neutral characters
against the surrounding paragraph direction.

**Fix.** Isolate each label:

```css
.locale-chooser-option { unicode-bidi: isolate; }
```

## "Tests fail with `matchMedia is not a function` or similar"

**Not this component.** `LocaleChooser` does not use `matchMedia`; that
is `ThemeChooser`'s system-preference detection. If a shared test setup
stubs one control's globals, make sure it is not clearing the other's.

For `LocaleChooser`, the globals that matter in jsdom are
`navigator.languages` (present, but usually just `["en-US"]`) and
`localStorage` (present). Stub `navigator.languages` with
`Object.defineProperty` when testing `detectFromNavigator`.

---

Lily™ and Lily Design System™ are trademarks.
