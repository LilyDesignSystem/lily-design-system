<script setup lang="ts">

    // VitalSignBellyCircumferenceAsCmInput component
    //
    // A headless numeric input for entering a belly circumference value in
    // centimeters (cm). Wraps a native <input type="number"> element with
    // accessible labelling and sensible default constraints (0-300 cm).
    //
    // Props:
    //   label — string, required. Accessible name via aria-label.
    //   min — number, default 0.
    //   max — number, default 300.
    //   step — number, default 1.
    //   required — boolean, default false.
    //   disabled — boolean, default false.
    //
    // Models:
    //   modelValue — number | undefined, default undefined.
    //
    // Syntax:
    //   <VitalSignBellyCircumferenceAsCmInput label="Belly circumference (cm)" v-model />
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Do not wrap in a <div> — renders a bare <input> element

    withDefaults(defineProps<{
        label: string;
        min?: number;
        max?: number;
        step?: number;
        required?: boolean;
        disabled?: boolean;
    }>(), {
        min: 0,
        max: 300,
        step: 1,
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<number | undefined>({ default: undefined });

</script>

<template>
    <!-- VitalSignBellyCircumferenceAsCmInput.vue -->
    <input
        class="vital-sign-belly-circumference-as-cm-input"
        type="number"
        :aria-label="label"
        v-model="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :required="required"
        :disabled="disabled"
    />
</template>
