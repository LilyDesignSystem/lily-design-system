# TextAreaInputWithCharacterCounter

A multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters".

## Canonical documentation

See [components/text-area-input-with-character-counter/index.md](../../../components/text-area-input-with-character-counter/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/text-area-input-with-character-counter/macro.njk" import textAreaInputWithCharacterCounter %}

{{ textAreaInputWithCharacterCounter({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
