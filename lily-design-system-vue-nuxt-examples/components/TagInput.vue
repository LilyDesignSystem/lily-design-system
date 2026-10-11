<script setup lang="ts">

    // TagInput component
    //
    // A headless text input for adding tags to a collection. When the user types
    // a value and presses Enter, the component calls the onadd callback with the
    // trimmed text and automatically clears the input, providing a streamlined
    // tag entry experience. Commonly used alongside TagGroup for tag management
    // interfaces such as adding skills, keywords, or labels.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the input via aria-label.
    //   value — string, default "". Current input text; bindable with v-model.
    //   onadd — (value: string) => void, optional. Callback fired when Enter is pressed with non-empty trimmed value.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <TagInput label="Add tag" v-model onadd={(tag) => tags.push(tag)} />
    //
    // Examples:
    //   <!-- Tag input with add handler -->
    //   <TagInput label="Add skill" v-model onadd={(skill) => skills = [...skills, skill]} />
    //
    // Keyboard:
    //   - Enter: when the input has a non-empty trimmed value, calls onadd and clears input
    //
    // Accessibility:
    //   - aria-label={label} provides an accessible name for the text input
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses defineModel() for two-way binding on value
    //   - Enter handler calls preventDefault to avoid form submission
    //
    // References:
    //   - WAI-ARIA textbox role: https://www.w3.org/TR/wai-aria-1.2/#textbox

    const props = withDefaults(defineProps<{
        /** Accessible label. */
        label: string;
        /** Whether disabled. */
        disabled?: boolean;
    }>(), {
        disabled: false,
    });

    const emit = defineEmits<{ add: [value: string] }>();

    const modelValue = defineModel<string>({ default: "" });

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Enter" && modelValue.value.trim()) {
            event.preventDefault();
            emit("add", modelValue.value.trim());
            modelValue.value = "";
        }
    }

</script>

<template>
    <!-- TagInput.vue -->
    <input
        class="tag-input"
        type="text"
        :aria-label="label"
        v-model="modelValue"
        @keydown="onkeydown"
        :disabled="disabled"
    />
</template>
