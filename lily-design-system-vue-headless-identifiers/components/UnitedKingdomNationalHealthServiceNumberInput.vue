<script setup lang="ts">
// UnitedKingdomNationalHealthServiceNumberInput component
//
// A headless input for entering a United Kingdom National Health Service (NHS)
// number. The NHS number is a 10-digit identifier assigned to every patient
// registered with the NHS in England, Wales, and the Isle of Man. The standard
// display format is "XXX XXX XXXX" (three groups separated by spaces). The
// component enforces this pattern, uses a numeric keyboard hint for mobile,
// and disables autocomplete to protect sensitive health information.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". Bindable input value; supports v-model.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" v-model />
//
// Examples:
//   <!-- Required NHS number input -->
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" required />
//
//   <!-- Disabled NHS number input -->
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//   - Users type digits and spaces in the format XXX XXX XXXX
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputmode="numeric" hints mobile devices to show a numeric keyboard
//   - pattern enforces XXX XXX XXXX format on form validation
//   - autocomplete="off" protects sensitive health identifiers
//   - required and disabled states are conveyed to assistive technology
//
// Internationalization:
//   - The label prop externalizes user-facing text for translation
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Pattern is defined as a constant to avoid Vue curly brace parsing
//   - Uses defineModel() for two-way data binding on value
//
// References:
//   - NHS Number format: https://www.nhs.uk/nhs-services/online-services/find-nhs-number/

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        /** Accessible label for screen readers */
        label: string;
        /** Whether the input is required for form submission */
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

const nhsPattern = "[0-9]{3} [0-9]{3} [0-9]{4}";
</script>

<template>
    <!-- UnitedKingdomNationalHealthServiceNumberInput.vue -->
    <input
        class="united-kingdom-national-health-service-number-input"
        type="text"
        :aria-label="label"
        inputmode="numeric"
        :pattern="nhsPattern"
        autocomplete="off"
        spellcheck="false"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
