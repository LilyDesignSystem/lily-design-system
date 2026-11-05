<script setup lang="ts">
// EndNotes component
//
// The notes section at the end of an article. Renders a <section> with the `end-notes` hook, named by
// `label`.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, required. No default: the words are yours. Accessible name, rendered as aria-label on the section.
//   default slot — required. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <section>.
//
// Syntax:
//   <EndNotes label="…">…</EndNotes>
//
// Examples:
//   <EndNotes label="Notes"><ol><li>First note.</li></ol></EndNotes>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - A <section> with an accessible name is exposed as a region landmark
//
// Internationalization:
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <section>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section

defineProps<{
    /** Accessible label set on aria-label. Defaults to 'End notes'. */
    label: string;
}>();
</script>

<template>
    <!-- EndNotes.vue -->
    <section
        class="end-notes"
        :aria-label="label"
    >
        <slot />
    </section>
</template>
