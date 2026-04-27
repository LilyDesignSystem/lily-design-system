<script setup lang="ts">

    // Grid component
    //
    // A headless CSS Grid layout container with a configurable column count or
    // arbitrary grid-template-columns string and a configurable gap. Equal-width
    // columns use `repeat(N, minmax(0, 1fr))`; arbitrary string values are passed
    // through unchanged. Useful for dashboards, image galleries, and cards.
    //
    // Props:
    //   columns — number | string, default 12. When a number, generates equal
    //             columns; when a string, used as grid-template-columns directly.
    //   gap     — string, default "1rem".
    //   default slot. Grid items.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Grid :columns="3" gap="1rem">…</Grid>
    //   <Grid columns="repeat(auto-fit, minmax(200px, 1fr))">…</Grid>
    //
    // Examples:
    //   <!-- 3 equal columns -->
    //   <Grid :columns="3">
    //     <div>A</div>
    //     <div>B</div>
    //     <div>C</div>
    //   </Grid>
    //
    //   <!-- Custom template -->
    //   <Grid columns="repeat(auto-fit, minmax(200px, 1fr))">
    //     <article>...</article>
    //   </Grid>
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
    //   - Headless: inline grid styles implement the documented behavior
    //
    // References:
    //   - MDN CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** Number of columns or custom template string. */
        columns?: number | string;
        /** Gap CSS value. */
        gap?: string;
    }>(), {
        columns: 12,
        gap: "1rem",
    });

    const gridTemplateColumns = computed(() => {
        if (typeof props.columns === "number") {
            return `repeat(${props.columns}, minmax(0, 1fr))`;
        }
        return props.columns;
    });

</script>

<template>
    <!-- Grid.vue -->
    <div
        class="grid"
        :data-columns="columns"
        :style="{
            display: 'grid',
            gridTemplateColumns: gridTemplateColumns,
            gap: gap,
        }"
    >
        <slot />
    </div>
</template>
