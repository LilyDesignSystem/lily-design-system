<script setup lang="ts">
// TaiwanGuominShenfenzhengTongyiBianhaoView component
//
// A headless display for Taiwan's National Identification Card Number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)

withDefaults(
    defineProps<{
        label: string;
        value?: string;
    }>(),
    {
        value: "",
    },
);
</script>

<template>
    <!-- TaiwanGuominShenfenzhengTongyiBianhaoView.vue -->
    <span
        class="taiwan-guomin-shenfenzheng-tongyi-bianhao-view"
        :aria-label="label"
        >{{ value }}</span
    >
</template>
