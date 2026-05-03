<script setup lang="ts">

    // FeatureCard component
    //
    // A large content card with a prominent image positioned alongside or above
    // the text. Renders as <article> with optional <img>, <header>/<h3>, optional
    // description paragraph, then any additional slot content (e.g., CTAs).
    //
    // Props:
    //   heading        — string, REQUIRED. Card heading.
    //   imagePosition  — "start" | "end" | "top", default "start".
    //   imageUrl       — string, optional.
    //   imageAlt       — string, optional.
    //   description    — string, optional. Body text.
    //   label          — string, optional. aria-label override (defaults to heading).
    //   default slot   — additional content (e.g., CTAs).
    //
    // Syntax:
    //   <FeatureCard heading="Privacy first" image-url="/p.png" image-alt="">
    //     <a href="/privacy">Read more</a>
    //   </FeatureCard>
    //
    // Accessibility:
    //   - <article> landmark with aria-label
    //
    // Internationalization:
    //   - All text via props/slots
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - heading is REQUIRED — non-optional in the interface
    //   - Inspired by Mozilla Protocol Design System

    withDefaults(defineProps<{
        /** Card heading (REQUIRED). */
        heading: string;
        /** Image position relative to text. */
        imagePosition?: "start" | "end" | "top";
        /** Image URL. */
        imageUrl?: string;
        /** Image alt text. */
        imageAlt?: string;
        /** Body text. */
        description?: string;
        /** aria-label override (defaults to heading). */
        label?: string;
    }>(), {
        imagePosition: "start",
        imageUrl: undefined,
        imageAlt: undefined,
        description: undefined,
        label: undefined,
    });

</script>

<template>
    <!-- FeatureCard.vue -->
    <article
        class="feature-card"
        :data-image-position="imagePosition"
        :aria-label="label || heading"
    >
        <img
            v-if="imageUrl"
            class="feature-card-image"
            :src="imageUrl"
            :alt="imageAlt ?? ''"
        >
        <header class="feature-card-header">
            <h3 class="feature-card-heading">{{ heading }}</h3>
        </header>
        <p v-if="description" class="feature-card-description">{{ description }}</p>
        <slot />
    </article>
</template>
