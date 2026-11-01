import { render, screen } from "@testing-library/vue";
import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import Subject from "./TourList.vue";

describe("TourList", () => {
    test("renders dialog when active", () => {
        render(Subject, {
            props: { label: "Getting started", active: true },
            slots: { default: "Welcome" },
        });
        expect(screen.getByRole("list")).toBeTruthy();
    });

    test("does not render when not active", () => {
        render(Subject, {
            props: { label: "Getting started", active: false },
            slots: { default: "Welcome" },
        });
        expect(screen.queryByRole("list")).toBeNull();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Onboarding tour", active: true },
            slots: { default: "content" },
        });
        expect(screen.getByLabelText("Onboarding tour")).toBeTruthy();
    });

    test("is a plain ordered list: no role=dialog, no aria-modal (P18-T6)", () => {
        render(Subject, { props: { label: "Tour", active: true }, slots: { default: "content" } });
        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
        expect(list.hasAttribute("role")).toBe(false);
        expect(list.hasAttribute("aria-modal")).toBe(false);
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("has tabindex -1 for keyboard events", () => {
        render(Subject, { props: { label: "Tour", active: true }, slots: { default: "content" } });
        expect(screen.getByRole("list").getAttribute("tabindex")).toBe("-1");
    });

    test("renders children content", () => {
        render(Subject, {
            props: { label: "Tour", active: true },
            slots: { default: "Step content here" },
        });
        expect(screen.getByText("Step content here")).toBeTruthy();
    });

    test("closes on Escape key", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Tour", active: true }, slots: { default: "content" } });
        const dialog = screen.getByRole("list");
        dialog.focus();
        await user.keyboard("{Escape}");
        await vi.waitFor(() => {
            expect(screen.queryByRole("list")).toBeNull();
        });
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Tour", active: true, "data-testid": "my-tour" },
            slots: { default: "content" },
        });
        expect(screen.getByTestId("my-tour")).toBeTruthy();
    });
});
