<script setup lang="ts">

    // PolskaPeselView component
    //
    // A headless display for Poland's PESEL.
    // Format: 11 numeric digits; assigned shortly after birth and unchanged for life.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/PESEL

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- PolskaPeselView.vue -->
    <span
        class="polska-pesel-view"
        :aria-label="label">{{ value }}</span
    >
</template>
