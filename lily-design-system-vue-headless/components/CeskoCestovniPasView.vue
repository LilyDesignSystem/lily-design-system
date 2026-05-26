<script setup lang="ts">

    // CeskoCestovniPasView component
    //
    // A headless display for Czech Republic's Cestovní pas.
    // Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Czech_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- CeskoCestovniPasView.vue -->
    <span
        class="cesko-cestovni-pas-view"
        :aria-label="label">{{ value }}</span
    >
</template>
