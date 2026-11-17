// form-reset — restore a stateful input when its form is reset, the Solid 2 port of the other catalogs' helper.
//
// A native <input> restores its own value on form reset, but a component that holds its value in a signal does not:
// the signal keeps the edited value and writes it straight back. useFormReset listens for "reset" on the element's
// <form> and, on the next task (after the browser has restored the native controls), calls onReset unless the reset
// event was cancelled. Call it during the component's setup with an accessor for the element.
import { onSettled, untrack } from "solid-js";

export function useFormReset(element: () => Element | null | undefined, onReset: () => void): void {
    onSettled(() => {
        const form = element()?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const listener = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!event.defaultPrevented) untrack(onReset);
            }, 0);
        };
        form.addEventListener("reset", listener);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", listener);
        };
    });
}
