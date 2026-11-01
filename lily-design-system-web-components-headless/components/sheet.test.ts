import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Sheet } from "./sheet.js";

if (!customElements.get("lily-sheet")) {
    customElements.define("lily-sheet", Sheet);
}

// Modality (tasks.md P18-T6): the inner <dialog> is opened with showModal(). jsdom has no showModal, so it is
// stubbed on the prototype the way a browser behaves; the Tab trap and the inert page are the browser's part and need
// a real engine, so here we assert showModal() is what opens it.
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
});

afterEach(() => {
    delete proto.showModal;
    delete proto.close;
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = `<button id="trigger">Open</button>${html}`;
    trigger = document.getElementById("trigger") as HTMLButtonElement;
    return document.body.lastElementChild as HTMLElement;
}

const inner = (host: HTMLElement) => host.querySelector("dialog") as HTMLDialogElement;

describe("Sheet", () => {
    test("renders an inner <dialog> carrying the base class, aria-modal=true and tabindex=-1", () => {
        const host = render('<lily-sheet label="Navigation"></lily-sheet>');
        const dialog = inner(host);
        expect(dialog.tagName).toBe("DIALOG");
        expect(dialog.className).toBe("sheet");
        expect(dialog.getAttribute("aria-modal")).toBe("true");
        expect(dialog.tabIndex).toBe(-1);
        expect(host.hasAttribute("role")).toBe(false);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-sheet label="Navigation"></lily-sheet>');
        expect(inner(host).getAttribute("aria-label")).toBe("Navigation");
    });

    test("appends the consumer class and passes other attributes through", () => {
        const host = render('<lily-sheet label="L" class="extra" data-testid="x"></lily-sheet>');
        expect(inner(host).className).toBe("sheet extra");
        expect(inner(host).getAttribute("data-testid")).toBe("x");
    });

    test("defaults data-side to right and reflects the side attribute on the dialog", () => {
        const host = render('<lily-sheet label="L"></lily-sheet>');
        expect(inner(host).getAttribute("data-side")).toBe("right");
        const other = render('<lily-sheet label="L" side="top"></lily-sheet>');
        expect(inner(other).getAttribute("data-side")).toBe("top");
    });

    test("is closed by default", () => {
        const host = render('<lily-sheet label="L"></lily-sheet>');
        expect(inner(host).open).toBe(false);
        expect(showModal).not.toHaveBeenCalled();
    });

    test("open opens it with showModal()", () => {
        const host = render('<lily-sheet label="L" open></lily-sheet>');
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(inner(host).open).toBe(true);
    });

    test("falls back to the open attribute where showModal is missing", () => {
        delete proto.showModal;
        const host = render('<lily-sheet label="L" open></lily-sheet>');
        expect(inner(host).hasAttribute("open")).toBe(true);
    });

    test("opening moves focus inside", () => {
        const host = render('<lily-sheet label="L"><button>Inside</button></lily-sheet>');
        trigger.focus();
        host.toggleAttribute("open", true);
        expect(inner(host).contains(document.activeElement)).toBe(true);
    });

    test("Escape closes it and fires lily-close", () => {
        const host = render('<lily-sheet label="L" open></lily-sheet>');
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);
        inner(host).dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        expect(host.hasAttribute("open")).toBe(false);
        expect(inner(host).open).toBe(false);
        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("the native cancel event (Escape) closes it", () => {
        const host = render('<lily-sheet label="L" open></lily-sheet>');
        const cancel = new Event("cancel", { cancelable: true });
        inner(host).dispatchEvent(cancel);
        expect(cancel.defaultPrevented).toBe(true);
        expect(host.hasAttribute("open")).toBe(false);
    });

    test("closing returns focus to the trigger", () => {
        const host = render('<lily-sheet label="L"><button>Inside</button></lily-sheet>');
        trigger.focus();
        host.toggleAttribute("open", true);
        expect(document.activeElement).not.toBe(trigger);
        host.removeAttribute("open");
        expect(inner(host).open).toBe(false);
        expect(document.activeElement).toBe(trigger);
    });

    test("keeps consumer content inside the dialog", () => {
        const host = render('<lily-sheet label="L" open><nav>Menu content</nav></lily-sheet>');
        expect(inner(host).querySelector("nav")?.textContent).toBe("Menu content");
    });
});
