<script setup lang="ts">
// ItyopyaFaydaIdentificationNumberView component
//
// A headless display for Ethiopia's Fayda Identification Number (FIN).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Fayda_ID

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
    <!-- ItyopyaFaydaIdentificationNumberView.vue -->
    <span class="ityopya-fayda-identification-number-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
