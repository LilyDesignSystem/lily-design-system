<script setup lang="ts">
    // ProgressBar component
    // A horizontal progress indicator.

    withDefaults(defineProps<{
    label: string;
    value: number;
    min?: number;
    max?: number;
}>(), { min: 0, max: 100 });
</script>

<template>
    <!-- ProgressBar.vue -->
    <div
        class="progress-bar"
        role="progressbar"
        :aria-valuenow="value"
        :aria-valuemin="min ?? 0"
        :aria-valuemax="max ?? 100"
        :aria-label="label"
    ></div>
</template>
