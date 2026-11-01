# WarningText

A short warning shown as an icon and a bold line of text, with a visually hidden prefix supplied by the consumer.

## Canonical documentation

See [components/warning-text/index.md](../../../../components/warning-text/index.md) for the full component documentation: behaviour, props and guidance.

## Usage

```html
<lily-warning-text>
  <span icon>!</span>
  <span class="visually-hidden">Warning</span> You can be fined up to £5,000 if you do not register.
</lily-warning-text>
```

## Contract

`<div class="warning-text">`; an element projected with the `icon` attribute inside `<span class="warning-text-icon" aria-hidden="true">` (always rendered, empty when nothing is projected); the rest (the consumer's visually hidden prefix, then the text) inside `<strong class="warning-text-text">`. No rest-props spread, no role, no strings.

---

Lily™ and Lily Design System™ are trademarks.
