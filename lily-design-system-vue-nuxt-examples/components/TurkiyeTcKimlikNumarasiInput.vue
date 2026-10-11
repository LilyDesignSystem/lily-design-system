<script setup lang="ts">

    // TurkiyeTcKimlikNumarasiInput component
    //
    // A headless input for entering Turkey's T.C. Kimlik Numarasi.
    // Format: 11 digits, the first never zero: the 10th digit is derived from weighted odd/even digit sums, the 11th is the (always even) sum of the first ten digits.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Turkish_Identification_Number

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
    <!-- TurkiyeTcKimlikNumarasiInput.vue -->
    <input
        class="turkiye-tc-kimlik-numarasi-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
