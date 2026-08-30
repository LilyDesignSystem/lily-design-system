<script setup lang="ts">

    // PortugalPassaporteView component
    //
    // A headless display for Portugal's Passaporte.
    // Format: 1 letter [A-Z] and 6 digits [0-9].
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Portuguese_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- PortugalPassaporteView.vue -->
    <span
        class="portugal-passaporte-view"
        :aria-label="label">{{ value }}</span
    >
</template>
