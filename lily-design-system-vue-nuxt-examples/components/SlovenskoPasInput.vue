<script setup lang="ts">
// SlovenskoPasInput component
//
// A headless input for entering Slovakia's Pas.
// Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.
//
// References:
//   - https://en.wikipedia.org/wiki/Slovak_passport

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
    "SlovenskoPasInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- SlovenskoPasInput.vue -->
    <input
        class="slovensko-pas-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
