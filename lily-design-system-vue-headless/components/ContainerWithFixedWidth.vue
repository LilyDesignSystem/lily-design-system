<script setup lang="ts">

    // ContainerWithFixedWidth component
    //
    // A headless centered content wrapper that constrains its content to a
    // configurable max-width and centers it horizontally within its parent.
    // Useful for page-level content columns, articles, dashboards, and any
    // layout that should not stretch to the full viewport width.
    //
    // Props:
    //   maxWidth — string, default "1200px". CSS max-width value.
    //   default slot. Content to center within the constrained width.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ContainerWithFixedWidth max-width="960px">content</ContainerWithFixedWidth>
    //
    // Examples:
    //   <!-- Default 1200px max-width -->
    //   <ContainerWithFixedWidth>
    //     <p>Page content</p>
    //   </ContainerWithFixedWidth>
    //
    //   <!-- Article width -->
    //   <ContainerWithFixedWidth max-width="65ch">
    //     <article>...</article>
    //   </ContainerWithFixedWidth>
    //
    // Keyboard: None — passive layout container.
    //
    // Accessibility:
    //   - No ARIA role; transparent layout container
    //   - data-max-width attribute exposed for consumer CSS hooks
    //
    // Internationalization:
    //   - No user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS beyond inline max-width and margin-inline: auto
    //   - Centering is the documented behavior, so margin-inline: auto is allowed
    //
    // References:
    //   - CSS max-width: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width

    withDefaults(defineProps<{
        /** CSS max-width value. */
        maxWidth?: string;
    }>(), {
        maxWidth: "1200px",
    });

</script>

<template>
    <!-- ContainerWithFixedWidth.vue -->
    <div
        class="container-with-fixed-width"
        :data-max-width="maxWidth"
        :style="{ maxWidth: maxWidth, marginInline: 'auto' }"
    >
        <slot />
    </div>
</template>
