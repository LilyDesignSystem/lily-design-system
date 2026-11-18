<script setup lang="ts">
// SverigePersonnummerView component
//
// A headless display for Sweden's Personnummer.
// Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

withDefaults(
    defineProps<{
        label?: string;
        value?: string;
    }>(),
    {
        value: "",
    },
);
</script>

<template>
    <!-- SverigePersonnummerView.vue -->
    <span class="sverige-personnummer-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
