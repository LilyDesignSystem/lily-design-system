import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./PopconfirmDialog";

describe("PopconfirmDialog", () => {
    test("renders an alertdialog with the popconfirm-dialog root class", () => {
        render(
            <Subject
                open
                title="Delete?"
                confirmLabel="Yes"
                cancelLabel="No"
            />
        );

        const dialog: HTMLElement = screen.getByRole("alertdialog");
        expect(dialog).toBeTruthy();
        expect(dialog.className.includes("popconfirm-dialog")).toBe(true);
    });

    test("aria-modal is false (popconfirm is non-modal)", () => {
        render(
            <Subject open title="t" confirmLabel="y" cancelLabel="n" />
        );
        expect(screen.getByRole("alertdialog").getAttribute("aria-modal")).toBe("false");
    });

    test("hidden when open=false", () => {
        const { container } = render(
            <Subject title="t" confirmLabel="y" cancelLabel="n" />
        );
        const dialog: HTMLElement = container.querySelector(".popconfirm-dialog") as HTMLElement;
        expect(dialog.hasAttribute("hidden")).toBe(true);
    });

    test("aria-labelledby points at the title element", () => {
        render(
            <Subject open title="Delete?" confirmLabel="y" cancelLabel="n" />
        );
        const dialog: HTMLElement = screen.getByRole("alertdialog");
        const labelledBy: string | null = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();

        const titleEl: HTMLElement | null = document.getElementById(labelledBy as string);
        expect(titleEl).toBeTruthy();
        expect(titleEl?.textContent).toBe("Delete?");
    });

    test("aria-describedby points at the description when present", () => {
        render(
            <Subject
                open
                title="t"
                description="cannot be undone"
                confirmLabel="y"
                cancelLabel="n"
            />
        );
        const dialog: HTMLElement = screen.getByRole("alertdialog");
        const describedBy: string | null = dialog.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        const descEl: HTMLElement | null = document.getElementById(describedBy as string);
        expect(descEl?.textContent).toBe("cannot be undone");
    });

    test("aria-describedby is not set when no description", () => {
        render(<Subject open title="t" confirmLabel="y" cancelLabel="n" />);
        expect(screen.getByRole("alertdialog").getAttribute("aria-describedby")).toBeNull();
    });

    test("renders confirm and cancel buttons with provided labels", () => {
        render(
            <Subject open title="t" confirmLabel="Yes, delete" cancelLabel="Keep it" />
        );
        expect(screen.getByRole("button", { name: "Yes, delete" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Keep it" })).toBeTruthy();
    });

    test("invokes onConfirm when confirm clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleConfirm = vi.fn();
        render(
            <Subject
                open
                title="t"
                confirmLabel="Yes"
                cancelLabel="No"
                onConfirm={handleConfirm}
            />
        );
        await user.click(screen.getByRole("button", { name: "Yes" }));
        expect(handleConfirm).toHaveBeenCalledOnce();
    });

    test("invokes onCancel when cancel clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleCancel = vi.fn();
        render(
            <Subject
                open
                title="t"
                confirmLabel="Yes"
                cancelLabel="No"
                onCancel={handleCancel}
            />
        );
        await user.click(screen.getByRole("button", { name: "No" }));
        expect(handleCancel).toHaveBeenCalledOnce();
    });
});
