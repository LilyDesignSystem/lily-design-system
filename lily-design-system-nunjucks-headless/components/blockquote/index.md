# Blockquote

a block-level quotation with optional source citation

## Description

Blockquote renders a native `<blockquote>` element. Consumers supply
the quote content as `text`, `html`, or a Nunjucks `{% call %}` block.
A `cite` URL may be supplied for the source URL (rendered as the
`cite` attribute), and `citationText` renders a visible attribution
inside a `<footer class="blockquote-citation">`.

## HTML tag

`<blockquote>`

## CSS class

`blockquote`

## Params

- `text` — string. Plain text quote content (escaped).
- `html` — string. Raw HTML quote content (rendered via `| safe`).
- `cite` — string. URL of the source (rendered as the `cite`
  attribute on the `<blockquote>`).
- `citationText` — string. Visible attribution text (e.g.,
  `"— Author Name, Source"`).
- `label` — string. `aria-label` override.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/blockquote/macro.njk" import blockquote %}

{{ blockquote({
  text: "The web is for everyone.",
  cite: "https://example.com/source",
  citationText: "— Tim Berners-Lee"
}) }}
```

With block content:

```njk
{% call blockquote({ citationText: "— Author" }) %}
  <p>Multi-paragraph quote.</p>
  <p>Second paragraph.</p>
{% endcall %}
```

## Accessibility

- `<blockquote>` provides implicit semantics.
- `aria-label` is optional; supply one when the quotation needs an
  explicit accessible name distinct from its content.
- The `cite` attribute is machine-readable metadata; provide a
  visible `citationText` for human readers.

## When to use

- Pull quotes, testimonials, or any extended quoted content.

## When not to use

- For inline quotations, use the native `<q>` element instead.

## Headless

No CSS or JavaScript bundled. Consumers provide all styling.

## Testing

`components/blockquote/macro.test.js` verifies the base class,
`cite` attribute, citation footer rendering, content slots, and
attribute pass-through.

## References

- [MDN: `<blockquote>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote)
- [Mozilla Protocol: Blockquote](https://protocol.mozilla.org/components/detail/blockquote)

---

Lily™ and Lily Design System™ are trademarks.
