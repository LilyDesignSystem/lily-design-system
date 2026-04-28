import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Coachmark.vue";


describe("Coachmark", () => {
    test("renders as a dialog with the title and dismiss controls", () => {
        render(Subject, {
            props: { open: true, title: "New feature", dismissLabel: "Dismiss" },
        });

        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(dialog).toBeTruthy();
        expect(dialog.classList.contains("coachmark")).toBe(true);
    });

    test("has coachmark class on root", () => {
        render(Subject, {
            props: { open: true, title: "New feature", dismissLabel: "Dismiss" },
        });

        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(dialog.classList.contains("coachmark")).toBe(true);
    });

    test("aria-modal is false", () => {
        render(Subject, {
            props: { open: true, title: "New feature", dismissLabel: "Dismiss" },
        });

        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(dialog.getAttribute("aria-modal")).toBe("false");
    });

    test("renders the title in a heading and links it via aria-labelledby", () => {
        render(Subject, {
            props: { open: true, title: "New feature", dismissLabel: "Dismiss" },
        });

        const heading: HTMLElement = screen.getByRole("heading", { name: "New feature" });
        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(heading.classList.contains("coachmark-title")).toBe(true);
        expect(dialog.getAttribute("aria-labelledby")).toBe(heading.getAttribute("id"));
    });

    test("renders description and links it via aria-describedby when provided", () => {
        render(Subject, {
            props: {
                open: true,
                title: "New feature",
                description: "Try this out.",
                dismissLabel: "Dismiss",
            },
        });

        const desc: HTMLElement = screen.getByText("Try this out.");
        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(desc.classList.contains("coachmark-description")).toBe(true);
        expect(dialog.getAttribute("aria-describedby")).toBe(desc.getAttribute("id"));
    });

    test("omits aria-describedby when description is not provided", () => {
        render(Subject, {
            props: { open: true, title: "New feature", dismissLabel: "Dismiss" },
        });

        const dialog: HTMLElement = screen.getByRole("dialog");
        expect(dialog.getAttribute("aria-describedby")).toBeNull();
    });

    test("is hidden when open is false", () => {
        render(Subject, {
            props: { open: false, title: "New feature", dismissLabel: "Dismiss" },
        });

        const dialog: HTMLElement = screen.getByRole("dialog", { hidden: true });
        expect(dialog.hasAttribute("hidden")).toBe(true);
    });

    test("dismiss button has aria-label", () => {
        render(Subject, {
            props: { open: true, title: "New feature", dismissLabel: "Dismiss tip" },
        });

        const button: HTMLElement = screen.getByRole("button", { name: "Dismiss tip" });
        expect(button).toBeTruthy();
        expect(button.classList.contains("coachmark-dismiss")).toBe(true);
    });

    test("emits dismiss when the dismiss button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const onDismiss = vi.fn();
        render(Subject, {
            props: { open: true, title: "New feature", dismissLabel: "Dismiss", onDismiss },
        });

        await user.click(screen.getByRole("button", { name: "Dismiss" }));
        expect(onDismiss).toHaveBeenCalledOnce();
    });
});
