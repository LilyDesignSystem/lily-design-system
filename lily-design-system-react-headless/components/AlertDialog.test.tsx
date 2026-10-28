import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./AlertDialog";

describe("AlertDialog", () => {
    test("is hidden when open is false", () => {
        render(
            <Subject
                open={false}
                title="Confirm"
            >
                Actions
            </Subject>,
        );

        const dialog: HTMLElement | null = screen.queryByRole("alertdialog");
        expect(dialog).toBeNull();
    });

    test("is visible when open is true", () => {
        render(
            <Subject
                open
                title="Confirm"
            >
                Actions
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog).toBeTruthy();
    });

    test("has alertdialog role", () => {
        render(
            <Subject
                open
                title="Confirm"
            >
                Actions
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.getAttribute("role")).toBe("alertdialog");
    });

    test("has aria-labelledby referencing the title", () => {
        render(
            <Subject
                open
                title="Delete Item"
            >
                Actions
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        const labelledBy: string | null = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();

        const titleElement: HTMLElement | null = document.getElementById(labelledBy!);
        expect(titleElement).toBeTruthy();
        expect(titleElement!.textContent).toContain("Delete Item");
    });

    test("has aria-describedby when description is provided", () => {
        render(
            <Subject
                open
                title="Delete"
                description="This action cannot be undone."
            >
                Actions
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        const describedBy: string | null = dialog.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();

        const descElement: HTMLElement | null = document.getElementById(describedBy!);
        expect(descElement).toBeTruthy();
        expect(descElement!.textContent).toContain("This action cannot be undone.");
    });

    test("does not have aria-describedby when description is not provided", () => {
        render(
            <Subject
                open
                title="Confirm"
            >
                Actions
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.getAttribute("aria-describedby")).toBeNull();
    });

    test("has aria-modal true", () => {
        render(
            <Subject
                open
                title="Confirm"
            >
                Actions
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.getAttribute("aria-modal")).toBe("true");
    });

    test("renders title text", () => {
        render(
            <Subject
                open
                title="Warning"
            >
                Content
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.textContent).toContain("Warning");
    });

    test("renders children content", () => {
        render(
            <Subject
                open
                title="Confirm"
            >
                Are you sure you want to proceed?
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.textContent).toContain("Are you sure you want to proceed?");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                open
                title="Test"
                data-testid="custom-dialog"
            >
                Content
            </Subject>,
        );

        const dialog: HTMLElement = screen.getByTestId("custom-dialog");
        expect(dialog).toBeTruthy();
    });
});
