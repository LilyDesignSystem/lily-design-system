<script setup lang="ts">

    // SchweizAhvNummerInput component
    //
    // A headless input for entering Switzerland's AHV-Nummer / Numéro AVS.
    // Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Data_codes_for_Switzerland

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
    <!-- SchweizAhvNummerInput.vue -->
    <input
        class="schweiz-ahv-nummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
