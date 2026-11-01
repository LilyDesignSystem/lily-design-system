<script setup lang="ts">
// UnitedStatesSocialSecurityNumberInput component
//
// A headless input for entering a United States Social Security Number (SSN).
// The SSN is a 9-digit identifier assigned by the Social Security Administration,
// displayed in "XXX-XX-XXXX" format (3-digit area number, 2-digit group number,
// 4-digit serial number). The component enforces this pattern, uses a numeric
// keyboard hint for mobile, and disables autocomplete to protect sensitive
// personally identifiable information.
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
//   <UnitedStatesSocialSecurityNumberInput label="Social Security Number" v-model />
//
// Examples:
//   <!-- Required SSN input -->
//   <UnitedStatesSocialSecurityNumberInput label="Social Security Number" required />
//
//   <!-- Disabled SSN input -->
//   <UnitedStatesSocialSecurityNumberInput label="Social Security Number" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//   - Users type digits and hyphens in the format XXX-XX-XXXX
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputmode="numeric" hints mobile devices to show a numeric keyboard
//   - pattern enforces XXX-XX-XXXX format on form validation
//   - autocomplete="off" protects sensitive PII
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
//   - Social Security Number format: https://www.ssa.gov/employer/randomization.html

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

const ssnPattern = "[0-9]{3}-[0-9]{2}-[0-9]{4}";
</script>

<template>
    <!-- UnitedStatesSocialSecurityNumberInput.vue -->
    <input
        class="united-states-social-security-number-input"
        type="text"
        :aria-label="label"
        inputmode="numeric"
        :pattern="ssnPattern"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
