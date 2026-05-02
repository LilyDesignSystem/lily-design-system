<script setup lang="ts">

    // Headline component
    //
    // A page or article headline composition: a heading at a configurable
    // level (default <h1>), with optional `subtitle` and `byline` named
    // slots rendered below it.
    //
    // Props:
    //   level — 1..6, default 1. Heading level.
    //
    // Slots:
    //   default  — heading text.
    //   subtitle — subtitle / dek content.
    //   byline   — byline area.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import { useSlots } from "vue";
    const slots = useSlots();

    withDefaults(defineProps<{
        /** Heading level 1-6. */
        level?: 1 | 2 | 3 | 4 | 5 | 6;
    }>(), {
        level: 1,
    });

</script>

<template>
    <!-- Headline.vue -->
    <div class="headline">
        <component :is="`h${level}`" class="headline-heading">
            <slot />
        </component>
        <div v-if="slots.subtitle" class="headline-subtitle">
            <slot name="subtitle" />
        </div>
        <div v-if="slots.byline" class="headline-byline">
            <slot name="byline" />
        </div>
    </div>
</template>
