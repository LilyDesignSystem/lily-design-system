<script setup lang="ts">

    // ClampText component
    //
    // A headless text container that visually truncates content to a maximum
    // number of lines while keeping the full text in the DOM for accessibility.
    // Sets a data-lines attribute and a CSS custom property --clamp-text-lines
    // so consumers can apply -webkit-line-clamp or modern line-clamp styling.
    // Useful for descriptions, summaries, and previews that must fit a fixed
    // visual height.
    //
    // Props:
    //   lines — number, default 2. Maximum number of visible lines.
    //   label — string, optional. aria-label for screen readers.
    //   default slot. Text content to clamp.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ClampText :lines="3">Long content...</ClampText>
    //
    // Examples:
    //   <!-- Two-line clamp -->
    //   <ClampText :lines="2">{{ summary }}</ClampText>
    //
    //   <!-- Three-line clamp with explicit accessible label -->
    //   <ClampText :lines="3" label="Article summary">{{ body }}</ClampText>
    //
    // Keyboard: None — this is a passive text container.
    //
    // Accessibility:
    //   - Full text remains in the DOM and is read by screen readers
    //   - Visual truncation is purely a consumer-CSS concern
    //   - aria-label may be supplied to provide a more descriptive name
    //
    // Internationalization:
    //   - Text content comes through the default slot; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles beyond the inline --clamp-text-lines variable
    //   - Do not set overflow: hidden — the consumer controls clipping
    //
    // References:
    //   - CSS line-clamp: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp

    withDefaults(defineProps<{
        /** Maximum number of visible lines. */
        lines?: number;
        /** aria-label for screen readers. */
        label?: string;
    }>(), {
        lines: 2,
        label: undefined,
    });

</script>

<template>
    <!-- ClampText.vue -->
    <div
        class="clamp-text"
        :data-lines="lines"
        :style="{ '--clamp-text-lines': lines }"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
