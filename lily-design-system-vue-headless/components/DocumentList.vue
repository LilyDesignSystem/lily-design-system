<script setup lang="ts">
// DocumentList component
//
// A list of documents. Renders a <ul> with the `document-list` hook; items are DocumentListItem.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The DocumentListItem children.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <ul>.
//
// Syntax:
//   <DocumentList label="…">…</DocumentList>
//
// Examples:
//   <DocumentList label="Reports"><DocumentListItem>…</DocumentListItem></DocumentList>
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
    <!-- DocumentList.vue -->
    <ul
        class="document-list"
        :aria-label="label"
    >
        <slot />
    </ul>
</template>
