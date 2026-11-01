<script setup lang="ts">
// RomaniaPasaportInput component
//
// A headless input for entering Romania's Paşaport.
// Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].
//
// References:
//   - https://en.wikipedia.org/wiki/Romanian_passport

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
    <!-- RomaniaPasaportInput.vue -->
    <input
        class="romania-pasaport-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
