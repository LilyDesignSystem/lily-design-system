# Attributes reference

Field-by-field reference for every public attribute. The contract is
owned by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

`aria-label` on **both** the rendered `<button>` and the rendered
`<ul role="listbox">`. Always supplied, always translatable.

The control is icon-only, so this is the *entire* accessible name —
there is no visible text to fall back on. A vague `label` leaves the
control unusable to screen-reader users, and the absence of a visible
label means the control fails WCAG 2.5.3 Label in Name unless you add
one yourself. See
[accessibility.md](./accessibility.md).

One subtlety specific to this control: `label` should be written in
the language the user is *currently* reading, not in the language they
might switch to. "Choose language" localised into the active locale is
right; "Sprache wählen" hardcoded is not. Because the element applies
`lang` to the document root, your i18n layer usually already has the
active locale in hand when it renders this attribute — feed it from
there.

## `locales` — required, string (CSV)

Comma-separated list of locale codes the control exposes as options.
Each code becomes one `<li role="option">`, carries its own `lang`
attribute, and is written to the document root when selected.

Codes may be given in either BCP 47 hyphen form (`en-US`) or the
underscore form many backends use (`en_US`). The element keeps your
form as the canonical `value` and in the `localechange` detail, and
converts to hyphen form only when writing the `lang` attribute — see
[bcp47.md](./bcp47.md). Pick one form and stay consistent; mixing
`en_US` and `en-GB` in the same list works but makes your own
comparisons harder.

The matching JS property `el.locales` accepts a native `string[]`:

```ts
(select as LocaleSelect).locales = ["en", "fr", "ar"];
// equivalent to: select.setAttribute("locales", "en,fr,ar")
```

The CSV form makes the list safe to declare in HTML without escaping.
Order is preserved and is the order options appear in — put the most
commonly chosen locales first rather than alphabetising blindly.

## `value` — optional, string

The active locale code, in whatever form you supplied it in `locales`.
Read and write via attribute or property:

```ts
select.setAttribute("value", "fr");   // → applies "fr"
select.value = "ar";                  // → applies "ar", flips dir to rtl
select.getAttribute("value");         // → "ar"
```

Writing `value` is the supported way to change the locale
programmatically; it runs the full apply lifecycle (`lang`, `dir`,
storage, `localechange`). A `value` change deliberately does **not**
rebuild the rendered DOM — rebuilding while the listbox is open would
destroy focus and the active descendant — so it is safe to set at any
time, including while the list is open.

If `value` is present on first connect it wins over storage, navigator
detection, and `default-value`. That precedence is what makes
server-rendered cookie values authoritative; see [ssr.md](./ssr.md).

## `default-value` — optional, string

The locale to fall back to when `value` is absent, storage is empty,
and navigator detection either is off or found no match. If
`default-value` is itself absent, the element falls back to `"en"`
when `"en"` is in `locales`, and otherwise to `locales[0]`.

Set this whenever your default is not English. A Norwegian service
listing `["nb", "nn", "en"]` should say `default-value="nb"` — without
it the element picks `en` purely because `en` is in the list.

## `storage-key` — optional, string

If set, the selected code is written to
`localStorage[storageKey]` on every apply, and read back on the next
first connect. If absent, nothing is persisted and the control
resolves fresh on every page load.

Namespace the key (`"myapp:locale"`) so it does not collide with other
Lily helpers or other apps on the same origin. All storage access is
wrapped in `try` / `catch`: Safari private mode and quota-exceeded
errors degrade to "no persistence", never to a thrown error.

Storage is read **after** `value` and **before** navigator detection,
which is the precedence users expect: an explicit past choice should
outrank a browser guess, but a server-supplied value should outrank
both.

## `detect-from-navigator` — optional, boolean attribute

Present (and not `="false"`) → on first visit, with no `value` and no
stored code, resolve `navigator.languages` against `locales` and use
the best match.

```html
<locale-select label="Language" locales="en,fr,de" detect-from-navigator></locale-select>
```

Matching is two-pass, implemented by the exported
`matchNavigatorLanguage(navLangs, locales)`: an exact match first
(treating `-` and `_` as equivalent, case-insensitively), then a
language-only match. So a browser preferring `fr-CA` picks `fr_CA` if
you offer it, and falls back to `fr` if you only offer `fr`. If
nothing matches, the helper returns `""` and resolution falls through
to `default-value`.

Detection is **opt-in** on purpose. Silently switching language based
on a browser setting surprises users who deliberately browse in a
second language, and it makes cached HTML ambiguous. Turn it on when
you have no server-side locale negotiation; leave it off when you do.

The helper is exported so you can reuse the same matching rule
server-side against an `Accept-Language` header:

```ts
import { matchNavigatorLanguage } from "lily-design-system-html-locale-select";
const locale = matchNavigatorLanguage(parseAcceptLanguage(header), SUPPORTED);
```

## `apply-dir` — optional, boolean attribute — defaults to *on*

Controls whether the element writes `dir` in addition to `lang`.
Inverted relative to the other boolean attributes: **absent means
true**. Only the explicit string `"false"` turns it off.

```html
<!-- writes lang and dir (the default) -->
<locale-select label="Language" locales="en,ar"></locale-select>

<!-- writes lang only; you own dir -->
<locale-select label="Language" locales="en,ar" apply-dir="false"></locale-select>
```

The direction is derived from the code by the exported `isRtlLocale`,
which checks explicit script subtags (`uz_Arab_AF` → RTL) before
falling back to a base-language table. Set `apply-dir="false"` when a
framework router, a CMS, or a server template already owns `dir` and
two writers would fight. See [rtl.md](./rtl.md).

## `name` — optional, string — defaults to `"locale"`

`name` on the rendered hidden `<input>`, which exists so the control
participates in normal form submission:

```html
<form method="post">
  <locale-select label="Language" locales="en,fr" name="ui_locale"></locale-select>
  <button type="submit">Save</button>
</form>
<!-- posts ui_locale=fr -->
```

Change it to match whatever your backend expects. Unlike
theme-select's `name`, this value is *not* used to discriminate any
shared document-level resource — locale-select manages no `<link>` —
so it is purely a form-field name.

## `locale-labels` — optional, string (JSON)

A JSON-encoded object overriding the display label for specific codes.

```html
<locale-select
  label="Language"
  locales="en,fr,pt_BR"
  locale-labels='{"pt_BR":"Português (Brasil)","en":"English (UK)"}'
></locale-select>
```

The matching JS property accepts a native object, which is easier than
escaping JSON in an attribute:

```ts
(select as LocaleSelect).localeLabels = { pt_BR: "Português (Brasil)" };
```

Label resolution is a four-step fall-through, in order: `localeLabels`
→ the built-in `defaultLocaleLabels` table (436 rows, from
`locales.tsv`) → `Intl.DisplayNames` → the raw code. Because the
built-in table is English-only, `localeLabels` is how you render
endonyms — each language named in itself — which is the usual
recommendation for a language switcher, since a user who cannot read
the current UI language still needs to find their own.

Malformed JSON is swallowed and treated as `{}` rather than throwing.

## `class` — optional, string

Extra CSS class appended to the rendered `<div class="locale-select">`
root. It does **not** land on the `<locale-select>` host element — see
[styling.md](./styling.md#targeting-the-host-vs-the-rendered-root) for
why that distinction matters and when to target which.

## `el.target` — JS-only, `HTMLElement | null`

Which element receives `lang` (and `dir`). Defaults to
`document.documentElement`. There is no attribute form because DOM
references are not serialisable into strings.

```ts
(select as LocaleSelect).target = document.querySelector("#preview")!;
```

Scoping the target to a subtree is how you preview a locale — including
its direction — inside one region while the rest of the page stays put.
Note that `lang` on a subtree is legitimate and useful (WCAG 3.1.2
Language of Parts), but the *document* language (WCAG 3.1.1) is the
root's, so a scoped select should not be your only locale control.

## Attribute / property mirroring

Every attribute has a camelCase property mirror. Two conversion rules
apply, matching the rest of the catalog:

| Attribute form | Property form | Conversion |
| -------------- | ------------- | ---------- |
| `locales="en,fr"` | `el.locales = ["en","fr"]` | CSV ⇄ `string[]` |
| `locale-labels='{"en":"English"}'` | `el.localeLabels = {en:"English"}` | JSON ⇄ object |
| `detect-from-navigator` | `el.detectFromNavigator = true` | presence ⇄ boolean |
| `apply-dir="false"` | `el.applyDir = false` | **inverted**: absent = true |

Setting a property writes the attribute, and the attribute change
drives the re-render — one code path, no drift. Reading a property
reads back from the attribute, so the DOM stays the single source of
truth.

Two boolean conventions coexist deliberately.
`detect-from-navigator` is a conventional boolean attribute
(absent = false); `apply-dir` defaults to *on*, so it is the one
attribute whose absence means true. That asymmetry is deliberate:
writing `dir` is the safe default for a locale control, and opting
out should be explicit.

## Non-attribute properties

`el.target` is the only configuration that exists solely as a
property. Everything else round-trips through an attribute.

## Read-only state and methods

`el.open`, `el.listId`, `el.optionId(i)`, `el.openList(startIndex?)`,
`el.closeList(refocus?)`, `el.labelFor(code)`, and `el.tagFor(code)`
are the imperative surface. `el.renderButtonContent()` is the one
overridable member — see
[custom-rendering.md](./custom-rendering.md).

## Fall-through attributes

Any attribute not in the observed list is left on the
`<locale-select>` host untouched. `id`, `data-*`, `hidden`, and event
handlers all behave normally; the element neither copies them onto the
rendered root nor strips them.
