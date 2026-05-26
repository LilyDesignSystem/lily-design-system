<script setup lang="ts">

    // LiechtensteinNationalIdentityCardNumberInput component
    //
    // A headless input for entering Liechtenstein's Liechtenstein National Identity Card Number.
    // Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identity_card

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
    <!-- LiechtensteinNationalIdentityCardNumberInput.vue -->
    <input
        class="liechtenstein-national-identity-card-number-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
