<script setup lang="ts">
// TurkiyeTcKimlikNumarasiInput component
//
// A headless input for entering Turkey's T.C. Kimlik Numarasi.
// Format: 11 digits, the first never zero: the 10th digit is derived from weighted odd/even digit sums, the 11th is the (always even) sum of the first ten digits.
//
// References:
//   - https://en.wikipedia.org/wiki/Turkish_Identification_Number

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
    <!-- TurkiyeTcKimlikNumarasiInput.vue -->
    <input
        class="turkiye-tc-kimlik-numarasi-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
