<script setup lang="ts">
// TuaisceartEireannHealthAndCareNumberView component

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
    <!-- TuaisceartEireannHealthAndCareNumberView.vue -->
    <span class="tuaisceart-eireann-health-and-care-number-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
