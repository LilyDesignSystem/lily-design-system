import { afterEach, describe, expect, test, vi } from "vitest";

import { Dialog } from "./dialog.js";

if (!customElements.get("lily-dialog")) {
    customElements.define("lily-dialog", Dialog);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Dialog", () => {
    test("renders a native dialog, closed by default", () => {
        const host = render('<lily-dialog label="Settings"></lily-dialog>');

        const dialog = host.querySelector("dialog") as HTMLDialogElement;
        expect(dialog.open).toBe(false);
    });

    test("open attribute opens the dialog via the open property, not showModal", () => {
        const host = render('<lily-dialog label="Settings" open></lily-dialog>');

        expect((host.querySelector("dialog") as HTMLDialogElement).open).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-dialog label="Settings" open></lily-dialog>');

        expect(host.querySelector("dialog")!.getAttribute("aria-label")).toBe("Settings");
    });

    test("defaults aria-modal to true", () => {
        const host = render('<lily-dialog label="Settings" open></lily-dialog>');

        expect(host.querySelector("dialog")!.getAttribute("aria-modal")).toBe("true");
    });

    test("modal=false omits aria-modal entirely", () => {
        const host = render('<lily-dialog label="Settings" open modal="false"></lily-dialog>');

        expect(host.querySelector("dialog")!.hasAttribute("aria-modal")).toBe(false);
    });

    test("Escape closes the dialog and dispatches lily-close", () => {
        const host = render('<lily-dialog label="Settings" open></lily-dialog>');
        const dialog = host.querySelector("dialog") as HTMLDialogElement;
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(false);
        expect(dialog.open).toBe(false);
        expect(handler).toHaveBeenCalled();
    });

    test("toggling the open attribute externally updates the rendered dialog", () => {
        const host = render('<lily-dialog label="Settings"></lily-dialog>');

        host.toggleAttribute("open", true);

        expect((host.querySelector("dialog") as HTMLDialogElement).open).toBe(true);
    });
});
