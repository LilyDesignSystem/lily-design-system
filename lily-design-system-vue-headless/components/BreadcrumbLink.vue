<script setup lang="ts">

    // BreadcrumbLink component
    //
    // One breadcrumb link in the trail. Renders as a semantic <a> element with
    // optional aria-label override for descriptive screen reader text.
    //
    // Props:
    //   href  — string, required. The URL to navigate to.
    //   label — string, optional. Accessible label override via aria-label.
    //   default slot — link content.
    //
    // Accessibility:
    //   - Implicit link role from the <a> element
    //   - aria-label provides a screen-reader override when the visible text is brief
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Always require href; do not render <a> without href
    //
    // References:
    //   - HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

    withDefaults(defineProps<{
        /** The URL to navigate to. */
        href: string;
        /** Accessible label override for screen readers. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- BreadcrumbLink.vue -->
    <a
        class="breadcrumb-link"
        :href="href"
        :aria-label="label"
    >
        <slot />
    </a>
</template>
