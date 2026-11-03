<script setup lang="ts">
// SharePage component
//
// A group of controls for sharing the current page. Renders a <div> with the `share-page` hook; it
// adds no role, so pass role="group" through attrs.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
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
//   - No role is rendered; pass role="group" through attrs so the label is announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders role="group"; this Vue component does not (the Svelte one is canonical)
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

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
    <!-- SharePage.vue -->
    <div
        class="share-page"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
