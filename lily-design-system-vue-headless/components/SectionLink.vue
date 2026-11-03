<script setup lang="ts">
// SectionLink component
//
// A link to a section of the page. Renders an <a> with the `section-link` hook; pass the section
// anchor as href through attrs.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label (it replaces the link text as the name; keep the visible text in it).
//   href — passed through as a fallthrough attribute; unlike the Svelte port there is no "#top" default, so always pass one.
//   default slot — required. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <a>.
//
// Syntax:
//   <SectionLink href="…">…</SectionLink>
//
// Examples:
//   <SectionLink href="#methods">Methods</SectionLink>
//
// Keyboard:
//   - Tab: moves focus onto the link
//   - Enter: follows the link (native browser behaviour)
//
// Accessibility:
//   - A native <a>; pass href through attrs
//   - aria-label, when given, replaces the visible text as the accessible name and must contain it (WCAG 2.5.3)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog defaults href to "#top" and does not render `label`; this Vue component does the opposite (the Svelte one is canonical)
//
// References:
//   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

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
    <!-- SectionLink.vue -->
    <a
        class="section-link"
        :aria-label="label"
    >
        <slot />
    </a>
</template>
