<script setup lang="ts">

    // AustraliaIndividualHealthcareIdentifierView component
    //
    // A headless display for Australia's Individual Healthcare Identifier (IHI).
    // Format: 16 digits assigned by the Healthcare Identifiers Service.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/My_Health_Record

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- AustraliaIndividualHealthcareIdentifierView.vue -->
    <span
        class="australia-individual-healthcare-identifier-view"
        :aria-label="label">{{ value }}</span
    >
</template>
