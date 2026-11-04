<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useAttrs, watch } from "vue";
import { attachCombobox, setActiveOption } from "./combobox-keys";
import { usePopoverState } from "./popover";
// Combobox component
//
// A headless combobox combining a text input with a dropdown listbox of
// suggestions for autocomplete or type-ahead search experiences. Users type into
// the input to filter suggestions, then select from matching options in the
// dropdown. Commonly used for search fields, address inputs, tag selectors, and
// choosing from large option sets.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label on both input and listbox.
//   value — string, default "". Bindable current text input value.
//   open — boolean, default false. Bindable dropdown visibility state.
//   select event. The chosen option's data-value, else its text.
//   default slot. Option elements rendered inside the listbox dropdown.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <Combobox label="Search" v-model v-model:open>
//     <div role="option">Option 1</div>
//   </Combobox>
//
// Examples:
//   <!-- Combobox with filtered options -->
//   <Combobox label="Select a fruit" v-model v-model:open>
//     <div v-for="option in filtered" role="option">{{ option }}</div>
//   </Combobox>
//
// Keyboard:
//   - ArrowDown, ArrowUp: open on the first or last option, then move and wrap
//   - Home, End: jump to the first or last option while open
//   - Enter: choose the highlighted option
//   - Escape: close while open; left alone while closed
//   - Alt+ArrowDown opens without a highlight; Alt+ArrowUp closes
//
// Accessibility:
//   - role="combobox" on the input identifies it as a combobox widget
//   - aria-expanded reflects the open state for screen readers
//   - aria-controls links the input to the associated listbox by ID
//   - aria-autocomplete="list" indicates suggestions are provided via a list
//   - role="listbox" on the dropdown identifies selectable options
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//   - All option content is provided by consumers through the default slot
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Generates a unique listboxId for the aria-controls relationship
//   - Consumer is responsible for filtering options based on value
//   - combobox-keys.ts owns the keys, typing, blur and pointer: the one module the catalogs share
//
// References:
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import { useId, ref } from "vue";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

const props = defineProps<{
    /** Accessible label. */
    label: string;
}>();

warnMissingName("Combobox", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const emit = defineEmits<{ select: [value: string] }>();

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);

const open = defineModel<boolean>("open", { default: false });

const listboxId = `combobox-${useId()}`;

const panelEl = shallowRef<HTMLElement | null>(null);
usePopoverState(panelEl, open);

let detach: (() => void) | undefined;
onMounted(() => {
    detach = attachCombobox(field.value as HTMLInputElement, panelEl.value!, {
        open: () => open.value,
        setOpen: (next) => {
            open.value = next;
        },
        choose: (chosen) => {
            modelValue.value = chosen;
            emit("select", chosen);
        },
    });
});
onBeforeUnmount(() => detach?.());

// Closed from outside: no highlight survives into the next opening.
watch(open, (isOpen) => {
    if (!isOpen && field.value && panelEl.value) setActiveOption(field.value, panelEl.value, null);
});
</script>

<template>
    <!-- Combobox.vue -->
    <div class="combobox">
        <input
            type="text"
            role="combobox"
            :aria-label="label"
            :aria-expanded="open"
            :aria-controls="listboxId"
            aria-autocomplete="list"
            ref="field"
            v-model="modelValue"
        />
        <div
            ref="panelEl"
            popover="manual"
            role="listbox"
            :id="listboxId"
            :aria-label="label"
        >
            <slot />
        </div>
    </div>
</template>
