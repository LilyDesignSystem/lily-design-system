import { afterEach, describe, expect, test } from "vitest";

import { AlertDialog } from "./alert-dialog.js";

if (!customElements.get("lily-alert-dialog")) {
    customElements.define("lily-alert-dialog", AlertDialog);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AlertDialog", () => {
    test("renders role=alertdialog", () => {
        const host = render('<lily-alert-dialog title="Delete item" open></lily-alert-dialog>');

        expect(host.querySelector("dialog")!.getAttribute("role")).toBe("alertdialog");
    });

    test("always sets aria-modal=true", () => {
        const host = render('<lily-alert-dialog title="Delete item" open></lily-alert-dialog>');

        expect(host.querySelector("dialog")!.getAttribute("aria-modal")).toBe("true");
    });

    test("renders the title and references it via aria-labelledby", () => {
        const host = render('<lily-alert-dialog title="Delete item" open></lily-alert-dialog>');

        const dialog = host.querySelector("dialog") as HTMLDialogElement;
        const labelledbyId = dialog.getAttribute("aria-labelledby")!;
        expect(document.getElementById(labelledbyId)!.textContent).toBe("Delete item");
    });

    test("renders the description and references it via aria-describedby when present", () => {
        const host = render(
            '<lily-alert-dialog title="Delete item" description="This cannot be undone." open></lily-alert-dialog>',
        );

        const dialog = host.querySelector("dialog") as HTMLDialogElement;
        const describedbyId = dialog.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedbyId)!.textContent).toBe("This cannot be undone.");
    });

    test("omits aria-describedby when there is no description", () => {
        const host = render('<lily-alert-dialog title="Delete item" open></lily-alert-dialog>');

        expect(host.querySelector("dialog")!.hasAttribute("aria-describedby")).toBe(false);
    });

    test("does not handle Escape itself", () => {
        const host = render('<lily-alert-dialog title="Delete item" open></lily-alert-dialog>');
        const dialog = host.querySelector("dialog") as HTMLDialogElement;

        dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(dialog.open).toBe(true);
        expect(host.hasAttribute("open")).toBe(true);
    });
});
