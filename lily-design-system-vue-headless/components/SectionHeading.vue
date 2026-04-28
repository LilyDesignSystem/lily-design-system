<script setup lang="ts">

    // SectionHeading component
    //
    // A styled heading introducing a major content section, with optional eyebrow
    // text above and subtitle text below. Renders <header> with optional eyebrow
    // paragraph, the heading element (configurable level h2-h6), and optional
    // subtitle paragraph.
    //
    // Props:
    //   heading  — string, REQUIRED. Main heading text.
    //   eyebrow  — string, optional. Eyebrow text above heading.
    //   subtitle — string, optional. Subtitle below heading.
    //   level    — 2 | 3 | 4 | 5 | 6, default 2.
    //
    // Syntax:
    //   <SectionHeading eyebrow="Section" heading="Get started" subtitle="It's easy" />
    //
    // Accessibility:
    //   - Implicit <header> semantics
    //   - Heading element provides hierarchical semantics
    //
    // Internationalization:
    //   - All text via props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - heading is REQUIRED
    //   - Inspired by Mozilla Protocol Design System

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** Main heading text (REQUIRED). */
        heading: string;
        /** Eyebrow text rendered above the heading. */
        eyebrow?: string;
        /** Subtitle text rendered below the heading. */
        subtitle?: string;
        /** Heading level (2-6). */
        level?: 2 | 3 | 4 | 5 | 6;
    }>(), {
        eyebrow: undefined,
        subtitle: undefined,
        level: 2,
    });

    const headingTag = computed(() => `h${props.level}`);

</script>

<template>
    <!-- SectionHeading.vue -->
    <header class="section-heading">
        <p v-if="eyebrow" class="section-heading-eyebrow">{{ eyebrow }}</p>
        <component :is="headingTag" class="section-heading-heading">{{ heading }}</component>
        <p v-if="subtitle" class="section-heading-subtitle">{{ subtitle }}</p>
    </header>
</template>
