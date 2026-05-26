<script setup lang="ts">

    // AustraliaIndividualHealthcareIdentifierInput component
    //
    // A headless input for entering Australia's Individual Healthcare Identifier (IHI).
    // Format: 16 digits assigned by the Healthcare Identifiers Service.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/My_Health_Record

    withDefaults(defineProps<{
        label: string;
        required?: boolean;
        disabled?: boolean;
    }>(), {
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

</script>

<template>
    <!-- AustraliaIndividualHealthcareIdentifierInput.vue -->
    <input
        class="australia-individual-healthcare-identifier-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
