<script setup lang="ts">

    // ElladaDematerialisedSecuritiesSystemInput component
    //
    // A headless input for entering Greece's Dematerialised Securities System (DSS).
    // Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Central_Securities_Depository

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
    <!-- ElladaDematerialisedSecuritiesSystemInput.vue -->
    <input
        class="ellada-dematerialised-securities-system-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
