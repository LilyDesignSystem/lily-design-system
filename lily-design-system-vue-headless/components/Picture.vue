<script setup lang="ts">

    // Picture component
    //
    // A headless wrapper around the native picture element: the browser chooses among the source
    // children (by media query, image type or resolution) and falls back to the img child.
    // Draws nothing and carries no strings of its own; the consumer supplies the source and img
    // elements, including the img's alt text.

</script>

<template>
    <!-- Picture.vue -->
    <picture
        class="picture"

    >
        <slot />
    </picture>
</template>
