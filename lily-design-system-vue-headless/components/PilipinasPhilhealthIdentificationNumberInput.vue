<script setup lang="ts">

    // PilipinasPhilhealthIdentificationNumberInput component
    //
    // A headless input for entering the Philippines' PhilHealth Identification Number (PIN).
    // Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/PhilHealth

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
    <!-- PilipinasPhilhealthIdentificationNumberInput.vue -->
    <input
        class="pilipinas-philhealth-identification-number-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
