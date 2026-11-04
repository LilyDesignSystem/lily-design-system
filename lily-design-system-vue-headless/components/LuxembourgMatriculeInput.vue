<script setup lang="ts">
// LuxembourgMatriculeInput component
//
// A headless input for entering Luxembourg's Numero d'Identification Nationale (Matricule).
// Format: 13 digits as YYYYMMDDNNNCC: date of birth, a 3-digit sequence number, a Luhn check digit, and a Verhoeff check digit.
//
// References:
//   - https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html

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
    "LuxembourgMatriculeInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- LuxembourgMatriculeInput.vue -->
    <input
        class="luxembourg-matricule-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
