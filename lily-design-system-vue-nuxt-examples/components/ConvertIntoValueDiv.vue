<script setup lang="ts">
// ConvertIntoValueDiv component
//
// The converted value, such as a text input showing a number of euros. Converts nothing; the consumer
// does the arithmetic and supplies the controls and any rates.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   default slot — optional. The value control.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <ConvertIntoValueDiv>…</ConvertIntoValueDiv>
//
// Examples:
//   <ConvertDiv label="Convert currency"><ConvertFromDiv>…</ConvertFromDiv><ConvertIntoDiv>…</ConvertIntoDiv></ConvertDiv>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role or ARIA of its own; the labelled group is the ConvertDiv root
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - A part of ConvertDiv; draws nothing and carries no strings of its own
//
// References:
//   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
</script>

<template>
    <!-- ConvertIntoValueDiv.vue -->
    <div class="convert-into-value-div">
        <slot />
    </div>
</template>
