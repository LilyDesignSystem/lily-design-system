<script setup lang="ts">
// MeasurementUnitInput component
//
// A headless text input for entering a measurement unit, such as "kg", "lb",
// "cm", "inch", "F", or "C". A measurement unit is a standard quantity used
// to express a physical measurement. The component renders an <input type="text">
// with aria-label for accessible naming and a bindable value for reactive form
// integration.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — string, default "". Bindable measurement unit value via defineModel().
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <MeasurementUnitInput label="Unit" v-model />
//
// Examples:
//   <!-- Basic unit input -->
//   <MeasurementUnitInput label="Unit" v-model />
//
//   <!-- Required unit input -->
//   <MeasurementUnitInput label="Unit of measure" v-model required />
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
//   - Part of the Input/View pattern; pairs with MeasurementUnitView
//
// References:
//   - HTML input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        /** Accessible name for the measurement unit input */
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
    <!-- MeasurementUnitInput.vue -->
    <input
        class="measurement-unit-input"
        type="text"
        :aria-label="label"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
