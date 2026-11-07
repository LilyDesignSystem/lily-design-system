<script setup lang="ts">
// AustraliaIndividualHealthcareIdentifierInput component
//
// A headless input for entering Australia's Individual Healthcare Identifier (IHI).
// Format: 16 digits assigned by the Healthcare Identifiers Service.
//
// References:
//   - https://en.wikipedia.org/wiki/My_Health_Record

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
    "AustraliaIndividualHealthcareIdentifierInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- AustraliaIndividualHealthcareIdentifierInput.vue -->
    <input
        class="australia-individual-healthcare-identifier-input"
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
