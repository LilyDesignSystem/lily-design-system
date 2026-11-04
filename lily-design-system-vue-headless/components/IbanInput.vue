<script setup lang="ts">
// IbanInput component
//
// A headless input for entering an International Bank Account Number (IBAN).
// Format: Up to 34 letters and digits: a two-letter country code, two check digits, then the national account number.
//
// References:
//   - https://en.wikipedia.org/wiki/International_Bank_Account_Number

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
    <!-- IbanInput.vue -->
    <input
        class="iban-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
