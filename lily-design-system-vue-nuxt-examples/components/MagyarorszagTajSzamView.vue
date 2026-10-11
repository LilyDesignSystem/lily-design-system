<script setup lang="ts">

    // MagyarorszagTajSzamView component
    //
    // A headless display for Hungary's Tarsadalombiztositasi Azonosito Jel (TAJ).
    // Format: 9 digits as SSS SSS SSK: an 8-digit serial number followed by a Modulus-10 check digit using alternating weights 3 and 7.
    //
    // References:
    //   - https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- MagyarorszagTajSzamView.vue -->
    <span
        class="magyarorszag-taj-szam-view"
        :aria-label="label">{{ value }}</span
    >
</template>
