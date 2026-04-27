<script setup lang="ts">

    // Watermark component
    //
    // A decorative repeating overlay text or image marking a page. The
    // component is structural: it renders a wrapper with `data-rotate` and
    // `data-gap` attributes plus an inner overlay with `aria-hidden="true"`
    // and `data-text` / `data-image-url`. Consumers are responsible for the
    // actual repeating-pattern CSS.
    //
    // Props:
    //   text     — string, optional. Watermark text.
    //   imageUrl — string, optional. Watermark image URL (alternative to text).
    //   gap      — string, default "100px". Spacing between repeats (CSS length).
    //   rotate   — number (deg), default -22. Rotation angle.
    //   default slot — content beneath the watermark.
    //
    // Syntax:
    //   <Watermark text="CONFIDENTIAL">
    //     <article>…</article>
    //   </Watermark>
    //
    // Accessibility:
    //   - The decorative overlay sets aria-hidden="true" so it's ignored by
    //     assistive tech.
    //
    // Internationalization:
    //   - All text content is consumer-supplied.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles. Watermark exposes only data-* hooks.
    //
    // References:
    //   - Ant Design Watermark: https://ant.design/components/watermark

    withDefaults(defineProps<{
        /** Watermark text. */
        text?: string;
        /** Watermark image URL (alternative to text). */
        imageUrl?: string;
        /** Spacing between repeats. */
        gap?: string;
        /** Rotation angle (deg). */
        rotate?: number;
    }>(), {
        text: undefined,
        imageUrl: undefined,
        gap: "100px",
        rotate: -22,
    });

</script>

<template>
    <!-- Watermark.vue -->
    <div
        class="watermark"
        :data-rotate="rotate"
        :data-gap="gap"
    >
        <div
            class="watermark-overlay"
            aria-hidden="true"
            :data-text="text"
            :data-image-url="imageUrl"
        />
        <slot />
    </div>
</template>
