<script setup lang="ts">
import { useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
// ChatNav component
//
// A navigation container for chat information.
//
// Props:
//   label — string, required. Accessible label via aria-label.
//   default slot — component content.
//
// Accessibility:
//   - native <nav> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

const props = defineProps<{
    /** Accessible label set on aria-label. */
    label: string;
}>();

warnMissingName("ChatNav", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);
</script>

<template>
    <!-- ChatNav.vue -->
    <nav
        class="chat-nav"
        :aria-label="label"
    >
        <slot />
    </nav>
</template>
