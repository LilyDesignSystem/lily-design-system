<script setup lang="ts">
// EspanaCodigoDeIdentificacionFiscalInput component
//
// A headless input for entering Spain's Código de Identificación Fiscal (CIF).
// Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).
//
// References:
//   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

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
    <!-- EspanaCodigoDeIdentificacionFiscalInput.vue -->
    <input
        class="espana-codigo-de-identificacion-fiscal-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
