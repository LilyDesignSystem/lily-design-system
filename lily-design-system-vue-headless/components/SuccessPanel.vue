<script setup lang="ts">
// SuccessPanel component
//
// A confirmation panel shown after an action succeeds. Renders a <div> with the `success-panel` hook;
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The confirmation heading and text.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <SuccessPanel label="…">…</SuccessPanel>
//
// Examples:
//   <SuccessPanel label="Saved"><h2>Saved</h2><p>Your changes were saved.</p></SuccessPanel>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
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
    <!-- SuccessPanel.vue -->
    <div
        class="success-panel"
        role="status"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
