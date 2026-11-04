<script setup lang="ts">
import { useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
// EditableForm component
//
// An editable form that wraps inline editing functionality in a <form> element,
// providing submit and cancel semantics with keyboard support. The form is only
// rendered when the editing prop is true. Useful for editing records in place,
// such as updating profiles, renaming items, or modifying settings.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the form.
//   editing — boolean, default false. Whether the form is in edit mode; bindable.
//   onsubmit — (event: SubmitEvent) => void, default undefined. Callback when the form is submitted.
//   oncancel — () => void, default undefined. Callback when editing is cancelled.
//   default slot. Form content (inputs, buttons, etc.).
//   ...restProps — additional HTML attributes spread onto the <form> element.
//
// Syntax:
//   <EditableForm label="Edit profile" v-model:editing onsubmit={save}>
//     <input name="name" />
//     <button type="submit">Save</button>
//   </EditableForm>
//
// Examples:
//   <!-- Basic editable form -->
//   <EditableForm label="Edit profile" v-model:editing onsubmit={save}>
//     <input name="name" value={name} />
//     <button type="submit">Save</button>
//   </EditableForm>
//
//   <!-- With cancel callback and cancel button -->
//   <EditableForm label="Rename item" v-model:editing onsubmit={rename} oncancel={revert}>
//     <input name="title" value={title} />
//     <button type="submit">OK</button>
//     <button type="button" onclick={() => editing = false}>Cancel</button>
//   </EditableForm>
//
// Keyboard:
//   - Enter: submits the form (native behavior), exits edit mode, calls onsubmit
//   - Escape: cancels editing, exits edit mode, calls oncancel
//
// Accessibility:
//   - aria-label provides the accessible name for the form
//   - tabindex="-1" allows programmatic focus management
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//   - All button and input labels come from consumer-provided children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Form is removed from DOM when editing is false
//   - Uses defineModel() on editing for two-way state binding
//   - Calls event.preventDefault() on submit for consumer-controlled save logic
//
// References:
//   - WAI-ARIA Form Role: https://www.w3.org/WAI/ARIA/apd/roles/form/

const props = defineProps<{
    /** Accessible name for the form. */
    label: string;
    /** Callback when the form is submitted. */
    onsubmit?: (event: SubmitEvent) => void;
    /** Callback when editing is cancelled. */
    oncancel?: () => void;
}>();

warnMissingName(
    "EditableForm",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const editing = defineModel<boolean>("editing", { default: false });

function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    editing.value = false;
    props.onsubmit?.(event);
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
        event.preventDefault();
        editing.value = false;
        props.oncancel?.();
    }
}
</script>

<template>
    <!-- EditableForm.vue -->
    <form
        v-if="editing"
        class="editable-form"
        :aria-label="label"
        tabindex="-1"
        @submit="handleSubmit"
        @keydown="handleKeydown"
    >
        <slot />
    </form>
</template>
