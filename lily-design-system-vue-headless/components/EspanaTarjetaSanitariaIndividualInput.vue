<script setup lang="ts">
// EspanaTarjetaSanitariaIndividualInput component
//
// A headless input for entering a España Tarjeta Sanitaria Individual (TSI),
// the unique Spanish national healthcare identifier (CIP-SNS). The format
// varies by Autonomous Community but typically starts with 4 region digits
// followed by alphanumeric characters.
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
//   <EspanaTarjetaSanitariaIndividualInput label="TSI" v-model />
//
// Examples:
//   <!-- Required TSI input -->
//   <EspanaTarjetaSanitariaIndividualInput label="TSI" required />
//
//   <!-- Disabled TSI input -->
//   <EspanaTarjetaSanitariaIndividualInput label="TSI" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autocomplete="off" protects sensitive health identifiers
//   - required and disabled states are conveyed to assistive technology
//
// Internationalization:
//   - The label prop externalizes user-facing text for translation
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses defineModel() for two-way data binding on value
//
// References:
//   - Ministerio de Sanidad: https://www.sanidad.gob.es/

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
</script>

<template>
    <!-- EspanaTarjetaSanitariaIndividualInput.vue -->
    <input
        class="espana-tarjeta-sanitaria-individual-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
