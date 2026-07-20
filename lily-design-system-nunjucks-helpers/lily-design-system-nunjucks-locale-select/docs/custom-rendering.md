# Custom rendering

The macro owns the root `<div>`, the hidden input, the button's ARIA
attributes, and the listbox — including the per-option `lang` that
WCAG 3.1.2 depends on. The one thing it hands over is the **button's
glyph**. Three levels of customisation, in increasing order of how
much you take on:

1. **Caller block** — replace the glyph with your own icon. The
   supported, recommended path.
2. **CSS only** — keep the default glyph and restyle everything.
3. **Hand-written markup + client.js** — skip the macro and emit the
   DOM contract yourself.

## Pattern 1: caller block (the glyph override)

Nunjucks templates are strings and cannot pass first-class functions,
so `{% call %}` is the language's equivalent of "children". The macro
checks `caller` and, when present, renders the block body **inside the
button** in place of the default `<span class="locale-select-icon">`:

```njk
{% from "../locale-select.njk" import localeSelect %}

{% call localeSelect({
    label: "Language",
    locales: ["en", "fr", "ar"],
    localeLabels: { en: "English", fr: "Français", ar: "العربية" },
    storageKey: "my-app:locale"
}) %}
    <svg class="my-glyph" width="16" height="16"
         aria-hidden="true" focusable="false">
        <use href="#icon-globe"></use>
    </svg>
{% endcall %}
```

Everything else is unchanged: options still come from `opts.locales`,
each still carries its own `lang`, the keyboard contract still works,
and `autoInit()` still wires it.

Three rules:

- **Mark the glyph `aria-hidden="true"`** (and `focusable="false"` on
  SVG). The button is icon-only, so its accessible name must keep
  coming from `aria-label`. A visible-text glyph would be read out
  ahead of, or instead of, the label.
- **Do not nest an interactive element** inside the button — no nested
  `<button>`, `<a>`, or anything focusable.
- **Think twice before replacing the globe.** The default is U+1F310
  GLOBE WITH MERIDIANS followed by U+FE0E, and the globe is a
  near-universal convention for language choice. A user who cannot
  read the current page language is the user most likely to be hunting
  for this control, and they are navigating by icon recognition
  alone. A more novel or brand-specific icon costs them something real.
  A house-styled globe is fine; a non-globe is a decision to make
  consciously.

A flag is the classic wrong answer here. Flags denote countries, not
languages: Spanish is not Spain, Arabic is not any one flag, and a
user in Argentina reading "🇪🇸" is being told something inaccurate.
Text and a globe travel better.

The caller block does **not** render options. That was the old
native-`<select>` behaviour; a `{% call %}` body emitting `<option>`
elements now produces invalid markup inside a `<button>` and no
working choices.

[`../examples/localeSelectCustom.njk`](../examples/localeSelectCustom.njk)
packages the pattern as a reusable wrapper macro with an inline SVG
globe, so one branded trigger can be shared project-wide;
[`../examples/03-custom-rendering.njk`](../examples/03-custom-rendering.njk)
uses it.

## Pattern 2: CSS only

Most "custom rendering" requests are really styling requests, and the
class hooks cover them without forking anything:

| Hook                       | Element                           |
| -------------------------- | --------------------------------- |
| `.locale-select`           | Root `<div>`                      |
| `.locale-select-button`    | The trigger                       |
| `.locale-select-icon`      | The default glyph `<span>`        |
| `.locale-select-list`      | The `<ul role="listbox">`         |
| `.locale-select-option`    | Each `<li role="option">`         |
| `[aria-expanded="true"]`   | Open state, on the button         |
| `[data-active]`            | The keyboard cursor, on an option |
| `[aria-selected="true"]`   | The applied locale, on an option  |

```css
.locale-select { position: relative; display: inline-block; }
.locale-select-list {
    position: absolute;
    inset-inline-start: 0;
    z-index: 1;
    margin: 0;
    padding: 0;
    list-style: none;
}
.locale-select-list[hidden] { display: none; }
.locale-select-option[data-active] { background: Highlight; }
.locale-select-option[aria-selected="true"]::after { content: "\2713"; }
```

Use logical properties (`inset-inline-start`, not `left`) throughout.
This control writes `dir` to the document root, so its own dropdown is
one of the first things to flip when a user picks an RTL locale —
physical properties will strand it on the wrong side of the button.
See [rtl.md](./rtl.md) and [styling.md](./styling.md).

One locale-specific trap: options carry `lang`, and `lang` participates
in font selection. A stack that renders Latin text well may fall back
to a system font for `العربية` or `日本語` at a noticeably different
optical size, which shows up as a ragged list. Set a font stack with
usable coverage on `.locale-select-option`, or accept the variation
rather than clamping line-height and clipping tall scripts.

The client toggles the `hidden` attribute on the list, so let
`[hidden] { display: none }` do the work rather than driving open state
from a class of your own.

## Pattern 3: hand-written markup

`initLocaleSelect(root)` works against any DOM that satisfies the
contract, so you can skip the macro entirely. You must emit:

- a root carrying `data-lily-locale-select-root` plus the
  `data-lily-locale-select-*` opt attributes you want honoured;
- `data-lily-locale-select-button` on the trigger, with
  `aria-haspopup="listbox"`, `aria-expanded="false"`, and
  `aria-controls`;
- `data-lily-locale-select-list` on a `<ul role="listbox">` with
  `tabindex="-1"` and `hidden`;
- one `role="option"` per choice, each with a unique `id`, a
  `data-value`, and — do not skip this — a `lang` in BCP 47 hyphen
  form;
- optionally `data-lily-locale-select-input` on a hidden input for form
  participation.

The client returns an inert controller when the button or list is
missing, so a partial DOM fails quietly rather than throwing.

The `tabindex="-1"` is load-bearing: the client calls `list.focus()` on
open and attaches the keydown handler to the list, so dropping it
breaks the entire keyboard contract. The per-option `lang` is equally
load-bearing for accessibility — it is the WCAG 3.1.2 Language of Parts
conformance, and nothing else in the page supplies it.

Prefer patterns 1 and 2. Pattern 3 means owning the DOM contract
against future versions of the client module, and the exported pure
helpers (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
`matchNavigatorLanguage`) are available to a fully hand-rolled control
anyway — a plain `<select>` wired to those helpers is a legitimate
choice if you want the native control back.

## See also

- [styling.md](./styling.md) — the full hook reference and recipes.
- [rtl.md](./rtl.md) — logical properties and bidi.
- [accessibility.md](./accessibility.md) — why the glyph is
  `aria-hidden` and what the status region is for.
- [macro-opts-reference.md](./macro-opts-reference.md) — every opt.
