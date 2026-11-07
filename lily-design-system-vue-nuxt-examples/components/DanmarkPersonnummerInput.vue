<script setup lang="ts">
// DanmarkPersonnummerInput component
//
// A headless input for entering Denmark's Personnummer (CPR-nummer) (CPR).
// Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY).
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)

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
    "DanmarkPersonnummerInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- DanmarkPersonnummerInput.vue -->
    <input
        class="danmark-personnummer-input"
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
