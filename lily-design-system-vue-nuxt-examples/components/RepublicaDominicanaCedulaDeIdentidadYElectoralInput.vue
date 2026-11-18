<script setup lang="ts">
// RepublicaDominicanaCedulaDeIdentidadYElectoralInput component
//
// A headless input for entering the Dominican Republic's Cédula de Identidad y Electoral.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)

import { ref, useAttrs } from "vue";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
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

warnMissingName(
    "RepublicaDominicanaCedulaDeIdentidadYElectoralInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- RepublicaDominicanaCedulaDeIdentidadYElectoralInput.vue -->
    <input
        class="republica-dominicana-cedula-de-identidad-y-electoral-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        spellcheck="false"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
