// restoreOnFormReset — put a form control back to its initial value when its form resets.
//
// A control bound with `[value]="value()"` and `(input)="value.set(...)"` keeps its
// value in the component's model, which the browser's own reset knows nothing
// about: the field blanks while the model keeps what the user typed, so the page
// and the form disagree. Call this from the component's constructor with its
// model. One tick after `reset`, once the browser has reset the DOM, and not when
// a listener cancelled it, the model goes back to the value it had after the
// first render and the control is rewritten to match — also when the model did
// not change, which Angular would never re-render.
//
// `index` picks which native control of the host the model drives (default the first).
// `formId`, when it returns an id, names the form to follow instead of the one around the host (a control whose
// `form` attribute puts it in a form elsewhere).

import { DestroyRef, ElementRef, afterNextRender, inject, type ModelSignal } from "@angular/core";

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

export function restoreOnFormReset<T>(
    model: ModelSignal<T>,
    index = 0,
    formId?: () => string | undefined,
): void {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
        const id = formId?.();
        const form = id ? document.getElementById(id) : host.nativeElement.closest("form");
        if (!form) return;
        const initial = model();
        const snapshot = (): T => (Array.isArray(initial) ? ([...initial] as T) : initial);
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented) return;
                model.set(snapshot());
                const field =
                    host.nativeElement.querySelectorAll<Field>("input, select, textarea")[index];
                if (field) write(field, initial);
            }, 0);
        };
        form.addEventListener("reset", onReset);
        destroyRef.onDestroy(() => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        });
    });
}

// restoreRadiosOnFormReset — the same for a radio group whose model holds the checked radio's value.
//
// Angular binds `[checked]` as a property, so each radio's default is unchecked and the browser's
// reset clears the group. One tick after an uncancelled `reset`, the model goes back to its value
// after the first render and the radio whose value matches it is checked again.
export function restoreRadiosOnFormReset<T>(model: ModelSignal<T>): void {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
        const form = host.nativeElement.closest("form");
        if (!form) return;
        const initial = model();
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented) return;
                model.set(initial);
                for (const radio of host.nativeElement.querySelectorAll<HTMLInputElement>(
                    'input[type="radio"]',
                ))
                    radio.checked = radio.value === String(initial);
            }, 0);
        };
        form.addEventListener("reset", onReset);
        destroyRef.onDestroy(() => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        });
    });
}
