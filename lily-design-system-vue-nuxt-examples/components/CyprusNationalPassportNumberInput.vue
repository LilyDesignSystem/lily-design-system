<script setup lang="ts">

    // CyprusNationalPassportNumberInput component
    //
    // A headless input for entering Cyprus's National Passport Number.
    // Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Cypriot_passport

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
    <!-- CyprusNationalPassportNumberInput.vue -->
    <input
        class="cyprus-national-passport-number-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
