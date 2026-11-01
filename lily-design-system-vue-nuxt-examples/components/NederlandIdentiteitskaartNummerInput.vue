<script setup lang="ts">
// NederlandIdentiteitskaartNummerInput component
//
// A headless input for entering Netherlands's Identiteitskaart Nummer.
// Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.
//
// References:
//   - https://en.wikipedia.org/wiki/Dutch_identity_card

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
    <!-- NederlandIdentiteitskaartNummerInput.vue -->
    <input
        class="nederland-identiteitskaart-nummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
