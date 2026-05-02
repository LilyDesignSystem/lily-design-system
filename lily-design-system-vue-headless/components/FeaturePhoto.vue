<script setup lang="ts">

    // FeaturePhoto component
    //
    // A responsive feature photo with required alt text and optional
    // caption / credit. Renders a <figure> containing an <img> plus a
    // <figcaption> when caption or credit is supplied. Defaults to lazy
    // loading; consumers can override to "eager" for above-the-fold hero
    // images. Width/height are passed through to the <img> so browsers can
    // reserve the slot and avoid CLS.
    //
    // Props:
    //   src     — string, required.
    //   alt     — string, required (use "" for decorative photos).
    //   loading — "lazy" | "eager", default "lazy".
    //   width, height — number, optional. Intrinsic image dimensions.
    //
    // Slots:
    //   caption — caption text.
    //   credit  — photographer / source credit.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import { useSlots } from "vue";
    import { computed } from "vue";
    const slots = useSlots();

    withDefaults(defineProps<{
        /** Image source URL. */
        src: string;
        /** Alt text describing the image (use "" for decorative photos). */
        alt: string;
        /** Image loading strategy. */
        loading?: "lazy" | "eager";
        /** Intrinsic image width. */
        width?: number;
        /** Intrinsic image height. */
        height?: number;
    }>(), {
        loading: "lazy",
    });

    const hasCaption = computed(() => Boolean(slots.caption || slots.credit));

</script>

<template>
    <!-- FeaturePhoto.vue -->
    <figure class="feature-photo">
        <img
            class="feature-photo-image"
            :src="src"
            :alt="alt"
            :loading="loading"
            :width="width"
            :height="height"
        />
        <figcaption v-if="hasCaption" class="feature-photo-caption">
            <span v-if="slots.caption" class="feature-photo-caption-text">
                <slot name="caption" />
            </span>
            <span v-if="slots.credit" class="feature-photo-credit">
                <slot name="credit" />
            </span>
        </figcaption>
    </figure>
</template>
