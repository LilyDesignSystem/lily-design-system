<script setup lang="ts">

    // Editable component
    //
    // An inline-editable text component that toggles between a read-only display
    // and an input field for editing. In display mode it renders a <span> with
    // role="button"; in edit mode it renders an <input type="text">. Pressing
    // Enter confirms the edit and Escape cancels it, reverting to the original value.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, default "". Current text value; bindable.
    //   label — string, required. Accessible name for the editable control.
    //   editing — boolean, default false. Whether the component is in edit mode; bindable.
    //   disabled — boolean, default false. Whether editing is disabled.
    //   ...restProps — additional HTML attributes spread onto the <span> or <input>.
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
    //   - Enter (display mode): activate edit mode
    //   - Space (display mode): activate edit mode
    //   - Enter (edit mode): confirm the edit and return to display mode
    //   - Escape (edit mode): cancel the edit and return to display mode
    //
    // Accessibility:
    //   - role="button" on the display span indicates it is activatable
    //   - aria-label provides the accessible name in both modes
    //   - aria-disabled on the span when disabled
    //   - tabindex="0" when enabled, tabindex="-1" when disabled
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

    import { ref } from "vue";

    const props = withDefaults(defineProps<{
        /** Accessible label for the editable control. */
        label: string;
        /** Whether editing is disabled. */
        disabled?: boolean;
    }>(), {
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

    const editing = defineModel<boolean>("editing", { default: false });

    const draft = ref(modelValue.value);

    function startEditing() {
        if (props.disabled) return;
        draft.value = modelValue.value;
        editing.value = true;
    }

    function confirm() {
        modelValue.value = draft.value;
        editing.value = false;
    }

    function cancel() {
        draft.value = modelValue.value;
        editing.value = false;
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

    function onDisplayKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            startEditing();
        }
    }

</script>

<template>
    <!-- Editable.vue -->
        <input v-if="editing"
            class="editable"
            type="text"
            :aria-label="label"
            v-model="draft"
            @keydown="onkeydown"
        />
        <span v-else
            class="editable"
            role="button"
            :tabindex="disabled ? -1 : 0"
            :aria-label="label"
            :aria-disabled="disabled || undefined"
            @click="startEditing"
            @keydown="onDisplayKeydown"
        >
            {{ modelValue }}
        </span>
</template>
