<script setup lang="ts">

    // Mark component
    //
    // A headless inline wrapper: an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element. Contract: a plain wrapper with the base class and children.
    // Draws nothing and carries no strings of its own; the consumer supplies the text.

</script>

<template>
    <!-- Mark.vue -->
    <mark
        class="mark"

    >
        <slot />
    </mark>
</template>
