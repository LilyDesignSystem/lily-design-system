// Modality (tasks.md P14-T4): Dialog, AlertDialog, FileDialog and TimeoutDialog are real modals, <dialog> elements
// opened with showModal() (dialog.ts). jsdom has no showModal, so it is stubbed on the prototype the way a browser
// behaves; the Tab trap and inert page are the browser's part and need a real engine, so here we assert showModal()
// is what opens them, focus moves in, the native cancel event closes, and focus returns.
import { fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import AlertDialog from "./AlertDialog.vue";
import Dialog from "./Dialog.vue";
import FileDialog from "./FileDialog.vue";
import TimeoutDialog from "./TimeoutDialog.vue";

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

const SLOT = "<button>Inside</button>";
const cases = [
    { name: "Dialog", component: Dialog, role: "dialog", props: { label: "L" } },
    { name: "AlertDialog", component: AlertDialog, role: "alertdialog", props: { title: "T" } },
    { name: "FileDialog", component: FileDialog, role: "dialog", props: { label: "L" } },
];

for (const c of cases) {
    describe(`${c.name} modality`, () => {
        // Opened after mount, as in an app: testing-library mounts into a detached div and then moves it into the
        // document, which drops focus from anything focused during that first mount (see Drawer.test.ts).
        test("is a <dialog> opened with showModal(), and focus moves inside", async () => {
            const { rerender } = render(c.component, {
                props: { ...c.props, open: false },
                slots: { default: SLOT },
            });
            await rerender({ ...c.props, open: true });
            await nextTick();
            const el = screen.getByRole(c.role);
            expect(el.tagName).toBe("DIALOG");
            expect(showModal).toHaveBeenCalledTimes(1);
            expect(el.contains(document.activeElement)).toBe(true);
        });

        test("the native cancel event (Escape) writes open back to false", async () => {
            const update = vi.fn();
            render(c.component, {
                props: { ...c.props, open: true, "onUpdate:open": update },
                slots: { default: SLOT },
            });
            await nextTick();
            await fireEvent(screen.getByRole(c.role), new Event("cancel", { cancelable: true }));
            expect(update).toHaveBeenCalledWith(false);
        });

        test("closing returns focus to the opener", async () => {
            const { rerender } = render(c.component, {
                props: { ...c.props, open: true },
                slots: { default: SLOT },
            });
            await nextTick();
            expect(document.activeElement).not.toBe(trigger);
            await rerender({ ...c.props, open: false });
            await nextTick();
            expect(screen.queryByRole(c.role)).toBeNull();
            expect(document.activeElement).toBe(trigger);
        });
    });
}

describe("Dialog with modal false", () => {
    test("opens with the open attribute, not showModal()", async () => {
        render(Dialog, {
            props: { label: "L", open: true, modal: false },
            slots: { default: SLOT },
        });
        await nextTick();
        expect(showModal).not.toHaveBeenCalled();
        expect(screen.getByRole("dialog").hasAttribute("open")).toBe(true);
    });
});

describe("TimeoutDialog", () => {
    test("is an alertdialog, hidden until open, then opened with showModal(); closing returns focus", async () => {
        const { container, rerender } = render(TimeoutDialog, {
            props: { label: "Session timeout" },
            slots: { default: SLOT },
        });
        const el = container.querySelector("dialog.timeout-dialog") as HTMLDialogElement;
        expect(el.getAttribute("role")).toBe("alertdialog");
        expect(el.open).toBe(false);
        await rerender({ label: "Session timeout", open: true });
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(el.open).toBe(true);
        expect(el.contains(document.activeElement)).toBe(true);
        await rerender({ label: "Session timeout", open: false });
        expect(el.open).toBe(false);
        expect(document.activeElement).toBe(trigger);
    });

    test("mounted open, it is shown with showModal()", () => {
        const { container } = render(TimeoutDialog, {
            props: { label: "Session timeout", open: true },
            slots: { default: SLOT },
        });
        expect(showModal).toHaveBeenCalledTimes(1);
        expect((container.querySelector("dialog.timeout-dialog") as HTMLDialogElement).open).toBe(
            true,
        );
    });
});
