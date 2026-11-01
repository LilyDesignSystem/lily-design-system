<script setup lang="ts">
// TextInputWithSearch component
//
// A headless component that wraps a native <input type="text"> and
// <button type="button"> inside a <div role="search">. The search button
// triggers a callback with the current input value. Pressing Enter in the
// input also triggers the search.
//
// Props:
//   label — string, required. Accessible name for the search region via aria-label.
//   inputLabel — string, default "Search". Accessible name for the text input.
//   searchLabel — string, default "Search". Accessible label and text for the search button.
//   placeholder — string, optional. Placeholder text for the input.
//   onsearch — (value: string) => void, optional. Callback when search is triggered.
//   required — boolean, default false. Whether the input is required.
//   disabled — boolean, default false. Whether the input and button are disabled.
//
// Models:
//   modelValue — string, default "". Bindable text input value.
//
// Syntax:
//   <TextInputWithSearch label="Site search" @search="handleSearch" v-model="query" />
//
// Keyboard:
//   - Tab: Moves focus between input and search button
//   - Enter in input: Triggers search
//   - Enter/Space on button: Triggers search
//
// Accessibility:
//   - role="search" on wrapper for search landmark
//   - aria-label on region, input, and button
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import { ref } from "vue";
import { useFormReset } from "./form-reset";

const props = withDefaults(
    defineProps<{
        label: string;
        inputLabel?: string;
        searchLabel?: string;
        placeholder?: string;
        onsearch?: (value: string) => void;
        required?: boolean;
        disabled?: boolean;
    }>(),
    {
        inputLabel: "Search",
        searchLabel: "Search",
        placeholder: undefined,
        required: false,
        disabled: false,
    },
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);

function handleSearch() {
    props.onsearch?.(modelValue.value);
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
    }
}
</script>

<template>
    <!-- TextInputWithSearch.vue -->
    <div
        class="text-input-with-search"
        role="search"
        :aria-label="label"
    >
        <input
            type="text"
            :aria-label="inputLabel"
            ref="field"
            v-model="modelValue"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
            @keydown="handleKeydown"
        />
        <button
            type="button"
            :aria-label="searchLabel"
            @click="handleSearch"
            :disabled="disabled"
        >
            {{ searchLabel }}
        </button>
    </div>
</template>
