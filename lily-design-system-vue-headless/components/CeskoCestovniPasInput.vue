<script setup lang="ts">

    // CeskoCestovniPasInput component
    //
    // A headless input for entering Czech Republic's Cestovní pas.
    // Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Czech_passport

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
    <!-- CeskoCestovniPasInput.vue -->
    <input
        class="cesko-cestovni-pas-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
