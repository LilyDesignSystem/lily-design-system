<script setup lang="ts">
// Editable component
//
// An inline-editable text component that toggles between a read-only display
// and an input field for editing. The root is a <div class="editable">; in
// display mode it holds a native <button type="button"> showing the value, in edit
// mode an <input type="text">. Enter confirms the edit and Escape cancels it;
// focus moves to the input on edit and back to the button on confirm or cancel.
//
// Props:
//   className — string, optional. CSS class name.
//   value — string, default "". Current text value; bindable.
//   label — string, required. Accessible name for the editable control.
//   editing — boolean, default false. Whether the component is in edit mode; bindable.
//   disabled — boolean, default false. Whether editing is disabled.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <Editable label="Name" v-model />
//
// Examples:
//   <!-- Basic inline edit -->
//   <Editable label="Name" v-model />
//
//   <!-- With external editing state control -->
//   <Editable label="Title" v-model v-model:editing />
//
// Keyboard:
//   - Enter or Space (display mode): activate edit mode (the native button's own keys)
//   - Enter (edit mode): confirm the edit and return to display mode
//   - Escape (edit mode): cancel the edit and return to display mode
//
// Accessibility:
//   - a native <button> in display mode: focusable, with Enter and Space, no role to add
//   - aria-label provides the accessible name in both modes; in view mode it is "value, label" so the visible
//     text is part of the name (WCAG 2.5.3 label in name)
//   - the button is disabled when `disabled` is true
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses internal draft state to allow cancel without losing original value
//   - Both value and editing support defineModel() two-way binding
//
// References:
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { nextTick, ref, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        /** Accessible label for the editable control. */
        label: string;
        /** Whether editing is disabled. */
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    },
);

warnMissingName("Editable", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const modelValue = defineModel<string>({ default: "" });

const editing = defineModel<boolean>("editing", { default: false });

const draft = ref(modelValue.value);
const input = ref<HTMLInputElement | null>(null);
const button = ref<HTMLButtonElement | null>(null);

// The element that had focus is removed by the switch, so focus follows the user to the element that replaces it.
async function startEditing() {
    if (props.disabled) return;
    draft.value = modelValue.value;
    editing.value = true;
    await nextTick();
    input.value?.focus();
}

async function finish() {
    editing.value = false;
    await nextTick();
    button.value?.focus();
}

function confirm() {
    modelValue.value = draft.value;
    void finish();
}

function cancel() {
    draft.value = modelValue.value;
    void finish();
}

function onkeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
        event.preventDefault();
        confirm();
    } else if (event.key === "Escape") {
        event.preventDefault();
        cancel();
    }
}
</script>

<template>
    <!-- Editable.vue -->
    <div class="editable">
        <input
            v-if="editing"
            ref="input"
            class="editable-input"
            type="text"
            :aria-label="label"
            v-model="draft"
            @keydown="onkeydown"
        />
        <button
            v-else
            ref="button"
            class="editable-button"
            type="button"
            :aria-label="modelValue ? `${modelValue}, ${label}` : label"
            :disabled="disabled"
            @click="startEditing"
        >
            {{ modelValue }}
        </button>
    </div>
</template>
