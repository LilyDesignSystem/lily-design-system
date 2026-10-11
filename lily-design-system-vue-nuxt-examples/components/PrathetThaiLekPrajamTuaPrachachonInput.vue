<script setup lang="ts">

    // PrathetThaiLekPrajamTuaPrachachonInput component
    //
    // A headless input for entering Thailand's National Identification Number.
    // Format: 13 digits: registration category, district/province office code, a serial number, a Modulus-11 check digit, and 2 further disambiguating digits.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Thai_identity_card

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
    <!-- PrathetThaiLekPrajamTuaPrachachonInput.vue -->
    <input
        class="prathet-thai-lek-prajam-tua-prachachon-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
