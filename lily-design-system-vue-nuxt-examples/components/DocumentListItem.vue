<script setup lang="ts">
// DocumentListItem component
//
// One document in a DocumentList. Renders an <li> with the `document-list-item` hook around the
// consumer's link, type and size.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
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
//   - Native <li> semantics; the link inside the item carries its own name
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
</script>

<template>
    <!-- DocumentListItem.vue -->
    <li class="document-list-item">
        <slot />
    </li>
</template>
