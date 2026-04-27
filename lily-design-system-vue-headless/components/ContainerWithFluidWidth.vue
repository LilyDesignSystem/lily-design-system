<script setup lang="ts">

    // ContainerWithFluidWidth component
    //
    // A headless full-width content wrapper that applies horizontal padding so
    // content doesn't touch the viewport edges. Useful for full-bleed sections,
    // page headers, footers, or any container that should span the entire
    // viewport width while keeping its content readable.
    //
    // Props:
    //   paddingInline — string, default "1rem". Horizontal padding CSS value.
    //   default slot. Content to render inside the fluid container.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ContainerWithFluidWidth padding-inline="2rem">content</ContainerWithFluidWidth>
    //
    // Examples:
    //   <!-- Default 1rem inline padding -->
    //   <ContainerWithFluidWidth>
    //     <p>Edge-to-edge content</p>
    //   </ContainerWithFluidWidth>
    //
    //   <!-- Larger horizontal gutter -->
    //   <ContainerWithFluidWidth padding-inline="clamp(1rem, 5vw, 4rem)">
    //     <header>...</header>
    //   </ContainerWithFluidWidth>
    //
    // Keyboard: None — passive layout container.
    //
    // Accessibility:
    //   - No ARIA role; transparent layout container
    //   - data-padding-inline attribute exposed for consumer CSS hooks
    //
    // Internationalization:
    //   - No user-facing strings
    //
    // Claude rules:
    //   - Headless: inline width and padding-inline implement the documented behavior
    //
    // References:
    //   - CSS padding-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline

    withDefaults(defineProps<{
        /** Horizontal padding CSS value. */
        paddingInline?: string;
    }>(), {
        paddingInline: "1rem",
    });

</script>

<template>
    <!-- ContainerWithFluidWidth.vue -->
    <div
        class="container-with-fluid-width"
        :data-padding-inline="paddingInline"
        :style="{ width: '100%', paddingInline: paddingInline }"
    >
        <slot />
    </div>
</template>
