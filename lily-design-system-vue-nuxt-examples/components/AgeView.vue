<script setup lang="ts">
// AgeView: a person's age in the consumer's words, usually from ageParts() (spec/healthcare-ui item 6). Props: AgeView.md.
defineProps<{
    label?: string;
    /** The age as the consumer writes it. */
    value: string;
    /** The same age as an ISO 8601 duration, as data-duration. */
    duration?: string;
}>();
</script>

<template>
    <!-- AgeView.vue -->
    <span
        class="age-view"
        :data-duration="duration"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
