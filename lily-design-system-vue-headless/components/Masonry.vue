<script setup lang="ts">

    // Masonry component
    //
    // A headless masonry layout container that arranges variable-height children
    // into balanced columns using the CSS Multi-column Layout module
    // (`column-count` + `column-gap`). Children should set
    // `break-inside: avoid` via consumer CSS so individual items aren't split
    // across columns. Useful for image galleries, Pinterest-style cards, and
    // mixed-content boards.
    //
    // Props:
    //   columns — number, default 3.
    //   gap     — string, default "1rem".
    //   default slot. Items to lay out.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Masonry :columns="3" gap="1rem">…</Masonry>
    //
    // Examples:
    //   <!-- 3-column gallery -->
    //   <Masonry :columns="3">
    //     <img src="..." />
    //     <img src="..." />
    //   </Masonry>
    //
    //   <!-- Tighter gap, 4 columns -->
    //   <Masonry :columns="4" gap="0.5rem">
    //     <article>...</article>
    //   </Masonry>
    //
    // Keyboard: None — passive layout container.
    //
    // Accessibility:
    //   - No ARIA role; transparent layout container
    //   - data-columns exposed for CSS hooks
    //
    // Internationalization:
    //   - No user-facing strings
    //
    // Claude rules:
    //   - Headless: inline column-count and column-gap implement the documented behavior
    //
    // References:
    //   - MDN CSS Multi-column Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_multicol_layout

    withDefaults(defineProps<{
        /** Number of columns. */
        columns?: number;
        /** Gap CSS value. */
        gap?: string;
    }>(), {
        columns: 3,
        gap: "1rem",
    });

</script>

<template>
    <!-- Masonry.vue -->
    <div
        class="masonry"
        :data-columns="columns"
        :style="{ columnCount: columns, columnGap: gap }"
    >
        <slot />
    </div>
</template>
