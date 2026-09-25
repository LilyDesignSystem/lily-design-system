<script setup lang="ts">

    // ZhongguoJuminShenfenzhengHaomaView component
    //
    // A headless display for China's Resident Identity Card Number.
    // Format: 18 characters under GB 11643: region code, date of birth (YYYYMMDD), a sequence number encoding sex by parity, and an ISO 7064 MOD 11-2 check character (X for 10).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Resident_Identity_Card

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- ZhongguoJuminShenfenzhengHaomaView.vue -->
    <span
        class="zhongguo-jumin-shenfenzheng-haoma-view"
        :aria-label="label">{{ value }}</span
    >
</template>
