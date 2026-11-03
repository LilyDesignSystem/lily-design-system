<script setup lang="ts">
// ArticleLayout component
//
// The outer wrapper of an editorial article. Renders an <article> with the `article-layout` hook; the
// column widths its children use are set by the consumer's CSS, not by this component.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The article content (headline, byline, content blocks).
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <article>.
//
// Syntax:
//   <ArticleLayout label="…">…</ArticleLayout>
//
// Examples:
//   <ArticleLayout label="Annual report"><Headline>…</Headline><ContentBlock>…</ContentBlock></ArticleLayout>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - The native <article> element supplies the article role
//   - aria-label comes from `label` when given
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Sets no custom properties and no widths; define column widths in CSS
//
// References:
//   - MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
//   - Reuters Graphics Article (the inspiration): https://github.com/reuters-graphics/graphics-components

withDefaults(
    defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- ArticleLayout.vue -->
    <article
        class="article-layout"
        :aria-label="label"
    >
        <slot />
    </article>
</template>
