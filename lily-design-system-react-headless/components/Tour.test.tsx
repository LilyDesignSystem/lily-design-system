import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { useState, type ReactNode } from "react";

import Subject from "./Tour";

function ControlledTour(props: { label: string; children: ReactNode; [key: string]: unknown }) {
    const [active, setActive] = useState(true);
    return (
        <Subject
            {...props}
            active={active}
            onChange={setActive}
        />
    );
}

describe("Tour", () => {
    test("renders dialog when active", () => {
        render(
            <Subject
                label="Getting started"
                active
            >
                Tour content
            </Subject>,
        );
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("does not render when not active", () => {
        render(
            <Subject
                label="Getting started"
                active={false}
            >
                Tour content
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("defaults to not active", () => {
        render(<Subject label="Tour">content</Subject>);
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("has aria-label", () => {
        render(
            <Subject
                label="Onboarding tour"
                active
            >
                content
            </Subject>,
        );
        expect(screen.getByLabelText("Onboarding tour")).toBeTruthy();
    });

    test("has aria-modal true", () => {
        render(
            <Subject
                label="Tour"
                active
            >
                content
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has tabindex -1 for keyboard events", () => {
        render(
            <Subject
                label="Tour"
                active
            >
                content
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("tabindex")).toBe("-1");
    });

    test("renders children content", () => {
        render(
            <Subject
                label="Tour"
                active
            >
                Step content here
            </Subject>,
        );
        expect(screen.getByText("Step content here")).toBeTruthy();
    });

    test("closes on Escape key", async () => {
        const user = userEvent.setup();
        render(<ControlledTour label="Tour">content</ControlledTour>);
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        await user.keyboard("{Escape}");
        await vi.waitFor(() => {
            expect(screen.queryByRole("dialog")).toBeNull();
        });
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Tour"
                active
                data-testid="my-tour"
            >
                content
            </Subject>,
        );
        expect(screen.getByTestId("my-tour")).toBeTruthy();
    });
});
