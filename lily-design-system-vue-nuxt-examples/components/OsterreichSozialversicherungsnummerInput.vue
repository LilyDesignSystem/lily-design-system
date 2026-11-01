<script setup lang="ts">
// OsterreichSozialversicherungsnummerInput component
//
// A headless input for entering Austria's Sozialversicherungsnummer (SVNR).
// Format: 10 digits as NNNN DDMMYY: a 3-digit serial number, a Modulus-11 check digit, then date of birth (DDMMYY).
//
// References:
//   - https://de.wikipedia.org/wiki/Sozialversicherungsnummer

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
    <!-- OsterreichSozialversicherungsnummerInput.vue -->
    <input
        class="osterreich-sozialversicherungsnummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
