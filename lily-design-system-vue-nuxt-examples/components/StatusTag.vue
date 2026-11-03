<script setup lang="ts">
// StatusTag component
//
// A short status label. Renders a <span> with the `status-tag` hook; the status vocabulary and colours
// are the consumer's.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <span>.
//
// Syntax:
//   <StatusTag type="success">…</StatusTag>
//
// Examples:
//   <StatusTag type="warning">Pending</StatusTag>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - No role is rendered; pass role="status" through attrs only when the tag's text changes after load
//   - Meaning must come from the text, not the colour (WCAG 1.4.1)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders role="status" and a `type` prop that sets data-type; this Vue component does not (the Svelte one is canonical)
//
// References:
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

withDefaults(
    defineProps<{
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- StatusTag.vue -->
    <span
        class="status-tag"
        :aria-label="label"
    >
        <slot />
    </span>
</template>
