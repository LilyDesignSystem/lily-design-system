<script setup lang="ts">
// DocumentListItem component
//
// One document in a DocumentList. Renders an <li> with the `document-list-item` hook around the
// consumer's link, type and size.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
//   default slot — required. The document link and its details.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <li>.
//
// Syntax:
//   <DocumentListItem>…</DocumentListItem>
//
// Examples:
//   <DocumentList><DocumentListItem><a href="/report.pdf">Report</a></DocumentListItem></DocumentList>
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
    <!-- DocumentListItem.vue -->
    <li
        class="document-list-item"
        :aria-label="label"
    >
        <slot />
    </li>
</template>
