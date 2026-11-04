<script setup lang="ts">
// FranceNumeroDIdentificationAuRepertoireInput component
//
// A headless input for entering a France numéro d'identification au répertoire
// (NIR), the unique 15-digit French national healthcare identifier printed on
// the Carte Vitale. The standard display format is "X XX XX XX XXX XXX XX".
// The component enforces this pattern, uses a numeric keyboard hint for mobile,
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
//   <FranceNumeroDIdentificationAuRepertoireInput label="NIR" v-model />
//
// Examples:
//   <!-- Required NIR input -->
//   <FranceNumeroDIdentificationAuRepertoireInput label="NIR" required />
//
//   <!-- Disabled NIR input -->
//   <FranceNumeroDIdentificationAuRepertoireInput label="NIR" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//   - Users type digits and spaces in the format X XX XX XX XXX XXX XX
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputmode="numeric" hints mobile devices to show a numeric keyboard
//   - pattern enforces X XX XX XX XXX XXX XX format on form validation
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
//   - Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale

import { ref, useAttrs } from "vue";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
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

warnMissingName(
    "FranceNumeroDIdentificationAuRepertoireInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);

const nirPattern = "[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}";
</script>

<template>
    <!-- FranceNumeroDIdentificationAuRepertoireInput.vue -->
    <input
        class="france-numero-d-identification-au-repertoire-input"
        type="text"
        :aria-label="label"
        inputmode="numeric"
        :pattern="nirPattern"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
