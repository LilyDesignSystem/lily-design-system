<script setup lang="ts">
// ContentBlock component
//
// A width-constrained column for editorial content. Sets `data-width` to the chosen width token; the
// pixel values behind each token are the consumer's CSS.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   width — "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid", default "normal". Rendered as data-width.
//   default slot — required. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <ContentBlock width="wide">…</ContentBlock>
//
// Examples:
//   <ContentBlock><BodyText><p>Text</p></BodyText></ContentBlock>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role or ARIA: a layout wrapper
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Width is a data attribute, never an inline style; map each token in CSS with `[data-width="wide"]`
//
// References:
//   - Reuters Graphics ContentBlock (the inspiration): https://github.com/reuters-graphics/graphics-components

withDefaults(
    defineProps<{
        /** Content width preset. */
        width?: "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid";
    }>(),
    {
        width: "normal",
    },
);
</script>

<template>
    <!-- ContentBlock.vue -->
    <div
        class="content-block"
        :data-width="width"
    >
        <slot />
    </div>
</template>
