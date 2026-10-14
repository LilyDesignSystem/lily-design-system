<script setup lang="ts">

    // ContentsLink component
    //
    // One table of contents link. Renders as a semantic <a> element with
    // optional aria-label override for descriptive screen reader text.
    //
    // Props:
    //   href  — string, required. The URL to navigate to.
    //   label — string, optional. Accessible label override via aria-label.
    //   default slot — link content.
    //
    // Accessibility:
    //   - Implicit link role from the <a> element
    //   - aria-label provides a screen-reader override when the visible text is brief
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Always require href; do not render <a> without href
    //
    // References:
    //   - HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

    withDefaults(defineProps<{
        /** The URL to navigate to. */
        href: string;
        /** Accessible label override for screen readers. */
        label?: string;
        /** Sets data-count on the link (and data-complete when 0). */
        count?: number;
        /** Visible, localised count text (e.g. "3 to do"), rendered inside the link after the text. */
        countLabel?: string;
    }>(), {
        label: undefined,
        count: undefined,
        countLabel: undefined,
    });

</script>

<template>
    <!-- ContentsLink.vue -->
    <a
        class="contents-link"
        :href="href"
        :aria-label="label"
        :data-count="count"
        :data-complete="count === 0 ? '' : undefined"
    >
        <slot />
        <span v-if="countLabel" class="contents-link-count">{{ countLabel }}</span>
    </a>
</template>
