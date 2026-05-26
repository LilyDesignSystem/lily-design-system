<script setup lang="ts">

    // LietuvaPasasView component
    //
    // A headless display for Lithuania's Pasas.
    // Format: 8-digit passport or identity card number.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Lithuanian_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- LietuvaPasasView.vue -->
    <span
        class="lietuva-pasas-view"
        :aria-label="label">{{ value }}</span
    >
</template>
