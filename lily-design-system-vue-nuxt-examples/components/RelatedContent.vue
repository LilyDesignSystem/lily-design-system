<script setup lang="ts">
// RelatedContent component
//
// Links and notes related to the main content. Renders an <aside> with the `related-content` hook.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The related links or notes.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <aside>.
//
// Syntax:
//   <RelatedContent label="…">…</RelatedContent>
//
// Examples:
//   <RelatedContent label="Related content"><ul><li><a href="/more">More</a></li></ul></RelatedContent>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - The native <aside> element supplies the complementary landmark
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <aside>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside

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
    <!-- RelatedContent.vue -->
    <aside
        class="related-content"
        :aria-label="label"
    >
        <slot />
    </aside>
</template>
