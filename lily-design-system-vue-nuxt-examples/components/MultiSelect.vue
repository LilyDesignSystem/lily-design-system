<script setup lang="ts">

    // MultiSelect component
    //
    // A headless native <select multiple> (exposed as a listbox). Native
    // keyboard and pointer behaviour only.
    //
    // Props:
    //   label -- string, required. Accessible name via aria-label.
    //   value -- string[], default []. Bindable via v-model (selected option values).
    //   size -- number, optional. Visible rows.
    //   required, disabled -- boolean, default false.
    //   default slot -- <option> elements (Option component or native).
    //   ...attrs -- fall through onto the <select>.
    //
    // Accessibility: aria-label={label}. Internationalization: label is a prop.

    withDefaults(defineProps<{
        /** Accessible label. */
        label: string;
        /** Number of visible rows. */
        size?: number;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
    }>(), {
        size: undefined,
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string[]>({ default: () => [] });

</script>

<template>
    <!-- MultiSelect.vue -->
    <select
        class="multi-select"
        multiple
        :aria-label="label"
        :size="size"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    >
        <slot />
    </select>
</template>
