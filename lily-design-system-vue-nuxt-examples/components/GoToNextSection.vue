<script setup lang="ts">
// GoToNextSection component
//
// A link that takes the user to the next section of the current page. Renders an <a> with the `go-to-
// next-section` hook whose visible text and accessible name are both `label`.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, required. The link text, also set as aria-label.
//   href — string, required. The URL of the next section, typically #section-id.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <a>.
//
// Syntax:
//   <GoToNextSection href="#…" label="…" />
//
// Examples:
//   <GoToNextSection href="#section-id" label="…" />
//
// Keyboard:
//   - Tab: moves focus onto the link
//   - Enter: follows the link (native browser behaviour)
//
// Accessibility:
//   - A native <a href> link: the destination and the link text give the role and name
//   - aria-label repeats the visible text; keep them identical (WCAG 2.5.3)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - The link text is the consumer's translated `label`; the component has no text of its own
//
// References:
//   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

defineProps<{
    label: string;
    href: string;
}>();
</script>

<template>
    <!-- GoToNextSection.vue -->
    <a
        class="go-to-next-section"
        :href="href"
        :aria-label="label"
        >{{ label }}</a
    >
</template>
