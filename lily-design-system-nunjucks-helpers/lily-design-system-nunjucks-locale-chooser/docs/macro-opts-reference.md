# Macro opts reference

Field-by-field reference for every key the `localeChooser(opts)` macro
understands. The contract is owned by
[`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and the common usage.

## `label` — required, string

`aria-label` on **both** the button and the listbox. Always supplied,
always translatable.

The button is icon-only — its globe glyph is `aria-hidden="true"` — so
`label` is the only accessible name it has, and the collapsed button
never announces the active locale. See
[accessibility.md](./accessibility.md) for that tradeoff and the
`.locale-chooser-status` region that compensates for it.

`label` carries a wrinkle the theme chooser does not have. It should
normally be written in the *current* document language, because that is
what the current reader reads — but a user who cannot read the current
language is exactly the user most likely to be hunting for this
control. Two mitigations, neither exclusive: keep the globe glyph,
which is a near-universal convention for language choice, and consider
pairing the control with a visible text label rather than relying on
`aria-label` alone.

There is no `placeholder` opt. It belonged to the native `<select>`
this macro used to render, and went away with it — along with the
`.locale-chooser-placeholder` CSS hook.

## `locales` — required, array of strings

The locale codes the control exposes as options, in listbox order.
That order is also the order `ArrowDown`, `Home` / `End`, and typeahead
traverse, so put the locales your users actually pick near the top
rather than sorting alphabetically out of habit.

Codes may be written with either separator: `"en_US"` and `"en-US"` are
both accepted. The macro emits the code verbatim on `data-value` and
the hyphenated BCP 47 form on the option's `lang`; the client writes the
hyphenated form to the target's `lang` and reports the **consumer's**
form back through `onChange` and the hidden input. That asymmetry is
deliberate — you get back what you passed in, so codes round-trip
through your own config unchanged. See [bcp47.md](./bcp47.md).

The list is also what `detectFromNavigator` matches against, and what
constrains it: a navigator preference with no match in `locales`
resolves to nothing rather than to an unlisted locale.

## `value` — optional, string

The currently-active locale code. The macro serialises it as
`data-lily-locale-chooser-value` on the root `<div>`, and omits the
attribute entirely when `value` is empty. That attribute remains the
only channel by which `value` reaches the client.

`value` also feeds the macro's **server-side** selected resolution
(`value or defaultValue or ("en" if present else locales[0])`), so the
`<li>` for this code carries `aria-selected="true"` and the hidden input
is pre-filled with it.

`value` is the first input in the client's runtime resolution order, so
it beats `localStorage`. This is the point of the opt: in a
Nunjucks app it carries a locale you already resolved server-side —
from a cookie, a URL prefix, an `Accept-Language` header, a signed-in
user's profile — and an explicit server answer should not lose to a
stale local one. See [ssr.md](./ssr.md).

## `defaultValue` — optional, string

The fallback locale, consulted only after `value`, storage, and
navigator detection have all come up empty. Use it for "what a brand
new visitor with no signals should get", and use `value` for "what this
particular request resolved to".

## `storageKey` — optional, string

When non-empty, the client persists every applied locale to
`localStorage` under this key and reads it back on a later init.
Namespace it per application (`"my-app:locale"`), because
`localStorage` is shared across everything on the origin.

Storage is consulted **after** `value` and **before** navigator
detection. A returning visitor with a saved choice and no
server-resolved locale therefore lands on their saved choice; a
visitor whose request *did* resolve a locale server-side gets that.

All storage access is wrapped in try/catch, so Safari private mode,
a disabled-storage policy, or a full quota degrades to "no
persistence" rather than throwing.

## `detectFromNavigator` — optional, boolean, default `false`

When true, and when neither `value` nor storage supplied a locale, the
client matches `navigator.languages` against `locales` — exact match
first (treating `-` and `_` as equivalent), then language-only match, so
a browser asking for `fr-CH` lands on your `fr` if you do not list
`fr_CH`.

Off by default, and deliberately so: `navigator.languages` reflects the
browser's configuration, which is often the OS default rather than a
choice the user made, and silently switching a page's language on that
basis surprises people. Turn it on when your audience is genuinely
multilingual and your locale list is broad.

Detection is client-only — there is no `navigator` at Nunjucks render
time — so it never affects the server-rendered `aria-selected`. With
detection on and no `value`, expect the server markup to name one
locale and the client to apply another. See [ssr.md](./ssr.md).

The `Accept-Language` header is the server-side equivalent, and it is
the better tool when you have it: resolve it in your request handler and
pass the result as `value`.

## `applyDir` — optional, boolean, default `true`

When true, applying a locale also writes `dir="rtl"` or `dir="ltr"` to
the target. Set it false when something else in your stack owns `dir` —
a framework, a CMS-rendered page shell, or your own script — so the two
do not fight over the attribute.

Turning it off does not disable RTL detection, only the write.
`isRtlLocale(code)` remains exported, so you can apply the answer
wherever you actually want it. See [rtl.md](./rtl.md).

## `name` — optional, string, default `"locale"`

The hidden input's `name`, which is what an enclosing form submits. It
is also the default id prefix (`locale-chooser-{name}`), which is why two
instances that share a `name` need an explicit `id`.

## `localeLabels` — optional, object

Pretty display text per code: `{ fr: "Français", ar: "العربية" }`.
Without an entry, an option renders its raw code.

Endonyms — each language's name in itself — are the usual right answer
here, since the reader of the "Français" option is by definition someone
looking for French. `localeName(code)` from the client module resolves
*English* names from the built-in table, which is the wrong register for
option text but the right one for a status region in an
English-language page.

These labels are also what the typeahead matches on, so supplying them
changes what users can type to jump: with `{fr: "Français"}`, `f` finds
it; without, they must type the code.

## `id` — optional, string, default `"locale-chooser-{name}"`

Id prefix for the listbox (`{id}-list`) and each option
(`{id}-option-{i}`). Ids are deterministic — no `Math.random`, no
`Date.now` — so server and client markup always agree.

A Nunjucks macro has no module-level mutable state and so cannot mint
per-instance ids the way the canonical Svelte helper does. Two
instances on one page that share a `name` will emit duplicate ids, and
`aria-controls` / `aria-activedescendant` will resolve to whichever
element the browser finds first. Give them distinct `name`s, or pass
distinct `id`s.

## `classes` — optional, string

Extra classes appended to the root `<div>` after the `locale-chooser`
hook. The hook itself is never removed or renamed. See
[styling.md](./styling.md).

## `attributes` — optional, object

Arbitrary HTML attributes spread onto the root `<div>` — `id`,
`data-*`, `hidden`, and so on. Keys are emitted verbatim, so this is
also the escape hatch for anything the opts table does not cover.

Do not use it to set ARIA that the macro owns (`aria-label` on the
button, `aria-expanded`, `aria-controls`); those live on inner
elements, not the root, and the client rewrites them.

## The `{% call %}` block

Not an opt, but part of the public surface. A `{% call %}` block body
replaces the default glyph **inside the button** — the Nunjucks
equivalent of `children`. It does not render options; the listbox
always comes from `locales`. See
[custom-rendering.md](./custom-rendering.md).

## See also

- [`../spec/index.md`](../spec/index.md) — the canonical contract.
- [concepts.md](./concepts.md) — the macro / client.js split.
- [bcp47.md](./bcp47.md) — tag composition and normalisation.
- [ssr.md](./ssr.md) — cookie-resolved `value` before render.
- [troubleshooting.md](./troubleshooting.md) — when an opt appears not
  to work.
