<script setup lang="ts">

    // SuomiHenkilotunnusView component
    //
    // A headless display for Finland's Henkilötunnus (HETU).
    // Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- SuomiHenkilotunnusView.vue -->
    <span
        class="suomi-henkilotunnus-view"
        :aria-label="label">{{ value }}</span
    >
</template>
