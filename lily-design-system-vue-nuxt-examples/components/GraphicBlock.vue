<script setup lang="ts">

    // GraphicBlock component
    //
    // A wrapper for charts and graphics that pairs the visual (default
    // slot) with structural metadata: title, description, and notes/source
    // string props. Renders a <figure role="img"> with aria-label so the
    // whole graphic announces as a single image, and gathers the metadata
    // inside a <figcaption> when any of them are present.
    //
    // Props:
    //   label       — string, required. Accessible label for the graphic.
    //   title       — string, optional.
    //   description — string, optional.
    //   notes       — string, optional.
    //
    // Slots:
    //   default — the graphic / chart content.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** Accessible label describing the graphic for screen readers. */
        label: string;
        /** Title displayed above the graphic. */
        title?: string;
        /** Description text below the title. */
        description?: string;
        /** Notes / source text below the graphic. */
        notes?: string;
    }>(), {
        title: undefined,
        description: undefined,
        notes: undefined,
    });

    const hasCaption = computed(() =>
        props.title !== undefined ||
        props.description !== undefined ||
        props.notes !== undefined
    );

</script>

<template>
    <!-- GraphicBlock.vue -->
    <figure
        class="graphic-block"
        role="img"
        :aria-label="label"
    >
        <figcaption v-if="hasCaption" class="graphic-block-caption">
            <div v-if="title !== undefined" class="graphic-block-title">{{ title }}</div>
            <div v-if="description !== undefined" class="graphic-block-description">{{ description }}</div>
            <div v-if="notes !== undefined" class="graphic-block-notes">{{ notes }}</div>
        </figcaption>
        <div class="graphic-block-content">
            <slot />
        </div>
    </figure>
</template>
