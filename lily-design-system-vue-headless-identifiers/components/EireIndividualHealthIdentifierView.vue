<script setup lang="ts">
// EireIndividualHealthIdentifierView component

withDefaults(
    defineProps<{
        label?: string;
        value?: string;
    }>(),
    {
        value: "",
    },
);
</script>

<template>
    <!-- EireIndividualHealthIdentifierView.vue -->
    <span class="eire-individual-health-identifier-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
