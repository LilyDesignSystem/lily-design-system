# CurrencyInput

A locale-aware currency input rendered as `<input type="text" inputmode="decimal">`. The component does not format the displayed value itself — formatting (Intl.NumberFormat, separators, currency symbol placement) is the consumer's responsibility because formatting rules vary by locale and design context.

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `modelValue`: number | undefined -- current numeric value (v-model)
- `currencyCode`: string (default `"USD"`) -- ISO 4217 currency code, exposed as `data-currency-code` for consumer formatting
- `min`: number (optional) -- minimum allowed value
- `max`: number (optional) -- maximum allowed value
- `required`: boolean (default false)
- `disabled`: boolean (default false)

## Emits

- `update:modelValue` — fires with the parsed number, or `undefined` when the input is empty / non-numeric

## Usage

```vue
<script setup>
import { ref } from "vue";
const amount = ref<number | undefined>(undefined);
</script>

<template>
  <CurrencyInput
    label="Amount in USD"
    v-model="amount"
    currency-code="USD"
    :min="0"
  />
</template>
```

## References

- HTML text input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
- Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- ISO 4217 Currency Codes: https://www.iso.org/iso-4217-currency-codes.html
