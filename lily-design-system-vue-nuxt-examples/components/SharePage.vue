<script setup lang="ts">
import { useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
// SharePage component
//
// A group of controls for sharing the current page. Renders a <div> with the `share-page` hook; it
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, required. Accessible name, rendered as aria-label on the root.
//   default slot — required. The sharing links or buttons.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <SharePage label="…">…</SharePage>
//
// Examples:
//   <SharePage label="Share this page"><a href="…">Email</a></SharePage>
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
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

const props = defineProps<{
    label: string;
}>();

warnMissingName("SharePage", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);
</script>

<template>
    <!-- SharePage.vue -->
    <div
        class="share-page"
        role="group"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
