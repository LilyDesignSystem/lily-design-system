# OneTimePasswordInput

A single-line input for a one-time code (SMS, authenticator, email). One real input, so SMS autofill and paste work.

## Implementation Notes

- Nunjucks macro `oneTimePasswordInput` in `components/one-time-password-input/macro.njk`; root is `<input type="text">` with base class `one-time-password-input` plus `params.classes`
- `params.attributes` is spread onto the root element
- Port of the Svelte canonical (`lily-design-system-svelte-headless`)


## Props

- `label` (required): aria-label
- `length` (required, no default): maxlength and data-length
- `value`, `name`, `id`, `required`, `disabled`
- `inputMode` (default `numeric`), `pattern` (default `[0-9]*`)
- `classes`, `attributes`

## Usage

```njk
{{ oneTimePasswordInput({ label: "Security code", length: 6, name: "code" }) }}
```

## Keyboard Interactions

Native only.

## ARIA

`aria-label`; `autocomplete="one-time-code"`; `inputmode`; `spellcheck="false"`; `autocapitalize="off"`.

## When to Use

- You need this pattern in a server-rendered Nunjucks page, with consumer CSS for every visual decision.

## When Not to Use

- See the canonical Svelte component docs for alternatives; this macro has the same contract.

## Headless

No CSS, no inline styles, no icons, no hardcoded strings: every visible string is a param.

## Testing

`macro.test.js` renders the macro through Nunjucks and asserts each contract line in jsdom (`pnpm test`).

## Related components

See `components/one-time-password-input/` in the canonical catalog.
