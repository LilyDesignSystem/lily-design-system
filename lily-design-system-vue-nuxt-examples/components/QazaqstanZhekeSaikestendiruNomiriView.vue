<script setup lang="ts">
// QazaqstanZhekeSaikestendiruNomiriView component
//
// A headless display for Kazakhstan's Individual Identification Number (IIN).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf

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
    <!-- QazaqstanZhekeSaikestendiruNomiriView.vue -->
    <span class="qazaqstan-zheke-saikestendiru-nomiri-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
