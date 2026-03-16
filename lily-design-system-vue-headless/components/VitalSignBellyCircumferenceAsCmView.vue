<script setup lang="ts">

    // VitalSignBellyCircumferenceAsCmView component
    //
    // A read-only display of a belly circumference value in centimeters (cm).
    // Companion to VitalSignBellyCircumferenceAsCmInput.
    //
    // Props:
    //   value — number, required. Belly circumference in centimeters.
    //   label — string, required. Accessible description via aria-label.
    //
    // Syntax:
    //   <VitalSignBellyCircumferenceAsCmView :value="90" label="90 cm belly circumference" />
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    defineProps<{
        /** Belly circumference in centimeters. */
        value: number;
        /** Accessible description. */
        label: string;
    }>();

</script>

<template>
    <!-- VitalSignBellyCircumferenceAsCmView.vue -->
    <span
        class="vital-sign-belly-circumference-as-cm-view"
        role="img"
        :aria-label="label"
        :data-value="value"
    >{{ value }}</span>
</template>
