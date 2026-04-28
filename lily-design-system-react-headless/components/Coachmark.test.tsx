import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Coachmark";

describe("Coachmark", () => {
    test("renders as a non-modal dialog with the required title", () => {
        render(<Subject open title="Try this feature" dismissLabel="Dismiss" />);

        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(dialog).toBeTruthy();
        expect(dialog.getAttribute("aria-modal")).toBe("false");
    });

    test("applies the coachmark root class", () => {
        render(<Subject open title="Try this feature" dismissLabel="Dismiss" />);

        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(dialog.className.includes("coachmark")).toBe(true);
    });

    test("hides the dialog when open is false", () => {
        render(<Subject title="Try this feature" dismissLabel="Dismiss" />);

        const dialog: HTMLElement = screen.getByRole("dialog", { hidden: true });
        expect(dialog.hasAttribute("hidden")).toBe(true);
    });

    test("shows the dialog when open is true", () => {
        render(<Subject open title="Try this feature" dismissLabel="Dismiss" />);

        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(dialog.hasAttribute("hidden")).toBe(false);
    });

    test("links aria-labelledby to the rendered title id", () => {
        render(<Subject open title="Try this feature" dismissLabel="Dismiss" />);

        const dialog: HTMLElement = screen.getByRole("dialog");
        const labelledBy: string | null = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();
        const titleEl: Element | null = document.querySelector(`[id="${labelledBy}"]`);
        expect(titleEl).toBeTruthy();
        expect(titleEl?.textContent).toBe("Try this feature");
    });

    test("renders the description when provided and links aria-describedby", () => {
        render(
            <Subject
            open
            title="Try this feature"
            description="Click here to learn more"
            dismissLabel="Dismiss"
            />
        );

        const dialog: HTMLElement = screen.getByRole("dialog");
        const describedBy: string | null = dialog.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        const descEl: Element | null = document.querySelector(`[id="${describedBy}"]`);
        expect(descEl).toBeTruthy();
        expect(descEl?.textContent).toBe("Click here to learn more");
    });

    test("does not set aria-describedby when description is omitted", () => {
        render(<Subject open title="Try this feature" dismissLabel="Dismiss" />);

        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(dialog.getAttribute("aria-describedby")).toBeNull();
    });

    test("renders the dismiss button with the required aria-label", () => {
        render(<Subject open title="Try this feature" dismissLabel="Dismiss coachmark" />);

        const dismiss: HTMLElement = screen.getByRole("button", { name: "Dismiss coachmark" });
        expect(dismiss).toBeTruthy();
    });

    test("calls onDismiss when the dismiss button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleDismiss = vi.fn();
        render(
            <Subject
            open
            title="Try this feature"
            dismissLabel="Dismiss"
            onDismiss={handleDismiss}
            />
        );

        await user.click(screen.getByRole("button", { name: "Dismiss" }));
        expect(handleDismiss).toHaveBeenCalledOnce();
    });
});
