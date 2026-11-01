<script setup lang="ts">
// UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput component
//
// A headless input for entering Ukraine's Taxpayer Registration Card Number (RNOKPP).
// Format: 10 digits: 5 digits encode date of birth as days elapsed since 1 January 1900, 4 digits are a sequence number encoding sex by parity, and the 10th digit is a weighted-sum check digit.
//
// References:
//   - https://en.wikipedia.org/wiki/Taxpayer_Identification_Number

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
    <!-- UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput.vue -->
    <input
        class="ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
