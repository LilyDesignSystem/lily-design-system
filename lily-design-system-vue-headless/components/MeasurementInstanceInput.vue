<script setup lang="ts">
// MeasurementInstanceInput component
//
// A headless text input for entering a specific measurement instance value,
// such as "72 kg", "98.6 F", or "120/80 mmHg". A measurement instance is an
// individual recorded measurement combining a numeric value with its unit.
// The component renders an <input type="text"> with aria-label for accessible
// naming and a bindable value for reactive form integration.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — string, default "". Bindable measurement instance value via defineModel().
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <MeasurementInstanceInput label="Weight" v-model />
//
// Examples:
//   <!-- Basic measurement input -->
//   <MeasurementInstanceInput label="Weight" v-model />
//
//   <!-- Required temperature input -->
//   <MeasurementInstanceInput label="Temperature" v-model required />
//
// Keyboard:
//   - Native <input type="text"> keyboard behavior (typing, selection, clipboard-copy-button).
//
// Accessibility:
//   - aria-label provides the accessible name from the label prop
//   - Supports required and disabled HTML states
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Part of the Input/View pattern; pairs with MeasurementInstanceView
//
// References:
//   - HTML input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        /** Accessible name for the measurement instance input */
        label: string;
        /** Whether the input is required */
        required?: boolean;
        /** Whether the input is disabled */
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
    <!-- MeasurementInstanceInput.vue -->
    <input
        class="measurement-instance-input"
        type="text"
        :aria-label="label"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
