import { fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import Subject from "./Sheet.vue";

describe("Sheet", () => {
    test("not visible when closed", () => {
        render(Subject, {
            props: { label: "Settings", open: false },
            slots: { default: "content" },
        });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open", () => {
        render(Subject, {
            props: { label: "Settings", open: true },
            slots: { default: "content" },
        });
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Settings", open: true },
            slots: { default: "content" },
        });
        expect(screen.getByLabelText("Settings")).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(Subject, {
            props: { label: "Settings", open: true },
            slots: { default: "content" },
        });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(Subject, {
            props: { label: "S", open: true, side: "left" },
            slots: { default: "x" },
        });
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("closes on Escape", async () => {
        render(Subject, { props: { label: "S", open: true }, slots: { default: "content" } });
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await vi.waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "S", open: true, "data-testid": "sh" },
            slots: { default: "x" },
        });
        expect(screen.getByTestId("sh")).toBeTruthy();
    });
});

// Modality (tasks.md P18-T6): Sheet is a real modal, a <dialog> opened with showModal(). jsdom has no showModal, so it
// is stubbed on the prototype the way a browser behaves; the Tab trap and inert page are the browser's part and need a
// real engine, so here we assert showModal() is what opens it.
describe("Sheet modality", () => {
    const proto = HTMLDialogElement.prototype as unknown as {
        showModal?: () => void;
        close?: () => void;
    };
    let showModal: ReturnType<typeof vi.fn>;
    let trigger: HTMLButtonElement;
    const slots = { default: "<button>Inside</button>" };

    beforeEach(() => {
        showModal = vi.fn(function (this: HTMLDialogElement) {
            this.setAttribute("open", "");
        });
        proto.showModal = showModal as unknown as typeof proto.showModal;
        proto.close = vi.fn(function (this: HTMLDialogElement) {
            this.removeAttribute("open");
        }) as unknown as typeof proto.close;
        trigger = document.createElement("button");
        trigger.textContent = "Open";
        document.body.append(trigger);
        trigger.focus();
    });

    afterEach(() => {
        delete proto.showModal;
        delete proto.close;
        trigger.remove();
    });

    test("is a <dialog> opened with showModal() and says aria-modal", async () => {
        render(Subject, { props: { label: "L", open: true }, slots });
        await nextTick();
        const el = screen.getByRole("dialog");
        expect(el.tagName).toBe("DIALOG");
        expect(el.classList.contains("sheet")).toBe(true);
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    // Opened after mounting, as a trigger would: @testing-library/vue moves the mounted nodes once (unwrapping VTU's
    // div), which drops focus from anything focused during that first mount.
    test("opening moves focus inside", async () => {
        const { rerender } = render(Subject, { props: { label: "L", open: false }, slots });
        await rerender({ label: "L", open: true });
        await nextTick();
        expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    });

    test("the native cancel event (Escape) closes it", async () => {
        const { emitted } = render(Subject, { props: { label: "L", open: true }, slots });
        await nextTick();
        await fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(emitted()["update:open"]).toEqual([[false]]);
    });

    test("closing returns focus to the trigger", async () => {
        const { rerender } = render(Subject, { props: { label: "L", open: false }, slots });
        await rerender({ label: "L", open: true });
        await nextTick();
        expect(document.activeElement).not.toBe(trigger);
        await rerender({ label: "L", open: false });
        await nextTick();
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(document.activeElement).toBe(trigger);
    });
});
