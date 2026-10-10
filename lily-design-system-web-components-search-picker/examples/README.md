# Examples

Self-contained HTML examples for `@lilydesignsystem/web-components-search-picker`.
Each file is a runnable page that can be opened in any browser after
building the custom-element module.

Every example assumes a built copy of the module served at
`/dist/search-picker.js`. The catalog build (`npm run build` in
this package) emits it as `dist/index.js`, so
either adjust the `<script type="module" src=…>` in each example or
serve that file at the nominal path.

| #   | File                                     | Demonstrates                                                         |
| --- | ---------------------------------------- | -------------------------------------------------------------------- |
| 1   | [`01-basic.html`](./01-basic.html)       | The three required labels and a placeholder; `foo` goes to `/?foo`.  |
| 2   | [`02-events.html`](./02-events.html)     | A custom `action`, the `search` event, and an in-page `navigate`.    |

Every user-facing string is an attribute. `⏎` is the submit button's
visible symbol only; its accessible name is `submit-label`.

The examples carry their own minimal `<style>`: the package ships no
CSS. See [`../docs/styling.md`](../docs/styling.md).

---

Lily™ and Lily Design System™ are trademarks.
