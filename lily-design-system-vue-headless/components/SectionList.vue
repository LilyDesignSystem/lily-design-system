<script setup lang="ts">
// SectionList component
//
// A list of sections. Renders a <ul> with the `section-list` hook; items are SectionListItem.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
//   default slot — required. The SectionListItem children.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <ul>.
//
// Syntax:
//   <SectionList>…</SectionList>
//
// Examples:
//   <SectionList><SectionListItem><a href="#one">One</a></SectionListItem></SectionList>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given (the Svelte port accepts but does not render it)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders no aria-label; this Vue component does not (the Svelte one is canonical)
//
// References:
//   - MDN <ul>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul

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
    <!-- SectionList.vue -->
    <ul
        class="section-list"
        :aria-label="label"
    >
        <slot />
    </ul>
</template>
