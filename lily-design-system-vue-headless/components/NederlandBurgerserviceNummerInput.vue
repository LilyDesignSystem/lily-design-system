<script setup lang="ts">

    // NederlandBurgerserviceNummerInput component
    //
    // A headless input for entering Netherlands's Burgerservicenummer (BSN).
    // Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Burgerservicenummer

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
    <!-- NederlandBurgerserviceNummerInput.vue -->
    <input
        class="nederland-burgerservice-nummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
