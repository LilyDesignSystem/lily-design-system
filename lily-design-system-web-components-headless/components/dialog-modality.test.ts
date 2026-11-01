// Modality (tasks.md P14-T4): lily-dialog, lily-alert-dialog, lily-file-dialog and lily-timeout-dialog open their
// <dialog> with showModal() (lib/modal-dialog.ts). jsdom has no showModal, so it is stubbed on the prototype the way a
// browser behaves; the Tab trap and inert page are the browser's part and need a real engine, so here we assert
// showModal() is what opens them, focus moves in, the native cancel event is handled, and focus returns.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { AlertDialog } from "./alert-dialog.js";
import { Dialog } from "./dialog.js";
import { FileDialog } from "./file-dialog.js";
import { TimeoutDialog } from "./timeout-dialog.js";

for (const [tag, ctor] of [
    ["lily-dialog", Dialog],
    ["lily-alert-dialog", AlertDialog],
    ["lily-file-dialog", FileDialog],
    ["lily-timeout-dialog", TimeoutDialog],
] as const) {
    if (!customElements.get(tag)) customElements.define(tag, ctor);
}

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
    document.body.innerHTML = "";
    trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
});

afterEach(() => {
    delete proto.showModal;
    delete proto.close;
    document.body.innerHTML = "";
});

function mount(html: string): { host: HTMLElement; dialog: HTMLDialogElement } {
    document.body.insertAdjacentHTML("beforeend", html);
    const host = document.body.lastElementChild as HTMLElement;
    return { host, dialog: host.querySelector("dialog") as HTMLDialogElement };
}

const cases = [
    { tag: "lily-dialog", attrs: 'label="L"', closesOnCancel: true },
    { tag: "lily-alert-dialog", attrs: 'title="T"', closesOnCancel: true },
    { tag: "lily-file-dialog", attrs: 'label="L"', closesOnCancel: true },
    { tag: "lily-timeout-dialog", attrs: 'title="T"', closesOnCancel: false },
];

for (const c of cases) {
    describe(`${c.tag} modality`, () => {
        test("opens with showModal() when open is set, moves focus inside, and returns it on close", () => {
            const { host, dialog } = mount(
                `<${c.tag} ${c.attrs}><button>Inside</button></${c.tag}>`,
            );
            expect(dialog.open).toBe(false);
            host.setAttribute("open", "");
            expect(showModal).toHaveBeenCalledTimes(1);
            expect(dialog.open).toBe(true);
            expect(dialog.contains(document.activeElement)).toBe(true);
            host.removeAttribute("open");
            expect(dialog.open).toBe(false);
            expect(document.activeElement).toBe(trigger);
        });

        test(
            c.closesOnCancel
                ? "the native cancel event (Escape) removes open and dispatches lily-close"
                : "the native cancel event (Escape) dispatches lily-cancel and leaves it open",
            () => {
                const { host, dialog } = mount(
                    `<${c.tag} ${c.attrs} open><button>Inside</button></${c.tag}>`,
                );
                const events: string[] = [];
                host.addEventListener("lily-close", () => events.push("close"));
                host.addEventListener("lily-cancel", () => events.push("cancel"));
                const cancel = new Event("cancel", { cancelable: true });
                dialog.dispatchEvent(cancel);
                expect(cancel.defaultPrevented).toBe(true);
                expect(host.hasAttribute("open")).toBe(!c.closesOnCancel);
                expect(dialog.open).toBe(!c.closesOnCancel);
                expect(events).toEqual([c.closesOnCancel ? "close" : "cancel"]);
            },
        );
    });
}

test('lily-dialog with modal="false" opens with the open attribute, not showModal()', () => {
    const { dialog } = mount(
        '<lily-dialog label="L" modal="false" open><button>Inside</button></lily-dialog>',
    );
    expect(showModal).not.toHaveBeenCalled();
    expect(dialog.open).toBe(true);
    expect(dialog.hasAttribute("aria-modal")).toBe(false);
});
