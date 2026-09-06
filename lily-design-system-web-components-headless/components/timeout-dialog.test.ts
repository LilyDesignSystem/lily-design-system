import { afterEach, describe, expect, test, vi } from "vitest";

import { TimeoutDialog } from "./timeout-dialog.js";

if (!customElements.get("lily-timeout-dialog")) {
    customElements.define("lily-timeout-dialog", TimeoutDialog);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TimeoutDialog", () => {
    test("renders a native dialog with role=alertdialog", () => {
        const host = render('<lily-timeout-dialog title="Session timeout" remaining-seconds="60" open></lily-timeout-dialog>');

        const dialog = host.querySelector("dialog") as HTMLDialogElement;
        expect(dialog.className).toBe("timeout-dialog");
        expect(dialog.getAttribute("role")).toBe("alertdialog");
        expect(dialog.open).toBe(true);
    });

    test("renders the title and references it via aria-labelledby", () => {
        const host = render('<lily-timeout-dialog title="Session timeout" remaining-seconds="60" open></lily-timeout-dialog>');

        const dialog = host.querySelector("dialog")!;
        const labelledbyId = dialog.getAttribute("aria-labelledby")!;
        expect(document.getElementById(labelledbyId)!.textContent).toBe("Session timeout");
    });

    test("exposes remaining-seconds as data-remaining-seconds", () => {
        const host = render('<lily-timeout-dialog title="Session timeout" remaining-seconds="45" open></lily-timeout-dialog>');

        expect(host.querySelector("dialog")!.getAttribute("data-remaining-seconds")).toBe("45");
    });

    test("updating remaining-seconds externally updates data-remaining-seconds", () => {
        const host = render('<lily-timeout-dialog title="Session timeout" remaining-seconds="45" open></lily-timeout-dialog>');

        host.setAttribute("remaining-seconds", "44");

        expect(host.querySelector("dialog")!.getAttribute("data-remaining-seconds")).toBe("44");
    });

    test("Escape does not close the dialog but fires lily-cancel", () => {
        const host = render('<lily-timeout-dialog title="Session timeout" remaining-seconds="60" open></lily-timeout-dialog>');
        const dialog = host.querySelector("dialog") as HTMLDialogElement;
        const handler = vi.fn();
        host.addEventListener("lily-cancel", handler);

        dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(handler).toHaveBeenCalled();
        expect(host.hasAttribute("open")).toBe(true);
        expect(dialog.open).toBe(true);
    });

    test("moves the consumer's action buttons into the dialog", () => {
        const host = render(
            '<lily-timeout-dialog title="Session timeout" remaining-seconds="60" open><button>Stay signed in</button></lily-timeout-dialog>',
        );

        expect(host.querySelector("dialog button")!.textContent).toBe("Stay signed in");
    });
});
