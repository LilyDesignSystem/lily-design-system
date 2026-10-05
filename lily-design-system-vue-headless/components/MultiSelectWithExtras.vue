<script setup lang="ts">

    // MultiSelectWithExtras component
    //
    // A wrapper <div> with before/after slots around a native <select multiple>.
    //
    // Props:
    //   label -- string, required. aria-label on the <select> (not the wrapper).
    //   value -- string[], default []. Bindable via v-model.
    //   size -- number, optional. Visible rows.
    //   required, disabled -- boolean, default false.
    //   default slot -- <option> elements; "before" / "after" slots around the select.
    //   ...attrs -- fall through onto the wrapper <div>.

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
    <!-- MultiSelectWithExtras.vue -->
    <div
        class="multi-select-with-extras"
    >
        <slot name="before" />
        <select
            multiple
            :aria-label="label"
            :size="size"
            v-model="modelValue"
            :required="required"
            :disabled="disabled"
        >
            <slot />
        </select>
        <slot name="after" />
    </div>
</template>
