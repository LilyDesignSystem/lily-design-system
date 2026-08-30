<script setup lang="ts">

    // DeutschlandKrankenversichertennummerView component
    //
    // A headless display for Germany's Krankenversichertennummer (KVNR).
    // Format: a random capital letter followed by eight random digits and a Luhn check digit.
    //
    // References:
    //   - https://de.wikipedia.org/wiki/Krankenversichertennummer

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- DeutschlandKrankenversichertennummerView.vue -->
    <span
        class="deutschland-krankenversichertennummer-view"
        :aria-label="label">{{ value }}</span
    >
</template>
