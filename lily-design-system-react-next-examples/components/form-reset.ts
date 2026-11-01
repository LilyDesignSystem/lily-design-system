// useFormReset — run a callback after the enclosing <form> resets.
//
// React keeps a controlled field's default value in step with its value, so the
// browser's own reset is a no-op for a field whose value lives in component
// state: the DOM stays as the user left it. A component that keeps a form
// control's value in state calls this with a function that restores the value
// it started with. The callback runs one tick after `reset`, once the browser
// has reset the DOM, and not at all when a listener cancelled the reset.

import { useEffect, useRef, type RefObject } from "react";

export function useFormReset(ref: RefObject<Element | null>, onReset: () => void): void {
    const latest = useRef(onReset);
    latest.current = onReset;
    useEffect(() => {
        const form = ref.current?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const listener = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!event.defaultPrevented) latest.current();
            }, 0);
        };
        form.addEventListener("reset", listener);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", listener);
        };
    }, [ref]);
}
