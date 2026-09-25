<script setup lang="ts">

    // ZhongguoJuminShenfenzhengHaomaInput component
    //
    // A headless input for entering China's Resident Identity Card Number.
    // Format: 18 characters under GB 11643: region code, date of birth (YYYYMMDD), a sequence number encoding sex by parity, and an ISO 7064 MOD 11-2 check character (X for 10).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Resident_Identity_Card

    withDefaults(defineProps<{
        label: string;
        required?: boolean;
        disabled?: boolean;
    }>(), {
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

</script>

<template>
    <!-- ZhongguoJuminShenfenzhengHaomaInput.vue -->
    <input
        class="zhongguo-jumin-shenfenzheng-haoma-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
