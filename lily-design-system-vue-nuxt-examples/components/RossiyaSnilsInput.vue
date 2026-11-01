<script setup lang="ts">
// RossiyaSnilsInput component
//
// A headless input for entering Russia's SNILS (Individual Insurance Account Number).
// Format: 11 digits as NNN-NNN-NNN CC: a 9-digit account number followed by a Modulus-101 weighted check value.
//
// References:
//   - https://en.wikipedia.org/wiki/SNILS_(Russia)

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        label: string;
        required?: boolean;
        disabled?: boolean;
    }>(),
    {
        required: false,
        disabled: false,
    },
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- RossiyaSnilsInput.vue -->
    <input
        class="rossiya-snils-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
