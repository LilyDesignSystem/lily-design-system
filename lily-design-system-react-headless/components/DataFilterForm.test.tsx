import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./DataFilterForm";

describe("DataFilterForm", () => {
    test("renders as a search form", () => {
        render(<Subject label="Filter">Controls</Subject>);
        expect(screen.getByRole("search", { name: "Filter" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Filter results">Controls</Subject>);
        expect(screen.getByRole("search").getAttribute("aria-label")).toBe("Filter results");
    });

    test("renders children", () => {
        render(<Subject label="Filter">My controls</Subject>);
        expect(screen.getByRole("search").textContent).toContain("My controls");
    });

    test("calls onSubmit and prevents default", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn();
        render(
            <Subject
                label="Filter"
                onSubmit={handleSubmit}
            >
                <button type="submit">Apply</button>
            </Subject>,
        );

        await user.click(screen.getByRole("button", { name: "Apply" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });

    test("calls onReset when reset", async () => {
        const user: UserEvent = userEvent.setup();
        const handleReset = vi.fn();
        render(
            <Subject
                label="Filter"
                onReset={handleReset}
            >
                <button type="reset">Reset</button>
            </Subject>,
        );

        await user.click(screen.getByRole("button", { name: "Reset" }));
        expect(handleReset).toHaveBeenCalledOnce();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Filter"
                data-testid="df"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("df")).toBeTruthy();
    });
});
