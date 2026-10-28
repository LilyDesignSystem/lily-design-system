import { render, screen } from "@testing-library/vue";
import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import Subject from "../../components/TourList.vue";

describe("TourList", () => {
    test("renders dialog when active", () => {
        render(Subject, {
            props: { label: "Getting started", active: true },
            slots: { default: "Welcome" },
        });
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("does not render when not active", () => {
        render(Subject, {
            props: { label: "Getting started", active: false },
            slots: { default: "Welcome" },
        });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Onboarding tour", active: true },
            slots: { default: "content" },
        });
        expect(screen.getByLabelText("Onboarding tour")).toBeTruthy();
    });

    test("has aria-modal true", () => {
        render(Subject, { props: { label: "Tour", active: true }, slots: { default: "content" } });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has tabindex -1 for keyboard events", () => {
        render(Subject, { props: { label: "Tour", active: true }, slots: { default: "content" } });
        expect(screen.getByRole("dialog").getAttribute("tabindex")).toBe("-1");
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
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        await user.keyboard("{Escape}");
        await vi.waitFor(() => {
            expect(screen.queryByRole("dialog")).toBeNull();
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
