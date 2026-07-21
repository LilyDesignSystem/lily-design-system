# Examples

Self-contained HTML examples for
`lily-design-system-html-share-chooser`. Each file is a runnable page
that can be opened in any browser after building the custom-element
module.

Every example assumes a built copy of the module served at
`/dist/share-chooser.js`. The catalog build (`npm run build` from
`lily-design-system-html-helpers/`) emits it as `dist/index.js`, so
either adjust the `<script type="module" src=…>` in each example or
serve that file at the nominal path. The path is a convention, not a
requirement.

| #  | File                                                       | Demonstrates                                                    |
|----|------------------------------------------------------------|-----------------------------------------------------------------|
| 1  | [`01-basic.html`](./01-basic.html)                         | Two destinations plus a copy action.                            |
| 2  | [`02-copy-only.html`](./02-copy-only.html)                 | No targets at all — copy the page URL and nothing else.         |
| 3  | [`03-strategies.html`](./03-strategies.html)               | `auto` vs `native` vs `list` side by side.                      |
| 4  | [`04-events.html`](./04-events.html)                       | `share` / `copy` / `nativeshare` events and their callbacks.    |
| 5  | [`05-custom-rendering.html`](./05-custom-rendering.html)   | `renderButtonContent()`: inline SVG, and glyph + visible label. |

## No social networks ship with this package

The examples use Mastodon and `mailto:` purely as illustrations of the
`href(url, title, text)` shape. Nothing in the package knows about any
network, and nothing should be copied from here as an endorsed endpoint
— share URLs change, and which networks belong in your UI is an
editorial and privacy decision that is yours. See
[`../spec/index.md` §2](../spec/index.md#2-non-goals).

## `targets` is set in JavaScript, always

Every example wires `targets` as a **property**, never an attribute.
That is not stylistic: each target's `href` is a function, so no string
attribute could carry it. See
[`../spec/index.md` §4.3](../spec/index.md#43-property-only-members).

## The examples ship their own CSS — deliberately

The package ships no CSS at all, and that includes the dropdown's
positioning: the `<ul class="share-chooser-list">` renders in normal flow
until you give the root `position: relative` and the list
`position: absolute`. Each example carries a `<style>` block with the
minimum needed.

The rule people forget is in there too:

```css
.share-chooser-list[hidden] { display: none; }
```

`hidden` is only `display: none` at the UA-stylesheet level, so the
`display` you set for positioning would otherwise win and leave the
closed list visible.

Full guidance: [`../docs/styling.md`](../docs/styling.md).

## Try the accessibility costs, not just the happy path

Each example is worth exercising in the states that go wrong — they are
the ones [`../docs/accessibility.md`](../docs/accessibility.md)
describes:

- Open `03-strategies.html` on a phone **and** on a desktop Firefox. The
  same markup behaves differently; under `auto` your destinations are
  never shown on the phone.
- Serve any example over plain `http://` (not `localhost`) and try the
  copy action. It fails, and the only feedback is
  `copy-failed-label` — which is why that string should tell the user
  what to do next.
- Tab through with a screen reader running. The trigger's whole name is
  its `aria-label`.

---

Lily™ and Lily Design System™ are trademarks.
