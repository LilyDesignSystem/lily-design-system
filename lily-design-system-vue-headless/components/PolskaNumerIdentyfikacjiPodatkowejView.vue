<script setup lang="ts">
// PolskaNumerIdentyfikacjiPodatkowejView component
//
// A headless display for Poland's Numer Identyfikacji Podatkowej (NIP).
// Format: 10 numeric digits used for tax identification.
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Poland

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
    <!-- PolskaNumerIdentyfikacjiPodatkowejView.vue -->
    <span class="polska-numer-identyfikacji-podatkowej-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
