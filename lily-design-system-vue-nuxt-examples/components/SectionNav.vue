<script setup lang="ts">
// SectionNav component
//
// Navigation between the sections of a page or document. Renders a <nav> with the `section-nav` hook;
// the links are SectionList and SectionListItem children.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The section list.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <nav>.
//
// Syntax:
//   <SectionNav label="…">…</SectionNav>
//
// Examples:
//   <SectionNav label="Sections"><SectionList>…</SectionList></SectionNav>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - The native <nav> element supplies the navigation landmark; give it a `label`
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <nav>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

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
    <!-- SectionNav.vue -->
    <nav
        class="section-nav"
        :aria-label="label"
    >
        <slot />
    </nav>
</template>
