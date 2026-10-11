<script setup lang="ts">

    // HangukJuminDeungnokBeonhoInput component
    //
    // A headless input for entering South Korea's Resident Registration Number (주민등록번호).
    // Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Resident_registration_number

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
    <!-- HangukJuminDeungnokBeonhoInput.vue -->
    <input
        class="hanguk-jumin-deungnok-beonho-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
