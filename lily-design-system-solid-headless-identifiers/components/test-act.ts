// act — run a test step, then flush Solid's pending updates.
//
// The React tests wrap state changes in act(); Solid has no act, but its updates are batched until flush(). This keeps
// the ported tests' act(() => …) calls meaning the same thing: the step has run and the DOM is up to date afterwards.
// A step that returns a promise is awaited before the flush.
import { flush } from "solid-js";

export function act<T>(step: () => T): T {
    const result = step();
    if (result instanceof Promise) {
        return result.then((value) => {
            flush();
            return value;
        }) as T;
    }
    flush();
    return result;
}
