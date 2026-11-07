<script setup lang="ts">
// PhaseBanner component
//
// A banner that states a service's phase (alpha or beta) and invites feedback. Renders a <div> with
// the `phase-banner` hook around the consumer's tag and text.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The phase tag and message.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <PhaseBanner label="…">…</PhaseBanner>
//
// Examples:
//   <PhaseBanner label="Service phase"><strong>Beta</strong> This is a new service.</PhaseBanner>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - A <div> has no role; pass role="region" or "group" through attrs so the label is announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - NHS UK design system: https://service-manual.nhs.uk/design-system

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
    <!-- PhaseBanner.vue -->
    <div
        class="phase-banner"
        :role="label ? 'group' : undefined"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
