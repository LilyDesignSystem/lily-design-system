<script setup lang="ts">

    // PortugalPassaporteInput component
    //
    // A headless input for entering Portugal's Passaporte.
    // Format: 1 letter [A-Z] and 6 digits [0-9].
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Portuguese_passport

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
    <!-- PortugalPassaporteInput.vue -->
    <input
        class="portugal-passaporte-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
