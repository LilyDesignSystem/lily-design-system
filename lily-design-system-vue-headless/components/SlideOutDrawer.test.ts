import { fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import Subject from "./SlideOutDrawer.vue";

describe("SlideOutDrawer", () => {
    test("does not render when open is false", () => {
        render(Subject, { props: { label: "Drawer", open: false }, slots: { default: "Content" } });

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("renders when open is true", () => {
        render(Subject, { props: { label: "Drawer", open: true }, slots: { default: "Content" } });

        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, {
            props: { label: "Navigation", open: true },
            slots: { default: "Content" },
        });

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("aria-label")).toBe("Navigation");
    });

    test("has aria-modal set to true", () => {
        render(Subject, { props: { label: "Drawer", open: true }, slots: { default: "Content" } });

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    test("has tabindex for focus management", () => {
        render(Subject, { props: { label: "Drawer", open: true }, slots: { default: "Content" } });

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("renders children content", () => {
        render(Subject, {
            props: { label: "Drawer", open: true },
            slots: { default: "Drawer content" },
        });

        const el = screen.getByRole("dialog");
        expect(el.textContent).toContain("Drawer content");
    });

    test("closes on Escape key", async () => {
        render(Subject, { props: { label: "Drawer", open: true }, slots: { default: "Content" } });

        const el = screen.getByRole("dialog");
        await fireEvent.keyDown(el, { key: "Escape" });

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Drawer", open: true, "data-testid": "my-drawer" },
            slots: { default: "Content" },
        });

        expect(screen.getByTestId("my-drawer")).toBeTruthy();
    });

    test("renders as a dialog element", () => {
        render(Subject, { props: { label: "Drawer", open: true }, slots: { default: "Content" } });

        const el = screen.getByRole("dialog");
        expect(el.tagName).toBe("DIALOG");
    });
});

// Modality (tasks.md P18-T6): SlideOutDrawer is a real modal, a <dialog> opened with showModal(). jsdom has no showModal, so it
// is stubbed on the prototype the way a browser behaves; the Tab trap and inert page are the browser's part and need a
// real engine, so here we assert showModal() is what opens it.
describe("SlideOutDrawer modality", () => {
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
        expect(el.classList.contains("slide-out-drawer")).toBe(true);
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
