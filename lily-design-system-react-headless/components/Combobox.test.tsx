import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Combobox";

describe("Combobox", () => {
    test("renders a combobox input", () => {
        render(<Subject label="Fruit">Content</Subject>);
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Search fruit">Content</Subject>);
        expect(screen.getByRole("combobox", { name: "Search fruit" })).toBeTruthy();
    });

    test("listbox hidden when closed", () => {
        render(
            <Subject
                label="Fruit"
                open={false}
            >
                Content
            </Subject>,
        );
        expect(screen.queryByRole("listbox")).toBeNull();
    });

    test("listbox shown when open", () => {
        render(
            <Subject
                label="Fruit"
                open
            >
                Content
            </Subject>,
        );
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-expanded", () => {
        render(
            <Subject
                label="Fruit"
                open
            >
                Content
            </Subject>,
        );
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="F"
                data-testid="cb"
            >
                Content
            </Subject>,
        );
        expect(screen.getByTestId("cb")).toBeTruthy();
    });

    test("Escape asks to close the listbox", () => {
        const onOpenChange = vi.fn();
        render(
            <Subject
                label="Fruit"
                open
                onOpenChange={onOpenChange}
            >
                <div role="option">Apple</div>
            </Subject>,
        );
        fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
