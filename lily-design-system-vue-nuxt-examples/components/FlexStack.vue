<script setup lang="ts">

    // FlexStack component
    //
    // A headless flex layout container for stacking children vertically (column)
    // or horizontally (row) with a consistent gap. Optional align-items and
    // justify-content props expose the most common layout knobs without forcing
    // the consumer to write custom CSS for everyday stack patterns.
    //
    // Props:
    //   direction — "row" | "column", default "column".
    //   gap       — string, default "1rem".
    //   align     — string, optional. align-items value.
    //   justify   — string, optional. justify-content value.
    //   default slot. Children to stack.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <FlexStack direction="row" gap="1rem">…</FlexStack>
    //
    // Examples:
    //   <!-- Column stack with gap -->
    //   <FlexStack gap="0.5rem">
    //     <p>Item 1</p>
    //     <p>Item 2</p>
    //   </FlexStack>
    //
    //   <!-- Row stack centered -->
    //   <FlexStack direction="row" align="center" justify="space-between">
    //     <span>Left</span>
    //     <span>Right</span>
    //   </FlexStack>
    //
    // Keyboard: None — passive layout container.
    //
    // Accessibility:
    //   - No ARIA role; transparent layout container
    //   - data-direction exposed for CSS hooks
    //
    // Internationalization:
    //   - No user-facing strings
    //
    // Claude rules:
    //   - Headless: inline display: flex implements the documented behavior
    //
    // References:
    //   - MDN flexbox guide: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout

    withDefaults(defineProps<{
        /** Flex direction. */
        direction?: "row" | "column";
        /** Gap CSS value. */
        gap?: string;
        /** align-items value. */
        align?: string;
        /** justify-content value. */
        justify?: string;
    }>(), {
        direction: "column",
        gap: "1rem",
        align: undefined,
        justify: undefined,
    });

</script>

<template>
    <!-- FlexStack.vue -->
    <div
        class="flex-stack"
        :data-direction="direction"
        :style="{
            display: 'flex',
            flexDirection: direction,
            gap: gap,
            alignItems: align,
            justifyContent: justify,
        }"
    >
        <slot />
    </div>
</template>
