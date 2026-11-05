<script setup lang="ts">
// TagInputDiv component
//
// A group holding the consumer's tags and a text field that adds to them. When
// the user types a value and presses Enter, the component emits add with the
// trimmed text and clears the field. The tags are the consumer's: it keeps the
// collection and renders it in the default slot, with its own remove buttons.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the group and the field, via aria-label.
//   value — string, default "". Current input text; bindable with v-model.
//   add — emitted with the trimmed value when Enter is pressed with non-empty text.
//   disabled — boolean, default false. Whether the field is disabled.
//   placeholder, name, required — set on the field.
//   default slot — the tags so far.
//   ...restProps — additional HTML attributes fall through to the root <div>.
//
// Syntax:
//   <TagInputDiv label="Add tag" v-model="text" @add="(tag) => tags.push(tag)">
//       <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
//   </TagInputDiv>
//
// Examples:
//   <!-- Tag input with add handler -->
//   <TagInputDiv label="Add skill" v-model="text" @add="(skill) => skills.push(skill)" />
//
// Keyboard:
//   - Enter: when the field has a non-empty trimmed value, emits add and clears the field.
//     With no text it stays a normal Enter, which submits a surrounding form. Enter during
//     an IME composition confirms the composition, so it adds nothing.
//
// Accessibility:
//   - role="group" with aria-label={label} names the tags and the field together
//   - aria-label={label} names the text field
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

import { ref, useAttrs } from "vue";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        /** Accessible label. */
        label: string;
        /** Whether disabled. */
        disabled?: boolean;
        /** The field's placeholder. */
        placeholder?: string;
        /** The field's name. */
        name?: string;
        /** Whether the field is required. */
        required?: boolean;
    }>(),
    {
        disabled: false,
        placeholder: undefined,
        name: undefined,
        required: false,
    },
);

warnMissingName("TagInputDiv", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const emit = defineEmits<{ add: [value: string] }>();

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);

function onkeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.isComposing && modelValue.value.trim()) {
        event.preventDefault();
        emit("add", modelValue.value.trim());
        modelValue.value = "";
    }
}
</script>

<template>
    <!-- TagInputDiv.vue -->
    <div
        class="tag-input-div"
        role="group"
        :aria-label="label"
    >
        <slot />
        <input
            class="tag-input-div-field"
            type="text"
            :aria-label="label"
            ref="field"
            v-model="modelValue"
            @keydown="onkeydown"
            :disabled="disabled"
            :placeholder="placeholder"
            :name="name"
            :required="required"
        />
    </div>
</template>
