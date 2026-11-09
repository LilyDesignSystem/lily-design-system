<script setup lang="ts">
// SectionListItem component
//
// One item in a SectionList. Renders an <li> with the `section-list-item` hook.
//
// Props:
//   current — boolean, default false. Sets an empty data-current attribute when true.
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
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
//   - Native <li> semantics; the link inside the item carries its own name
//   - Put aria-current on the link inside the item to mark the current section
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - data-* is for consumer CSS, ARIA is for assistive technology
//
// References:
//   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

withDefaults(defineProps<{ current?: boolean }>(), { current: false });
</script>

<template>
    <!-- SectionListItem.vue -->
    <li
        class="section-list-item"
        :data-current="current ? '' : undefined"
    >
        <slot />
    </li>
</template>
