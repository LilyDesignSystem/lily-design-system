<script setup lang="ts">
// SectionListItem component
//
// One item in a SectionList. Renders an <li> with the `section-list-item` hook.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accepted but not rendered.
//   default slot — required. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <li>.
//
// Syntax:
//   <SectionListItem current>…</SectionListItem>
//
// Examples:
//   <SectionListItem current><a href="#one" aria-current="location">One</a></SectionListItem>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - Put aria-current on the link inside the item to mark the current section
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders a `current` prop that sets data-current; this Vue component does not (the Svelte one is canonical)
//
// References:
//   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

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
    <!-- SectionListItem.vue -->
    <li
        class="section-list-item"
        :aria-label="label"
    >
        <slot />
    </li>
</template>
