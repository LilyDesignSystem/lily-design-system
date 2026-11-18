// useFormReset — restore a form control's initial value when its form resets.
//
// A control bound with v-model keeps its value in the component's model, and the
// browser's own reset knows nothing about it: the field blanks (or unchecks)
// while the model keeps what the user typed, so the page and the form disagree.
// The component calls this with its model and the control; one tick after
// `reset`, once the browser has reset the DOM, and not when a listener cancelled
// it, the model goes back to the value it had when the component was created
// (the consumer hears it through update:modelValue) and the control is rewritten
// to match, so the field is right even when the model did not change.

import { onBeforeUnmount, onMounted, type Ref } from "vue";

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function write(el: Field, value: unknown): void {
    if (el instanceof HTMLSelectElement && el.multiple) {
        const selected = Array.isArray(value) ? value.map(String) : [];
        for (const option of Array.from(el.options))
            option.selected = selected.includes(option.value);
    } else if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
        el.checked = Boolean(value);
    } else {
        el.value = value === undefined || value === null ? "" : String(value);
    }
}

export function useFormReset<T>(model: Ref<T>, field: Ref<Field | null>): void {
    const initial = Array.isArray(model.value) ? ([...model.value] as T) : model.value;
    let form: HTMLFormElement | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function onReset(event: Event): void {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (event.defaultPrevented) return;
            model.value = Array.isArray(initial) ? ([...initial] as T) : initial;
            if (field.value) write(field.value, initial);
        }, 0);
    }
    onMounted(() => {
        form = field.value?.closest("form") ?? null;
        form?.addEventListener("reset", onReset);
    });
    onBeforeUnmount(() => {
        clearTimeout(timer);
        form?.removeEventListener("reset", onReset);
    });
}

// For a control whose checked state is a plain prop (no model to restore): after
// a reset, write the prop's current value back to the control.
export function useFormResetToProp(field: Ref<Field | null>, current: () => unknown): void {
    let form: HTMLFormElement | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function onReset(event: Event): void {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (!event.defaultPrevented && field.value) write(field.value, current());
        }, 0);
    }
    onMounted(() => {
        form = field.value?.closest("form") ?? null;
        form?.addEventListener("reset", onReset);
    });
    onBeforeUnmount(() => {
        clearTimeout(timer);
        form?.removeEventListener("reset", onReset);
    });
}
