<script setup lang="ts">

    // MaltaNationalIdentificationNumberInput component
    //
    // A headless input for entering Malta's Malta National Identification Number.
    // Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Malta

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
    <!-- MaltaNationalIdentificationNumberInput.vue -->
    <input
        class="malta-national-identification-number-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
