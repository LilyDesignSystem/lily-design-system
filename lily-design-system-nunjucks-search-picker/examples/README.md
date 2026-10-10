# SearchPicker examples

Each file is a self-contained Nunjucks template fragment. They assume
`search-picker.njk` is resolvable by your environment's loader and that
`search-picker.client.js` is served somewhere the browser can import it.

| File | Shows |
| ---- | ----- |
| [`01-basic.njk`](./01-basic.njk) | The three required labels and an optional placeholder; a search for `foo` goes to `/?foo`. |
| [`02-action-and-callbacks.njk`](./02-action-and-callbacks.njk) | A custom `action`, plus the client-only `navigate` and `onSearch` options. |

Every user-facing string is a parameter. `⏎` is the submit button's
visible symbol only; its accessible name is `submitLabel`.

---

Lily™ and Lily Design System™ are trademarks.
