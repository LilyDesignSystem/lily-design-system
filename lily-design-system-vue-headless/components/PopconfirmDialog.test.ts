import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./PopconfirmDialog.vue";


describe("PopconfirmDialog", () => {
    const baseProps = {
        title: "Delete this item?",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
    };

    test("renders root with popconfirm-dialog class and alertdialog role", () => {
        const { container } = render(Subject, { props: { ...baseProps, open: true } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.classList.contains("popconfirm-dialog")).toBe(true);
        expect(root.getAttribute("role")).toBe("alertdialog");
    });

    test("aria-modal is false (non-modal popover)", () => {
        const { container } = render(Subject, { props: { ...baseProps, open: true } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-modal")).toBe("false");
    });

    test("hidden when open is false", () => {
        const { container } = render(Subject, { props: { ...baseProps, open: false } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(true);
    });

    test("not hidden when open is true", () => {
        const { container } = render(Subject, { props: { ...baseProps, open: true } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(false);
    });

    test("renders title and links via aria-labelledby", () => {
        const { container } = render(Subject, { props: { ...baseProps, open: true } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        const labelledby: string | null = root.getAttribute("aria-labelledby");
        expect(labelledby).toBeTruthy();
        const title: HTMLElement = container.querySelector(`#${labelledby}`) as HTMLElement;
        expect(title.classList.contains("popconfirm-dialog-title")).toBe(true);
        expect(title.textContent).toContain("Delete this item?");
    });

    test("renders description and links via aria-describedby when present", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, open: true, description: "Cannot be undone." },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        const describedby: string | null = root.getAttribute("aria-describedby");
        expect(describedby).toBeTruthy();
        const desc: HTMLElement = container.querySelector(`#${describedby}`) as HTMLElement;
        expect(desc.textContent).toContain("Cannot be undone.");
    });

    test("omits aria-describedby when description is not provided", () => {
        const { container } = render(Subject, { props: { ...baseProps, open: true } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-describedby")).toBeNull();
    });

    test("renders confirm and cancel buttons with provided labels", () => {
        render(Subject, { props: { ...baseProps, open: true } });

        expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
    });

    test("emits confirm when confirm button activated", async () => {
        const user: UserEvent = userEvent.setup();
        const onConfirm = vi.fn();
        render(Subject, { props: { ...baseProps, open: true, onConfirm } });

        await user.click(screen.getByRole("button", { name: "Delete" }));
        expect(onConfirm).toHaveBeenCalledOnce();
    });

    test("emits cancel when cancel button activated", async () => {
        const user: UserEvent = userEvent.setup();
        const onCancel = vi.fn();
        render(Subject, { props: { ...baseProps, open: true, onCancel } });

        await user.click(screen.getByRole("button", { name: "Cancel" }));
        expect(onCancel).toHaveBeenCalledOnce();
    });

    test("generates unique title and description ids per instance", () => {
        const { container: c1 } = render(Subject, {
            props: { ...baseProps, open: true, description: "x" },
        });
        const { container: c2 } = render(Subject, {
            props: { ...baseProps, open: true, description: "y" },
        });

        const id1: string | null = (c1.firstElementChild as HTMLElement).getAttribute("aria-labelledby");
        const id2: string | null = (c2.firstElementChild as HTMLElement).getAttribute("aria-labelledby");
        expect(id1).toBeTruthy();
        expect(id2).toBeTruthy();
        expect(id1).not.toBe(id2);
    });
});
