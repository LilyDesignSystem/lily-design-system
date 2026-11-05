import { fireEvent, render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Subject from "./Drawer";

describe("Drawer", () => {
    test("hidden when open is false", () => {
        render(
            <Subject
                label="Nav"
                open={false}
            >
                Content
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open is true", () => {
        render(
            <Subject
                label="Nav"
                open
            >
                Content
            </Subject>,
        );
        expect(screen.getByRole("dialog", { name: "Nav" })).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(
            <Subject
                label="Nav"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(
            <Subject
                label="Nav"
                open
                side="right"
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("right");
    });

    test("defaults to left side", () => {
        render(
            <Subject
                label="Nav"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("Escape closes the drawer", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Nav"
                open
            >
                C
            </Subject>,
        );
        screen.getByRole("dialog").focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("renders children", () => {
        render(
            <Subject
                label="Nav"
                open
            >
                Drawer content
            </Subject>,
        );
        expect(screen.getByRole("dialog").textContent).toContain("Drawer content");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Nav"
                open
                data-testid="dr"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("dr")).toBeTruthy();
    });
});

// Modality (tasks.md P18-T6): Drawer is a real modal, a <dialog> opened with showModal(). jsdom has no showModal, so it
// is stubbed on the prototype the way a browser behaves; the Tab trap and inert page are the browser's part and need a
// real engine, so here we assert showModal() is what opens it.
describe("Drawer modality", () => {
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
        expect(el.classList.contains("drawer")).toBe(true);
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
                onChange={onChange}
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
