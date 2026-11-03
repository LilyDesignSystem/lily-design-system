<script setup lang="ts">
// ProgressBar component
//
// A horizontal progress indicator. Renders an empty <div role="progressbar"> with the `progress-bar`
// hook; the bar's fill is drawn by the consumer's CSS from the ARIA values.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, required. Accessible name, rendered as aria-label.
//   value — number, required. The current value, rendered as aria-valuenow.
//   min — number, default 0. Rendered as aria-valuemin.
//   max — number, default 100. Rendered as aria-valuemax.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <ProgressBar label="…" value={40} />
//
// Examples:
//   <ProgressBar label="Upload progress" value={40} max={100} />
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys (a progress bar is not focusable)
//
// Accessibility:
//   - role="progressbar" with aria-valuenow/min/max exposes the value; the component does not clamp or validate it
//   - For an unknown duration use the `loading` component; this one always reports a value
//   - Consider the native <progress> (the `progress` component) when no styling hook on a div is needed
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - The bar has no children; draw the fill with CSS reading the aria attributes
//
// References:
//   - WAI-ARIA progressbar role: https://www.w3.org/TR/wai-aria-1.2/#progressbar

withDefaults(
    defineProps<{
        label: string;
        value: number;
        min?: number;
        max?: number;
    }>(),
    { min: 0, max: 100 },
);
</script>

<template>
    <!-- ProgressBar.vue -->
    <div
        class="progress-bar"
        role="progressbar"
        :aria-valuenow="value"
        :aria-valuemin="min ?? 0"
        :aria-valuemax="max ?? 100"
        :aria-label="label"
    ></div>
</template>
