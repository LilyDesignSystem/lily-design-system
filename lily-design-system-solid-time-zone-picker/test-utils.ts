// test-utils — @solidjs/testing-library with a fireEvent that flushes.
//
// Solid 2 batches updates until flush() (or the next microtask). React's fireEvent runs inside act(), so a ported test
// that asserts straight after fireEvent expects the DOM already updated. This fireEvent dispatches, then flushes, so
// the ported assertions keep their meaning. userEvent is async and needs no help.
import { fireEvent as baseFireEvent } from "@solidjs/testing-library";
import { flush } from "solid-js";

export * from "@solidjs/testing-library";

type FireEvent = typeof baseFireEvent;

function flushed<F extends (...args: never[]) => unknown>(fn: F): F {
    return ((...args: Parameters<F>) => {
        const result = fn(...args);
        flush();
        return result;
    }) as F;
}

export const fireEvent: FireEvent = Object.assign(
    flushed(baseFireEvent as unknown as (...args: never[]) => boolean),
    Object.fromEntries(
        Object.entries(baseFireEvent).map(([name, fn]) => [
            name,
            flushed(fn as (...args: never[]) => boolean),
        ]),
    ),
) as unknown as FireEvent;
