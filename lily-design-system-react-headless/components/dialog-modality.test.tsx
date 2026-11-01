// Modality (tasks.md P14-T4): Dialog, AlertDialog, FileDialog and TimeoutDialog are real modals, <dialog> elements
// opened with showModal() (useModalDialog in Dialog.tsx). jsdom has no showModal, so it is stubbed on the prototype
// the way a browser behaves; the Tab trap and inert page are the browser's part and need a real engine, so here we
// assert showModal() is what opens them, focus moves in, the native cancel event closes, and focus returns.
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import AlertDialog from "./AlertDialog";
import Dialog from "./Dialog";
import FileDialog from "./FileDialog";
import TimeoutDialog from "./TimeoutDialog";

const proto = HTMLDialogElement.prototype as unknown as {
    showModal?: () => void;
    close?: () => void;
};
let showModal: ReturnType<typeof vi.fn>;
let trigger: HTMLButtonElement;

beforeEach(() => {
    showModal = vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
    });
    proto.showModal = showModal as unknown as typeof proto.showModal;
    proto.close = vi.fn(function (this: HTMLDialogElement) {
        this.removeAttribute("open");
    }) as unknown as typeof proto.close;
    trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
});

afterEach(() => {
    delete proto.showModal;
    delete proto.close;
    trigger.remove();
});

const inside = <button>Inside</button>;
const cases = [
    {
        name: "Dialog",
        role: "dialog",
        el: (open: boolean, onChange?: (v: boolean) => void) => (
            <Dialog
                label="L"
                open={open}
                onChange={onChange}
            >
                {inside}
            </Dialog>
        ),
    },
    {
        name: "AlertDialog",
        role: "alertdialog",
        el: (open: boolean, onChange?: (v: boolean) => void) => (
            <AlertDialog
                title="T"
                open={open}
                onChange={onChange}
            >
                {inside}
            </AlertDialog>
        ),
    },
    {
        name: "FileDialog",
        role: "dialog",
        el: (open: boolean, onChange?: (v: boolean) => void) => (
            <FileDialog
                label="L"
                open={open}
                onChange={onChange}
            >
                {inside}
            </FileDialog>
        ),
    },
];

for (const c of cases) {
    describe(`${c.name} modality`, () => {
        test("is a <dialog> opened with showModal(), and focus moves inside", () => {
            render(c.el(true));
            const el = screen.getByRole(c.role);
            expect(el.tagName).toBe("DIALOG");
            expect(showModal).toHaveBeenCalledTimes(1);
            expect(el.contains(document.activeElement)).toBe(true);
        });

        test("the native cancel event (Escape) reports the close", () => {
            const onChange = vi.fn();
            render(c.el(true, onChange));
            fireEvent(screen.getByRole(c.role), new Event("cancel", { cancelable: true }));
            expect(onChange).toHaveBeenCalledWith(false);
        });

        test("closing returns focus to the opener", () => {
            const { rerender } = render(c.el(true));
            expect(document.activeElement).not.toBe(trigger);
            rerender(c.el(false));
            expect(screen.queryByRole(c.role)).toBeNull();
            expect(document.activeElement).toBe(trigger);
        });
    });
}

describe("Dialog with modal={false}", () => {
    test("opens with the open attribute, not showModal()", () => {
        render(
            <Dialog
                label="L"
                open
                modal={false}
            >
                {inside}
            </Dialog>,
        );
        expect(showModal).not.toHaveBeenCalled();
        expect(screen.getByRole("dialog").hasAttribute("open")).toBe(true);
    });
});

describe("TimeoutDialog", () => {
    test("is an alertdialog, hidden until open, then opened with showModal(); closing returns focus", () => {
        const { container, rerender } = render(
            <TimeoutDialog label="Session timeout">{inside}</TimeoutDialog>,
        );
        const el = container.querySelector("dialog.timeout-dialog") as HTMLDialogElement;
        expect(el.getAttribute("role")).toBe("alertdialog");
        expect(el.open).toBe(false);
        rerender(
            <TimeoutDialog
                label="Session timeout"
                open
            >
                {inside}
            </TimeoutDialog>,
        );
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(el.open).toBe(true);
        expect(el.contains(document.activeElement)).toBe(true);
        rerender(<TimeoutDialog label="Session timeout">{inside}</TimeoutDialog>);
        expect(el.open).toBe(false);
        expect(document.activeElement).toBe(trigger);
    });
});
