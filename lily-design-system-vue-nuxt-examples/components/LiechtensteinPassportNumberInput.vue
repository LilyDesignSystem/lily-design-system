<script setup lang="ts">
// LiechtensteinPassportNumberInput component
//
// A headless input for entering Liechtenstein's Liechtenstein Passport Number.
// Format: 1 letter followed by 5 digits (e.g. R00536).
//
// References:
//   - https://en.wikipedia.org/wiki/Liechtenstein_passport

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
    <!-- LiechtensteinPassportNumberInput.vue -->
    <input
        class="liechtenstein-passport-number-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
