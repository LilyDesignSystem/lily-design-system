<script setup lang="ts">

    // EireIndividualHealthIdentifierInput component
    //
    // A headless input for entering an Eire Individual Health Identifier (IHI),
    // a 10-digit clinical identifier used by the HSE to safely match patients
    // with their medical records across different hospitals and GPs.
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
    //   <EireIndividualHealthIdentifierInput label="IHI" v-model />
    //
    // Examples:
    //   <!-- Required IHI input -->
    //   <EireIndividualHealthIdentifierInput label="IHI" required />
    //
    //   <!-- Disabled IHI input -->
    //   <EireIndividualHealthIdentifierInput label="IHI" disabled />
    //
    // Keyboard:
    //   - Standard text input keyboard behavior
    //
    // Accessibility:
    //   - aria-label provides the accessible name for screen readers
    //   - inputmode="numeric" hints mobile devices to show numeric keyboard
    //   - pattern="[0-9]{10}" validates 10-digit format
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
    //   - HSE: https://www.hse.ie/

    withDefaults(defineProps<{
        /** Accessible label for screen readers */
        label: string;
        /** Whether the input is required for form submission */
        required?: boolean;
        /** Whether the input is disabled */
        disabled?: boolean;
    }>(), {
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

    const ihiPattern = "[0-9]{10}";

</script>

<template>
    <!-- EireIndividualHealthIdentifierInput.vue -->
    <input
        class="eire-individual-health-identifier-input"
        type="text"
        :aria-label="label"
        inputmode="numeric"
        :pattern="ihiPattern"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
