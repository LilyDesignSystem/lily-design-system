# WarningText

A short warning shown as an icon and a bold line of text, with a visually hidden prefix supplied by the consumer.

## Canonical documentation

See [components/warning-text/index.md](../../../components/warning-text/index.md) for the full component documentation: behaviour, props and guidance.

## Usage

```njk
{% from "components/warning-text/macro.njk" import warningText %}
{{ warningText({
  iconText: "!",
  html: '<span class="visually-hidden">Warning</span> You can be fined up to £5,000 if you do not register.'
}) }}
```

## Contract

`<div class="warning-text">`; `iconText` or `iconHtml` inside `<span class="warning-text-icon" aria-hidden="true">`, only when supplied; `html`, `text` or the caller body (the consumer's visually hidden prefix, then the text) inside `<strong class="warning-text-text">`; `id`, `classes` and `attributes` on the root. No role, no strings.

---

Lily™ and Lily Design System™ are trademarks.
