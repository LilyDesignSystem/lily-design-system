<script setup lang="ts">
// BelgiqueNumeroDeRegistreNationalInput component
//
// A headless input for entering Belgium's Numéro de Registre National / Rijksregisternummer (NRN).
// Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Belgium

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
    <!-- BelgiqueNumeroDeRegistreNationalInput.vue -->
    <input
        class="belgique-numero-de-registre-national-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
