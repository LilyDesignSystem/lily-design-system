import { fireEvent, render, screen, waitFor } from "./test-utils";
import { createSignal, flush } from "solid-js";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Combobox";

describe("Combobox", () => {
    test("renders a combobox input", () => {
        render(() => <Subject label="Fruit">Content</Subject>);
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(() => <Subject label="Search fruit">Content</Subject>);
        expect(screen.getByRole("combobox", { name: "Search fruit" })).toBeTruthy();
    });

    test("listbox hidden when closed", () => {
        render(() => (
            <Subject
                label="Fruit"
                open={false}
            >
                Content
            </Subject>
        ));
        expect(screen.queryByRole("listbox")).toBeNull();
    });

    test("listbox shown when open", () => {
        render(() => (
            <Subject
                label="Fruit"
                open
            >
                Content
            </Subject>
        ));
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-expanded", () => {
        render(() => (
            <Subject
                label="Fruit"
                open
            >
                Content
            </Subject>
        ));
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    });

    test("passes through attributes", () => {
        render(() => (
            <Subject
                label="F"
                data-testid="cb"
            >
                Content
            </Subject>
        ));
        expect(screen.getByTestId("cb")).toBeTruthy();
    });

    test("Escape asks to close the listbox", () => {
        const onOpenChange = vi.fn();
        render(() => (
            <Subject
                label="Fruit"
                open
                onOpenChange={onOpenChange}
            >
                <div role="option">Apple</div>
            </Subject>
        ));
        fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("announces the consumer's count when typing pauses, and says when nothing matches", async () => {
        const props = {
            label: "Medicine",
            open: true,
            resultsLabel: (n: number) => `${n} matches`,
            noResultsLabel: "No matches",
            statusDelay: 0,
        };
        const [count, setCount] = createSignal(4);
        render(() => (
            <Subject
                {...props}
                resultCount={count()}
            >
                {count() > 0 ? <div role="option">Aspirin</div> : null}
            </Subject>
        ));
        // waitFor, not a fixed sleep: under a loaded CI machine a 10 ms sleep could finish before the status timer.
        const status = screen.getByRole("status");
        await waitFor(() => expect(status.textContent).toBe("4 matches"));
        setCount(0);
        flush();
        await waitFor(() => expect(status.textContent).toBe("No matches"));
    });
});
