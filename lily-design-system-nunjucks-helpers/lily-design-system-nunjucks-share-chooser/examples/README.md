# ShareChooser examples

Each file is a self-contained Nunjucks template fragment. They assume
`share-chooser.njk` is resolvable by your environment's loader and that
`share-chooser.client.js` is served somewhere the browser can import it.

| File | Shows |
| ---- | ----- |
| [`01-basic.njk`](./01-basic.njk) | Minimal control: label, two destinations, copy. |
| [`02-strategies.njk`](./02-strategies.njk) | `auto` / `native` / `list`, and callbacks. |
| [`03-client-function-hrefs.njk`](./03-client-function-hrefs.njk) | The canonical function-`href` API, on the client. |
| [`04-custom-glyph.njk`](./04-custom-glyph.njk) | Replacing ↪ via a `{% call %}` body, with a visible label. |

## Two things every example assumes

**You build the destination URLs.** No social endpoints ship with this
package — the URLs below are illustrative placeholders on `.example`
domains. Substitute your own, and remember that share URLs change.

**`href` is a string in the macro.** A Nunjucks macro cannot call an
arbitrary JavaScript function, so the canonical
`href(url, title, text)` signature becomes a resolved string here. See
[`../spec/index.md` §3.3](../spec/index.md) for why, and
[`03-client-function-hrefs.njk`](./03-client-function-hrefs.njk) for how
to get the function form back on the client.

---

Lily™ and Lily Design System™ are trademarks.
