import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./DataFilterForm.vue";

describe("DataFilterForm", () => {
    test("renders as a search form", () => {
        render(Subject, { props: { label: "Filter" }, slots: { default: "Controls" } });
        expect(screen.getByRole("search", { name: "Filter" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Filter results" }, slots: { default: "Controls" } });
        expect(screen.getByRole("search").getAttribute("aria-label")).toBe("Filter results");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Filter" }, slots: { default: "My controls" } });
        expect(screen.getByRole("search").textContent).toContain("My controls");
    });

    test("calls onsubmit and prevents default", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn();
        render(Subject, {
            props: { label: "Filter", onSubmit: handleSubmit },
            slots: { default: '<button type="submit">Apply</button>' },
        });

        await user.click(screen.getByRole("button", { name: "Apply" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });

    test("calls onreset when reset", async () => {
        const user: UserEvent = userEvent.setup();
        const handleReset = vi.fn();
        render(Subject, {
            props: { label: "Filter", onReset: handleReset },
            slots: { default: '<button type="reset">Reset</button>' },
        });

        await user.click(screen.getByRole("button", { name: "Reset" }));
        expect(handleReset).toHaveBeenCalledOnce();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Filter", "data-testid": "df" },
            slots: { default: "C" },
        });
        expect(screen.getByTestId("df")).toBeTruthy();
    });
});
