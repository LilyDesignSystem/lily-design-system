import { afterEach, describe, expect, test, vi } from "vitest";

import { PopconfirmDialog } from "./popconfirm-dialog.js";

if (!customElements.get("lily-popconfirm-dialog")) {
    customElements.define("lily-popconfirm-dialog", PopconfirmDialog);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PopconfirmDialog", () => {
    test("the custom element itself is the dialog (self-is-the-wrapper), non-modal", () => {
        const host = render(
            '<lily-popconfirm-dialog title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );

        expect(host.className).toBe("popconfirm-dialog");
        expect(host.getAttribute("role")).toBe("alertdialog");
        expect(host.getAttribute("aria-modal")).toBe("false");
    });

    test("hidden by default, visible when open", () => {
        const closed = render(
            '<lily-popconfirm-dialog title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );
        expect(closed.hidden).toBe(true);

        const open = render(
            '<lily-popconfirm-dialog open title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );
        expect(open.hidden).toBe(false);
    });

    test("title renders as h2 with a stable id referenced by aria-labelledby", () => {
        const host = render(
            '<lily-popconfirm-dialog title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );
        const title = host.querySelector("h2.popconfirm-dialog-title") as HTMLElement;

        expect(title.textContent).toBe("Delete file?");
        expect(host.getAttribute("aria-labelledby")).toBe(title.id);
    });

    test("description is rendered and referenced by aria-describedby only when provided", () => {
        const withDescription = render(
            '<lily-popconfirm-dialog title="Delete file?" description="This cannot be undone." confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );
        const description = withDescription.querySelector("p.popconfirm-dialog-description") as HTMLElement;
        expect(description.textContent).toBe("This cannot be undone.");
        expect(description.hidden).toBe(false);
        expect(withDescription.getAttribute("aria-describedby")).toBe(description.id);

        const withoutDescription = render(
            '<lily-popconfirm-dialog title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );
        expect(withoutDescription.hasAttribute("aria-describedby")).toBe(false);
        expect((withoutDescription.querySelector("p.popconfirm-dialog-description") as HTMLElement).hidden).toBe(true);
    });

    test("cancel and confirm buttons carry the correct classes, type, and labels", () => {
        const host = render(
            '<lily-popconfirm-dialog title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );
        const cancel = host.querySelector("button.popconfirm-dialog-cancel") as HTMLButtonElement;
        const confirm = host.querySelector("button.popconfirm-dialog-confirm") as HTMLButtonElement;

        expect(cancel.type).toBe("button");
        expect(cancel.textContent).toBe("Cancel");
        expect(confirm.type).toBe("button");
        expect(confirm.textContent).toBe("Delete");
    });

    test("confirming fires lily-confirm and closes", () => {
        const host = render(
            '<lily-popconfirm-dialog open title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-confirm", handler);

        (host.querySelector(".popconfirm-dialog-confirm") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalled();
        expect(host.hasAttribute("open")).toBe(false);
    });

    test("cancelling fires lily-cancel and closes", () => {
        const host = render(
            '<lily-popconfirm-dialog open title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-cancel", handler);

        (host.querySelector(".popconfirm-dialog-cancel") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalled();
        expect(host.hasAttribute("open")).toBe(false);
    });

    test("toggling the open attribute externally updates the hidden state", () => {
        const host = render(
            '<lily-popconfirm-dialog title="Delete file?" confirm-label="Delete" cancel-label="Cancel"></lily-popconfirm-dialog>',
        );

        host.toggleAttribute("open", true);

        expect(host.hidden).toBe(false);
    });
});
