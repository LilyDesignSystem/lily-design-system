<script setup lang="ts">

    // Pictogram component
    //
    // An icon-based component pairing an icon with a title and description in a
    // centered or side layout. Renders <figure> with an aria-hidden icon
    // wrapper, then <figcaption> containing optional heading and description.
    //
    // Props:
    //   layout       — "centered" | "side", default "centered".
    //   heading      — string, optional. Title text.
    //   description  — string, optional. Body text.
    //   label        — string, optional. aria-label override.
    //   icon slot    — REQUIRED. Icon/illustration content.
    //   default slot — additional content (overrides description if provided).
    //
    // Syntax:
    //   <Pictogram heading="Fast" description="Lightning quick">
    //     <template #icon><svg>...</svg></template>
    //   </Pictogram>
    //
    // Accessibility:
    //   - <figure> semantics
    //   - Icon wrapper is aria-hidden (decorative)
    //   - Accessible name comes from heading (figcaption) or aria-label override
    //
    // Internationalization:
    //   - All text via props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - icon slot is required
    //   - Inspired by Mozilla Protocol Design System

    import { useSlots } from "vue";

    withDefaults(defineProps<{
        /** Layout variant. */
        layout?: "centered" | "side";
        /** Title text. */
        heading?: string;
        /** Body text. */
        description?: string;
        /** aria-label override. */
        label?: string;
    }>(), {
        layout: "centered",
        heading: undefined,
        description: undefined,
        label: undefined,
    });

    const slots = useSlots();

</script>

<template>
    <!-- Pictogram.vue -->
    <figure
        class="pictogram"
        :data-layout="layout"
        :aria-label="label"
    >
        <div class="pictogram-icon" aria-hidden="true">
            <slot name="icon" />
        </div>
        <figcaption class="pictogram-caption">
            <h3 v-if="heading" class="pictogram-heading">{{ heading }}</h3>
            <slot v-if="slots.default" />
            <p v-else-if="description" class="pictogram-description">{{ description }}</p>
        </figcaption>
    </figure>
</template>
