<script setup lang="ts">

    // SverigePersonnummerInput component
    //
    // A headless input for entering Sweden's Personnummer.
    // Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

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
    <!-- SverigePersonnummerInput.vue -->
    <input
        class="sverige-personnummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
