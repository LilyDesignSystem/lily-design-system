import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Subject from "./Sheet";

describe("Sheet", () => {
    test("not visible when closed", () => {
        render(
            <Subject
                label="Settings"
                open={false}
            >
                content
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open", () => {
        render(
            <Subject
                label="Settings"
                open
            >
                content
            </Subject>,
        );
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(
            <Subject
                label="Settings"
                open
            >
                content
            </Subject>,
        );
        expect(screen.getByLabelText("Settings")).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(
            <Subject
                label="Settings"
                open
            >
                content
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(
            <Subject
                label="S"
                open
                side="left"
            >
                x
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("closes on Escape", async () => {
        render(
            <Subject
                label="S"
                open
            >
                content
            </Subject>,
        );
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        fireEvent.keyDown(dialog, { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                open
                data-testid="sh"
            >
                x
            </Subject>,
        );
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
            <Subject label="L" open>
                <button>Inside</button>
            </Subject>,
        );
        const el = screen.getByRole("dialog");
        expect(el.tagName).toBe("DIALOG");
        expect(el.classList.contains("sheet")).toBe(true);
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    test("opening moves focus inside", () => {
        render(
            <Subject label="L" open>
                <button>Inside</button>
            </Subject>,
        );
        expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    });

    test("the native cancel event (Escape) closes it and reports it", () => {
        const onChange = vi.fn();
        render(
            <Subject label="L" open onChange={onChange}>
                <button>Inside</button>
            </Subject>,
        );
        fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(onChange).toHaveBeenCalledWith(false);
    });

    test("closing returns focus to the trigger", () => {
        const { rerender } = render(
            <Subject label="L" open>
                <button>Inside</button>
            </Subject>,
        );
        expect(document.activeElement).not.toBe(trigger);
        rerender(
            <Subject label="L" open={false}>
                <button>Inside</button>
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(document.activeElement).toBe(trigger);
    });
});
