<script setup lang="ts">
// IslandKennitalaInput component
//
// A headless input for entering Iceland's Kennitala.
// Format: 10 digits where the first 6 are the date of birth (DDMMYY).
//
// References:
//   - https://en.wikipedia.org/wiki/Kennitala

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
    <!-- IslandKennitalaInput.vue -->
    <input
        class="island-kennitala-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
