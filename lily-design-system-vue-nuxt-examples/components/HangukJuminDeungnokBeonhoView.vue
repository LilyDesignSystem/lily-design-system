<script setup lang="ts">

    // HangukJuminDeungnokBeonhoView component
    //
    // A headless display for South Korea's Resident Registration Number (주민등록번호).
    // Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Resident_registration_number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- HangukJuminDeungnokBeonhoView.vue -->
    <span
        class="hanguk-jumin-deungnok-beonho-view"
        :aria-label="label">{{ value }}</span
    >
</template>
