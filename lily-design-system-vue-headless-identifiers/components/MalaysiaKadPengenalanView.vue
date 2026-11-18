<script setup lang="ts">
// MalaysiaKadPengenalanView component
//
// A headless display for Malaysia's MyKad Number (NRIC).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/MyKad

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
    <!-- MalaysiaKadPengenalanView.vue -->
    <span class="malaysia-kad-pengenalan-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
