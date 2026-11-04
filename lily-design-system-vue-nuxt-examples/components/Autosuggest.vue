<script setup lang="ts">
// Autosuggest component
//
// A text input that proposes matching options as users type: the WAI-ARIA
// combobox pattern with list autocomplete. The input is the combobox; the
// suggestions are a listbox of options. The consumer computes the
// suggestions on the `input` event (filtering, fetching) and passes them back
// in `suggestions`; the component owns the open state, the highlight, the
// keys and the selection.
//
// Props:
//   label — string, required. Accessible name of the input and the listbox.
//   v-model (modelValue) — string, default "". The input's text.
//   suggestions — { value: string; label: string }[], default []. The options to show.
//   placeholder — string, optional. Placeholder text.
//   name — string, optional. Form field name of the input.
//   Attributes fall through to the root <div>.
//
// Events:
//   input — (query: string) as the user types.
//   select — (value: string) when a suggestion is chosen.
//
// Syntax:
//   <Autosuggest v-model="country" label="Country" :suggestions="suggestions" @input="search" />
//
// Keyboard:
//   - ArrowDown: open the list / highlight the next option (wraps)
//   - ArrowUp: open the list / highlight the previous option (wraps)
//   - Home / End: highlight the first / last option while the list is open
//   - Enter: choose the highlighted option
//   - Escape: close the list without choosing
//
// Accessibility:
//   - role="combobox" on the input, aria-autocomplete="list", aria-expanded,
//     aria-controls naming the listbox, aria-activedescendant naming the
//     highlighted option (which carries aria-selected="true")
//   - The list stays in the DOM, hidden while closed, so aria-controls always resolves
//
// Claude rules:
//   - Choosing an option writes its `value` into the input and closes the list
//   - The list opens only while there are suggestions; blur closes it
//   - Pressing on an option does not blur the input, so a click can choose it
//
// References:
//   - WAI-ARIA APG combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import { computed, ref, useId, useAttrs } from "vue";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        /** Accessible label. */
        label: string;
        /** The options to show. */
        suggestions?: { value: string; label: string }[];
        /** Placeholder text. */
        placeholder?: string;
        /** Form field name. */
        name?: string;
    }>(),
    {
        suggestions: () => [],
        placeholder: undefined,
        name: undefined,
    },
);

warnMissingName(
    "Autosuggest",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const emit = defineEmits<{ input: [query: string]; select: [value: string] }>();

/** The input's text. */
const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | null>(null);
useFormReset(modelValue, field);

const uid = useId();
const listId = `autosuggest-list-${uid}`;
const optionId = (index: number) => `autosuggest-option-${uid}-${index}`;

const wanted = ref(false);
const active = ref(-1);
const open = computed(() => wanted.value && props.suggestions.length > 0);

function choose(index: number) {
    const suggestion = props.suggestions[index];
    if (!suggestion) return;
    modelValue.value = suggestion.value;
    wanted.value = false;
    active.value = -1;
    emit("select", suggestion.value);
}

function oninput(event: Event) {
    modelValue.value = (event.target as HTMLInputElement).value;
    wanted.value = true;
    active.value = -1;
    emit("input", modelValue.value);
}

function onkeydown(event: KeyboardEvent) {
    const count = props.suggestions.length;
    switch (event.key) {
        case "ArrowDown":
            if (count === 0) return;
            active.value = open.value ? (active.value + 1) % count : 0;
            wanted.value = true;
            break;
        case "ArrowUp":
            if (count === 0) return;
            active.value = open.value && active.value > 0 ? active.value - 1 : count - 1;
            wanted.value = true;
            break;
        case "Home":
            if (!open.value) return;
            active.value = 0;
            break;
        case "End":
            if (!open.value) return;
            active.value = count - 1;
            break;
        case "Enter":
            if (!open.value || active.value < 0) return;
            choose(active.value);
            break;
        case "Escape":
            if (!open.value) return;
            wanted.value = false;
            active.value = -1;
            break;
        default:
            return;
    }
    event.preventDefault();
}

function onblur() {
    wanted.value = false;
    active.value = -1;
}
</script>

<template>
    <!-- Autosuggest.vue -->
    <div class="autosuggest">
        <input
            ref="field"
            class="autosuggest-input"
            type="text"
            role="combobox"
            autocomplete="off"
            :aria-label="label"
            aria-autocomplete="list"
            :aria-expanded="open"
            :aria-controls="listId"
            :aria-activedescendant="open && active >= 0 ? optionId(active) : undefined"
            :placeholder="placeholder"
            :name="name"
            :value="modelValue"
            @input="oninput"
            @keydown="onkeydown"
            @blur="onblur"
        />
        <ul
            :id="listId"
            class="autosuggest-list"
            role="listbox"
            :aria-label="label"
            :hidden="!open"
            @mousedown.prevent
        >
            <li
                v-for="(suggestion, index) in suggestions"
                :id="optionId(index)"
                :key="suggestion.value"
                class="autosuggest-option"
                role="option"
                :aria-selected="index === active"
                :data-value="suggestion.value"
                @click="choose(index)"
            >
                {{ suggestion.label }}
            </li>
        </ul>
    </div>
</template>
