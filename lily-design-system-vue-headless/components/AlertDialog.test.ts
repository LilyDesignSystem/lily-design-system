import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./AlertDialog.vue";

describe("AlertDialog", () => {
    test("is hidden when open is false", () => {
        render(Subject, {
            props: { open: false, title: "Confirm" },
            slots: { default: "Actions" },
        });

        const dialog: HTMLElement | null = screen.queryByRole("alertdialog");
        expect(dialog).toBeNull();
    });

    test("is visible when open is true", () => {
        render(Subject, { props: { open: true, title: "Confirm" }, slots: { default: "Actions" } });

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog).toBeTruthy();
    });

    test("has alertdialog role", () => {
        render(Subject, { props: { open: true, title: "Confirm" }, slots: { default: "Actions" } });

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.getAttribute("role")).toBe("alertdialog");
    });

    test("has aria-labelledby referencing the title", () => {
        render(Subject, {
            props: { open: true, title: "Delete Item" },
            slots: { default: "Actions" },
        });

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        const labelledBy: string | null = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();

        const titleElement: HTMLElement | null = document.getElementById(labelledBy!);
        expect(titleElement).toBeTruthy();
        expect(titleElement!.textContent).toContain("Delete Item");
    });

    test("has aria-describedby when description is provided", () => {
        render(Subject, {
            props: { open: true, title: "Delete", description: "This action cannot be undone." },
            slots: { default: "Actions" },
        });

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        const describedBy: string | null = dialog.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();

        const descElement: HTMLElement | null = document.getElementById(describedBy!);
        expect(descElement).toBeTruthy();
        expect(descElement!.textContent).toContain("This action cannot be undone.");
    });

    test("does not have aria-describedby when description is not provided", () => {
        render(Subject, { props: { open: true, title: "Confirm" }, slots: { default: "Actions" } });

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.getAttribute("aria-describedby")).toBeNull();
    });

    test("has aria-modal true", () => {
        render(Subject, { props: { open: true, title: "Confirm" }, slots: { default: "Actions" } });

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.getAttribute("aria-modal")).toBe("true");
    });

    test("renders title text", () => {
        render(Subject, { props: { open: true, title: "Warning" }, slots: { default: "Content" } });

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.textContent).toContain("Warning");
    });

    test("renders children content", () => {
        render(Subject, {
            props: { open: true, title: "Confirm" },
            slots: { default: "Are you sure you want to proceed?" },
        });

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog.textContent).toContain("Are you sure you want to proceed?");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { open: true, title: "Test", "data-testid": "custom-dialog" },
            slots: { default: "Content" },
        });

        const dialog: HTMLElement = screen.getByTestId("custom-dialog");
        expect(dialog).toBeTruthy();
    });
});
