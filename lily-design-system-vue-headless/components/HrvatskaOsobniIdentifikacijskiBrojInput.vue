<script setup lang="ts">
// HrvatskaOsobniIdentifikacijskiBrojInput component
//
// A headless input for entering Croatia's Osobni identifikacijski broj (OIB).
// Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

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
    "HrvatskaOsobniIdentifikacijskiBrojInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- HrvatskaOsobniIdentifikacijskiBrojInput.vue -->
    <input
        class="hrvatska-osobni-identifikacijski-broj-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
