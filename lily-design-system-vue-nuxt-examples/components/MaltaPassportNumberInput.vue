<script setup lang="ts">

    // MaltaPassportNumberInput component
    //
    // A headless input for entering Malta's Malta Passport Number.
    // Format: 7 numerical digits issued by the Civil Registration Directorate.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Maltese_passport

    withDefaults(defineProps<{
        label: string;
        required?: boolean;
        disabled?: boolean;
    }>(), {
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

</script>

<template>
    <!-- MaltaPassportNumberInput.vue -->
    <input
        class="malta-passport-number-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
