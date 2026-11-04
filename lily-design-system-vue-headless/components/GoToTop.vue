<script setup lang="ts">
import { useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
// GoToTop component
//
// A link back to the top of the page. Renders an <a> with the `go-to-top` hook; pass href="#top" (or
// another target) through attrs.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, required. Accessible name, rendered as aria-label (it replaces the link text as the name; keep the visible text in it).
//   href — passed through as a fallthrough attribute; unlike the Svelte port there is no "#top" default, so always pass one.
//   default slot — required. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <a>.
//
// Syntax:
//   <GoToTop href="…">…</GoToTop>
//
// Examples:
//   <GoToTop href="#top">Back to top</GoToTop>
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
//   - The link text is the consumer's children; no hardcoded text
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog defaults href to "#top" and does not render `label`; this Vue component does the opposite (the Svelte one is canonical)
//
// References:
//   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

const props = defineProps<{
    label: string;
}>();

warnMissingName("GoToTop", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);
</script>

<template>
    <!-- GoToTop.vue -->
    <a
        class="go-to-top"
        :aria-label="label"
    >
        <slot />
    </a>
</template>
