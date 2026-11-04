<script setup lang="ts">
// NorgeFodselsnummerInput component
//
// A headless input for entering Norway's Fødselsnummer.
// Format: 11 digits where the first 6 represent the date of birth (DDMMYY).
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Norway

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
    "NorgeFodselsnummerInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- NorgeFodselsnummerInput.vue -->
    <input
        class="norge-fodselsnummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
