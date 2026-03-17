<script setup lang="ts">

    // NorthernIrelandHealthAndCareNumberView component

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- NorthernIrelandHealthAndCareNumberView.vue -->
    <span
        class="northern-ireland-health-and-care-number-view"
        :aria-label="label"
    >{{ value }}</span>
</template>
