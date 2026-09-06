import { afterEach, describe, expect, test, vi } from "vitest";

import { FileDialog } from "./file-dialog.js";

if (!customElements.get("lily-file-dialog")) {
    customElements.define("lily-file-dialog", FileDialog);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FileDialog", () => {
    test("renders a native dialog, closed by default", () => {
        const host = render('<lily-file-dialog label="Choose a file"></lily-file-dialog>');

        const dialog = host.querySelector("dialog") as HTMLDialogElement;
        expect(dialog.className).toBe("file-dialog");
        expect(dialog.open).toBe(false);
    });

    test("open attribute opens the dialog via the open property", () => {
        const host = render('<lily-file-dialog label="Choose a file" open></lily-file-dialog>');

        expect((host.querySelector("dialog") as HTMLDialogElement).open).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-file-dialog label="Choose a file" open></lily-file-dialog>');

        expect(host.querySelector("dialog")!.getAttribute("aria-label")).toBe("Choose a file");
    });

    test("aria-modal is always true", () => {
        const host = render('<lily-file-dialog label="Choose a file" open></lily-file-dialog>');

        expect(host.querySelector("dialog")!.getAttribute("aria-modal")).toBe("true");
    });

    test("Escape closes the dialog and dispatches lily-close", () => {
        const host = render('<lily-file-dialog label="Choose a file" open></lily-file-dialog>');
        const dialog = host.querySelector("dialog") as HTMLDialogElement;
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(false);
        expect(dialog.open).toBe(false);
        expect(handler).toHaveBeenCalled();
    });

    test("moves the consumer's children into the dialog", () => {
        const host = render('<lily-file-dialog label="Choose a file" open><ul><li>report.pdf</li></ul></lily-file-dialog>');

        expect(host.querySelector("dialog ul li")!.textContent).toBe("report.pdf");
    });
});
