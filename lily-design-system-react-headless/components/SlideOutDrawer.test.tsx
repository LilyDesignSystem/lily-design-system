import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Subject from "./SlideOutDrawer";

describe("SlideOutDrawer", () => {
    test("does not render when open is false", () => {
        render(
            <Subject
                label="Drawer"
                open={false}
            >
                Content
            </Subject>,
        );

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("renders when open is true", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(
            <Subject
                label="Navigation"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("aria-label")).toBe("Navigation");
    });

    test("has aria-modal set to true", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    test("has tabindex for focus management", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("renders children content", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Drawer content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.textContent).toContain("Drawer content");
    });

    test("closes on Escape key", async () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        await fireEvent.keyDown(el, { key: "Escape" });

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Drawer"
                open
                data-testid="my-drawer"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("my-drawer")).toBeTruthy();
    });

    test("renders as a dialog element", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

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

    test("is a <dialog> opened with showModal() and says aria-modal", () => {
        render(
            <Subject
                label="L"
                open
            >
                <button>Inside</button>
            </Subject>,
        );
        const el = screen.getByRole("dialog");
        expect(el.tagName).toBe("DIALOG");
        expect(el.classList.contains("slide-out-drawer")).toBe(true);
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    test("opening moves focus inside", () => {
        render(
            <Subject
                label="L"
                open
            >
                <button>Inside</button>
            </Subject>,
        );
        expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    });

    test("the native cancel event (Escape) closes it and reports it", () => {
        const onChange = vi.fn();
        render(
            <Subject
                label="L"
                open
                onOpenChange={onChange}
            >
                <button>Inside</button>
            </Subject>,
        );
        fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(onChange).toHaveBeenCalledWith(false);
    });

    test("closing returns focus to the trigger", () => {
        const { rerender } = render(
            <Subject
                label="L"
                open
            >
                <button>Inside</button>
            </Subject>,
        );
        expect(document.activeElement).not.toBe(trigger);
        rerender(
            <Subject
                label="L"
                open={false}
            >
                <button>Inside</button>
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(document.activeElement).toBe(trigger);
    });
});
