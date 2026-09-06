import { afterEach, describe, expect, test, vi } from "vitest";

import { Collapsible } from "./collapsible.js";

if (!customElements.get("lily-collapsible")) {
    customElements.define("lily-collapsible", Collapsible);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Collapsible", () => {
    test("renders native details/summary elements", () => {
        const host = render('<lily-collapsible summary="More info">Content here</lily-collapsible>');

        const details = host.querySelector("details.collapsible") as HTMLDetailsElement;
        expect(details).toBeTruthy();
        expect(details.querySelector("summary")!.textContent).toBe("More info");
    });

    test("closed by default", () => {
        const host = render('<lily-collapsible summary="More info">Content here</lily-collapsible>');

        expect((host.querySelector("details") as HTMLDetailsElement).open).toBe(false);
    });

    test("open attribute opens the details", () => {
        const host = render('<lily-collapsible summary="More info" open>Content here</lily-collapsible>');

        expect((host.querySelector("details") as HTMLDetailsElement).open).toBe(true);
    });

    test("moves original content after the summary", () => {
        const host = render('<lily-collapsible summary="More info">Content here</lily-collapsible>');

        const details = host.querySelector("details")!;
        expect(details.lastChild!.textContent).toBe("Content here");
    });

    test("native toggle reflects back to the host's open attribute and dispatches lily-change", () => {
        const host = render('<lily-collapsible summary="More info">Content here</lily-collapsible>');
        const details = host.querySelector("details") as HTMLDetailsElement;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        details.open = true;
        details.dispatchEvent(new Event("toggle"));

        expect(host.hasAttribute("open")).toBe(true);
        expect(handler).toHaveBeenCalled();
        expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ open: true });
    });

    test("external toggleAttribute API opens the details", () => {
        const host = render('<lily-collapsible summary="More info">Content here</lily-collapsible>');

        host.toggleAttribute("open", true);

        expect((host.querySelector("details") as HTMLDetailsElement).open).toBe(true);
    });
});
