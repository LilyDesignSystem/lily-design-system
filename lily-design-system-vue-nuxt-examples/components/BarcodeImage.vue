<script setup lang="ts">

    // BarcodeImage component
    //
    // A barcode-image image rendered as a plain <img> element. The consumer supplies the
    // pre-rendered barcode-image (PNG, SVG data URL, library output, etc.) via the src prop
    // and a descriptive alt text. The component owns only markup and accessibility —
    // no barcode-image generation logic is included.
    //
    // Props:
    //   src — string, required. The image source URL for the barcode-image.
    //   alt — string, required. Alternative text describing the barcode-image for screen readers.
    //   loading — "lazy" | "eager", default undefined. Controls native browser loading behavior.
    //   ...attrs — additional HTML attributes spread onto the <img> via v-bind="$attrs".
    //
    // Accessibility:
    //   - alt attribute provides the accessible name for the barcode-image (required)
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - alt prop is required to enforce accessibility

    withDefaults(defineProps<{
        src: string;
        alt: string;
        loading?: "lazy" | "eager";
    }>(), {
        loading: undefined,
    });

</script>

<template>
    <!-- BarcodeImage.vue -->
    <img
        class="barcode-image"
        :src="src"
        :alt="alt"
        :loading="loading"
        v-bind="$attrs"
    />
</template>
