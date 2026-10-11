<script setup lang="ts">

    // YisraelTeudatZehutInput component
    //
    // A headless input for entering Israel's Teudat Zehut (תעודת זהות).
    // Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Israeli_identity_card

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
    <!-- YisraelTeudatZehutInput.vue -->
    <input
        class="yisrael-teudat-zehut-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
