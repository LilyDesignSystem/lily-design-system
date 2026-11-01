// Modality (tasks.md P14-T4): Dialog, AlertDialog, FileDialog and TimeoutDialog are opened with showModal() by the
// ModalDialog directive (Dialog.ts). jsdom has no showModal, so it is stubbed on the prototype the way a browser
// behaves; the Tab trap and inert page are the browser's part and need a real engine, so here we assert showModal()
// is what opens them, focus moves in, the native cancel event closes, and focus returns.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { AlertDialog } from "./AlertDialog";
import { Dialog } from "./Dialog";
import { FileDialog } from "./FileDialog";
import { TimeoutDialog } from "./TimeoutDialog";

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

function mount(subject: Type<unknown>, inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(subject);
    document.body.append(fixture.nativeElement);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog") as HTMLDialogElement;
    // Something focusable inside, as a real dialog has.
    el.insertAdjacentHTML("beforeend", "<button>Inside</button>");
    return { fixture, el };
}

const cases: {
    name: string;
    subject: Type<unknown>;
    inputs: Record<string, unknown>;
    twoWay: boolean;
}[] = [
    { name: "Dialog", subject: Dialog, inputs: { label: "L" }, twoWay: true },
    { name: "AlertDialog", subject: AlertDialog, inputs: { title: "T" }, twoWay: true },
    { name: "FileDialog", subject: FileDialog, inputs: { label: "L" }, twoWay: true },
    { name: "TimeoutDialog", subject: TimeoutDialog, inputs: { label: "L" }, twoWay: false },
];

for (const c of cases) {
    describe(`${c.name} modality`, () => {
        test("opens with showModal() when open turns true, moves focus inside, and returns it on close", () => {
            const { fixture, el } = mount(c.subject, c.inputs);
            expect(el.open).toBe(false);
            fixture.componentRef.setInput("open", true);
            fixture.detectChanges();
            expect(showModal).toHaveBeenCalledTimes(1);
            expect(el.open).toBe(true);
            expect(el.contains(document.activeElement)).toBe(true);
            fixture.componentRef.setInput("open", false);
            fixture.detectChanges();
            expect(el.open).toBe(false);
            expect(document.activeElement).toBe(trigger);
            fixture.nativeElement.remove();
        });

        if (c.twoWay) {
            test("the native cancel event (Escape) writes open back to false", () => {
                const { fixture, el } = mount(c.subject, { ...c.inputs, open: true });
                const event = new Event("cancel", { cancelable: true });
                el.dispatchEvent(event);
                fixture.detectChanges();
                expect(event.defaultPrevented).toBe(true);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                expect((fixture.componentInstance as any).open()).toBe(false);
                expect(el.open).toBe(false);
                fixture.nativeElement.remove();
            });
        }
    });
}

test("Dialog with modal false opens with the open attribute, not showModal()", () => {
    const { el } = mount(Dialog, { label: "L", modal: false, open: true });
    expect(showModal).not.toHaveBeenCalled();
    expect(el.open).toBe(true);
});

test("AlertDialog is an alertdialog named by its title and described by its description", () => {
    const { el } = mount(AlertDialog, {
        title: "Delete file?",
        description: "This cannot be undone.",
    });
    expect(el.getAttribute("role")).toBe("alertdialog");
    expect(el.getAttribute("aria-modal")).toBe("true");
    expect(document.getElementById(el.getAttribute("aria-labelledby")!)?.textContent).toBe(
        "Delete file?",
    );
    expect(document.getElementById(el.getAttribute("aria-describedby")!)?.textContent).toBe(
        "This cannot be undone.",
    );
});

test("TimeoutDialog is an alertdialog", () => {
    expect(mount(TimeoutDialog, { label: "L" }).el.getAttribute("role")).toBe("alertdialog");
});
