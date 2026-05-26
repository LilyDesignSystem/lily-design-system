<script setup lang="ts">

    // PolskaNumerIdentyfikacjiPodatkowejInput component
    //
    // A headless input for entering Poland's Numer Identyfikacji Podatkowej (NIP).
    // Format: 10 numeric digits used for tax identification.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Poland

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
    <!-- PolskaNumerIdentyfikacjiPodatkowejInput.vue -->
    <input
        class="polska-numer-identyfikacji-podatkowej-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
