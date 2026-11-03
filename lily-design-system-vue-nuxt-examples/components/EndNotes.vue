<script setup lang="ts">
// EndNotes component
//
// The notes section at the end of an article. Renders a <section> with the `end-notes` hook, named by
// `label`.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, default "End notes". Accessible name, rendered as aria-label on the section.
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
//   - The default label "End notes" is English text inside the component; always pass a translated `label` (tracked as a defect against the no-hardcoded-strings rule)
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Always pass `label`, so the English default is never used
//
// References:
//   - MDN <section>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section

withDefaults(
    defineProps<{
        /** Accessible label set on aria-label. Defaults to 'End notes'. */
        label?: string;
    }>(),
    {
        label: "End notes",
    },
);
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
