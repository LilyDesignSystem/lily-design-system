# Troubleshooting

Symptom-first. Each entry names the cause and the fix.

## "Nothing on the page is translated"

Working as designed. `<locale-select>` applies `lang` and `dir` and
tells you the choice — it does **not** translate. There are no
message catalogs in the package and no network calls.

Wire the `localechange` event to your i18n runtime, or navigate to a
locale-prefixed URL. See
[i18n-integration.md](./i18n-integration.md) and
[recipes.md](./recipes.md#drive-a-client-side-i18n-library).

## "`<locale-select>` stays empty — the element never upgrades"

The module never ran, or ran before the element was in the DOM in a
way that left it unregistered.

1. Confirm registration: `customElements.get("locale-select")` should
   be a function in the console.
2. Confirm the import has a side effect. Importing *only* types is
   elided by the compiler:
   ```ts
   import "lily-design-system-html-locale-select";              // registers
   import type { LocaleSelect } from "…";                        // does NOT
   ```
3. Check for a 404 or a MIME error on the module script in the
   network tab. A module that fails to load fails silently in the
   page.
4. If you registered under a custom tag name, make sure the markup
   uses that name.

## "The dropdown pushes the page down instead of floating over it"

You have not positioned the list. The package ships no CSS, so the
`<ul>` starts life as a normal block.

```css
.locale-select { position: relative; }
.locale-select-list { position: absolute; top: 100%; inset-inline-start: 0; z-index: 10; }
```

Use `inset-inline-start`, not `left` — see the next entry.

## "The dropdown detaches from the button in Arabic / Hebrew"

You used physical positioning (`left: 0`) and the element flipped the
document to `dir="rtl"`. The list is now pinned to the left edge while
the button sits on the right.

Switch to logical properties (`inset-inline-start`, `padding-inline`,
`margin-inline`). This control writes `dir` to the document root, so
it will mirror its own container — logical properties are not
optional here. See [styling.md](./styling.md) and [rtl.md](./rtl.md).

## "The list is always visible, even when closed"

A `display` declaration is overriding the `hidden` attribute, which is
only a UA-stylesheet `display: none`:

```css
.locale-select-list { display: block; }   /* breaks hidden */
.locale-select-list[hidden] { display: none; }   /* add this */
```

Same trap with `display: flex` and `display: grid`.

## "Keyboard users can't tell which option they're on"

Two possible causes:

1. You styled `[aria-selected="true"]` but not `[data-active]`. The
   arrow keys move `data-active`; `aria-selected` marks the *applied*
   locale and does not move until you commit.
2. You removed the focus outline from the `<ul>`. Focus sits on the
   list while it is open, never on an `<li>`.

Style both states distinctly, and never `outline: none` on
`.locale-select-list`.

## "The globe shows as a box, a question mark, or a blue emoji"

The glyph is a bare codepoint (U+1F310 GLOBE WITH MERIDIANS followed
by U+FE0E VARIATION SELECTOR-15) rendered from the system font stack.
The package bundles no icon font and no SVG.

- **Box / question mark**: the platform has no glyph for it. Override
  `renderButtonContent()` and supply your own inline SVG — see
  [custom-rendering.md](./custom-rendering.md).
- **Blue colour-emoji globe**: VS15 requests the text presentation,
  but some platforms ignore it. Force it in CSS:
  ```css
  .locale-select-icon { font-variant-emoji: text; }
  ```
  Where `font-variant-emoji` is unsupported, put a text-presentation
  font first in the stack for that span.
- **Size jumps between platforms**: give the button a `min-width` so
  its box does not resize with the glyph.

## "Locale does not persist across reloads"

Check, in order:

1. `storage-key` is actually set. Without it nothing is persisted.
2. You are not in Safari private mode or a blocked-storage context.
   All storage access is wrapped in `try` / `catch`, so failures
   degrade silently to "no persistence" rather than throwing.
3. Nothing else is clearing that key — a logout handler calling
   `localStorage.clear()` is a common culprit.
4. You are not *also* rendering a `value` attribute. `value` wins over
   storage on first connect, so a stale server-rendered `value` will
   look like "persistence is broken" on every load.

## "The stored locale is ignored — my `value` always wins"

That is the documented precedence: `value` > storage > navigator >
`default-value`. It exists so a server-resolved cookie is
authoritative.

If you want storage to win, omit `value` from the markup.

## "`detect-from-navigator` does nothing"

Detection only runs when there is no `value` **and** nothing in
storage. Once a user has picked a locale, the stored choice outranks
the browser preference forever — deliberately.

Also confirm the attribute is really present. `detect-from-navigator="false"`
reads as false, matching the boolean-attribute convention.

If it is present and storage is empty and it still does not fire, the
match probably failed: `matchNavigatorLanguage` returns `""` when no
navigator language matches your list, and resolution falls through to
`default-value`. Test the rule directly:

```ts
import { matchNavigatorLanguage } from "lily-design-system-html-locale-select";
matchNavigatorLanguage([...navigator.languages], ["en", "fr"]);
```

## "`dir` is wrong, or fights with my framework"

If two writers own `dir`, turn the element's half off:

```html
<locale-select label="Language" locales="en,ar" apply-dir="false"></locale-select>
```

Remember `apply-dir` is **inverted** — absent means *on*. Only the
literal string `"false"` disables it.

If `dir` is simply wrong for a specific locale, check the code you are
passing. Detection reads explicit script subtags first, so
`uz_Arab_AF` is correctly RTL but bare `uz` is not. Supply the script
subtag when it is what disambiguates.

## "`lang` is `en_US` instead of `en-US`"

It should not be — the element converts to hyphen form when writing
`lang`. If you are seeing the underscore, you are probably reading
`el.value` (which preserves *your* form, by design) rather than the
attribute. Use `el.tagFor(code)` or the exported `bcp47LocaleTag(code)`
for the BCP 47 form. See [bcp47.md](./bcp47.md).

## "Option labels show raw codes like `pt_BR`"

Label resolution falls through: `localeLabels` → built-in table →
`Intl.DisplayNames` → the raw code. Seeing the raw code means all
three lookups missed.

The built-in table is keyed on the exact strings in `locales.tsv`, so
`pt_BR` resolves but `pt-br` may not. Either normalise your codes or
supply the label explicitly:

```ts
el.localeLabels = { "pt-br": "Português (Brasil)" };
```

## "`locale-labels` is ignored"

Malformed JSON is swallowed and treated as `{}` rather than throwing.
Attribute-quoting is the usual cause — the JSON needs double quotes
inside, so the attribute needs single quotes outside:

```html
<!-- wrong -->
<locale-select locale-labels="{"fr":"Français"}"></locale-select>
<!-- right -->
<locale-select locale-labels='{"fr":"Français"}'></locale-select>
```

Setting the JS property avoids the escaping problem entirely:

```ts
el.localeLabels = { fr: "Français" };
```

## "Setting `el.locales` does nothing"

The element had not upgraded yet, so you set a plain expando property
on an unupgraded element and the real setter never ran:

```ts
await customElements.whenDefined("locale-select");
(document.querySelector("locale-select") as LocaleSelect).locales = LOCALES;
```

## "The list closes as soon as I click inside it"

Something is moving focus out of the root, or a wrapper is
re-rendering the element mid-click. The element closes on `focusout`
when focus leaves the root, and on a document click outside the root.

If a framework wrapper re-creates the `<locale-select>` on every
render, the rendered DOM is rebuilt underneath the click. Give the
element a stable key / identity so it is not recreated.

## "The list resets while it is open"

A structural attribute changed. `locales`, `locale-labels`, `label`,
`name`, and `class` all rebuild the DOM and close the list; only
`value` syncs in place. Batch structural updates outside of an open
interaction.

## "`localechange` fires on page load, before the user did anything"

Expected. The element applies the resolved initial locale on connect
and reports it, so listeners do not need separate initialisation
logic.

If your handler navigates or reloads, guard it or you will loop — see
[recipes.md](./recipes.md#reload-the-page-on-locale-change).

## "`localechange` never fires"

Check that you are listening on the `<locale-select>` host or an
ancestor, not on the rendered inner `<div>` (which may be replaced).
The event is `bubbles: true` and `composed: true`, so `document` works
as a delegation root.

Also confirm the value is actually changing. Re-selecting the
already-active locale is a no-op.

## "Two locale selects fight over `<html lang>`"

Last write wins, and neither knows about the other. Unlike
theme-select there is no `name`-discriminated shared resource here —
`name` is only a form-field name.

Have one authoritative select write to the document root and point any
others at a scoped `target`, or keep them in sync through your own
state layer.

## "Selection is lost when a `<dialog>` closes"

Some dialog implementations remove their content from the DOM on
close, which disconnects the element; re-adding it constructs a fresh
one that re-resolves from scratch.

Set `storage-key`, or render `value` from your own state when the
dialog reopens.

## "TypeScript: `el.value` is `string`, not my locale union"

`value` is intentionally `string` — the element does not know your
locale set. Narrow at your boundary:

```ts
type AppLocale = "en" | "fr" | "ar";
const locale = el.value as AppLocale;
```

Or type the whole element:

```ts
const el = document.querySelector<LocaleSelect>("locale-select")!;
```

## "`customElements.define` throws: tag already defined"

The barrel registers on import and guards with a
`customElements.get(...)` check, so this comes from a *second*
registration — usually your own `define` call, or two copies of the
package in the bundle.

Deduplicate the dependency, or import the class directly from
`./locale-select.js` (no side effect) and register it yourself under
your own tag name.

## "Hydration mismatch inside a framework"

The element renders its own light-DOM children on connect, which a
virtual DOM will see as unexpected content it did not create.

Render `<locale-select>` as a leaf with no framework-managed children,
and let the element own everything inside it. In React, that means no
children and no `dangerouslySetInnerHTML`. See [ssr.md](./ssr.md).

## "Subclass override isn't called"

Only `renderButtonContent()`, `labelFor()`, and `tagFor()` are public
and overridable. The rendering internals live in private `#` fields
and cannot be overridden — that is deliberate, so the aria wiring and
keyboard contract cannot be half-replaced.

If you need to go further, use tier 2: post-process after
`super.connectedCallback()`, and accept that you now own the whole
accessibility and keyboard contract. See
[custom-rendering.md](./custom-rendering.md).

## "My `renderButtonContent()` output goes stale"

It should not — the hook re-runs on every state sync (`value` and
`open` changes). If yours is stale, you probably cached the returned
node instead of building a fresh one:

```ts
// wrong — same node forever
private node = document.createElement("span");
renderButtonContent() { return this.node; }

// right — build fresh each call
renderButtonContent() {
  const span = document.createElement("span");
  span.textContent = this.labelFor(this.value);
  return span;
}
```
