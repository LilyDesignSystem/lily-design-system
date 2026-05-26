<script setup lang="ts">

    // AlbaCommunityHealthIndexView component
    //
    // A headless display for Scotland's Community Health Index (CHI).
    // Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Health_Service_Central_Register

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- AlbaCommunityHealthIndexView.vue -->
    <span
        class="alba-community-health-index-view"
        :aria-label="label">{{ value }}</span
    >
</template>
