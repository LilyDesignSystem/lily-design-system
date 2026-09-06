<script setup lang="ts">

    // TuaisceartEireannHealthAndCareNumberView component

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- TuaisceartEireannHealthAndCareNumberView.vue -->
    <span
        class="tuaisceart-eireann-health-and-care-number-view"
        :aria-label="label"
    >{{ value }}</span>
</template>
