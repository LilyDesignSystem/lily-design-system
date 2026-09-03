import { afterEach, describe, expect, test } from "vitest";

import { IconButton } from "./icon-button.js";

if (!customElements.get("lily-icon-button")) {
    customElements.define("lily-icon-button", IconButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IconButton", () => {
    test("renders as a native button with the label as aria-label", () => {
        const host = render('<lily-icon-button label="Close"><span aria-hidden="true">x</span></lily-icon-button>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.getAttribute("aria-label")).toBe("Close");
    });

    test("throws when label is missing (WCAG 4.1.2)", () => {
        // Deliberately not appended to the document: appending would run
        // connectedCallback via the custom-element reaction queue, which
        // reports a thrown error to the global rather than the caller.
        // Calling the method directly exercises the same guard clause as
        // an ordinary synchronous function call.
        const host = document.createElement("lily-icon-button");

        expect(() => (host as unknown as IconButton).connectedCallback()).toThrow(/label attribute/);
    });

    test("defaults to type button", () => {
        const host = render('<lily-icon-button label="Close"></lily-icon-button>');

        expect((host.querySelector("button") as HTMLButtonElement).type).toBe("button");
    });

    test("can be disabled", () => {
        const host = render('<lily-icon-button label="Close" disabled></lily-icon-button>');

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("renders aria-pressed only when present", () => {
        const host = render('<lily-icon-button label="Bold" pressed="true"></lily-icon-button>');

        expect(host.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
    });
});
