<script setup lang="ts">
// VietNamCanCuocCongDanView component
//
// A headless display for Viet Nam's Citizen Identification Number (CCCD).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Vietnamese_identity_card

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
    <!-- VietNamCanCuocCongDanView.vue -->
    <span class="viet-nam-can-cuoc-cong-dan-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
