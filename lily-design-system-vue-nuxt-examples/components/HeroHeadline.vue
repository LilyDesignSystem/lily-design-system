<script setup lang="ts">

    // HeroHeadline component
    //
    // HeroHeadline for the Reuters-graphics-style article layout family.
    // Renders a <div> that consumers style.

    defineProps<{
        /** Accessible label set on aria-label. */
        label: string;
    }>();

</script>

<template>
    <!-- HeroHeadline.vue -->
    <div
        class="hero-headline"
        :aria-label="label"
    >
        <slot name="media" />
        <slot />
    </div>
</template>
