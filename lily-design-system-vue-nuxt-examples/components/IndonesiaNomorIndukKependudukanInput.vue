<script setup lang="ts">
// IndonesiaNomorIndukKependudukanInput component
//
// A headless input for entering Indonesia's Nomor Induk Kependudukan (NIK).
// Format: 16 digits as PPKKCC-DDMMYY-NNNN: province/regency/sub-district code, date of birth (day +40 for a female holder), and a 4-digit sequence number. No published check digit.
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number

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
    "IndonesiaNomorIndukKependudukanInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- IndonesiaNomorIndukKependudukanInput.vue -->
    <input
        class="indonesia-nomor-induk-kependudukan-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
