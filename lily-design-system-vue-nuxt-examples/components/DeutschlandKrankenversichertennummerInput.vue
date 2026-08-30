<script setup lang="ts">

    // DeutschlandKrankenversichertennummerInput component
    //
    // A headless input for entering Germany's Krankenversichertennummer (KVNR).
    // Format: a random capital letter followed by eight random digits and a Luhn check digit.
    //
    // References:
    //   - https://de.wikipedia.org/wiki/Krankenversichertennummer

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
    <!-- DeutschlandKrankenversichertennummerInput.vue -->
    <input
        class="deutschland-krankenversichertennummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
