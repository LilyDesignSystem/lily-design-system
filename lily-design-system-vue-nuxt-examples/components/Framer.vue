<script setup lang="ts">
// Framer component
//
// A frame around embedded or mocked content. Renders a <div> with the `framer` hook; the frame's look
// is the consumer's CSS.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The framed content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <Framer label="…">…</Framer>
//
// Examples:
//   <Framer>…</Framer>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - A <div> has no role; pass role="group" through attrs so the label is announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

withDefaults(
    defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- Framer.vue -->
    <div
        class="framer"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
