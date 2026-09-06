<script setup lang="ts">

    // EireIndividualHealthIdentifierView component

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- EireIndividualHealthIdentifierView.vue -->
    <span
        class="eire-individual-health-identifier-view"
        :aria-label="label"
    >{{ value }}</span>
</template>
