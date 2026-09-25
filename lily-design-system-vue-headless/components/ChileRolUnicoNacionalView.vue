<script setup lang="ts">

    // ChileRolUnicoNacionalView component
    //
    // A headless display for Chile's Rol Unico Nacional (RUN).
    // Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/RUT

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- ChileRolUnicoNacionalView.vue -->
    <span
        class="chile-rol-unico-nacional-view"
        :aria-label="label">{{ value }}</span
    >
</template>
