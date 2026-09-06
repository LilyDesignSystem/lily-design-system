import { afterEach, describe, expect, test } from "vitest";

import { EndNotes } from "./end-notes.js";

if (!customElements.get("lily-end-notes")) {
    customElements.define("lily-end-notes", EndNotes);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EndNotes", () => {
    test("renders a native section", () => {
        const host = render("<lily-end-notes></lily-end-notes>");

        expect(host.querySelector("section.end-notes")).toBeTruthy();
    });

    test("defaults aria-label to 'End notes'", () => {
        const host = render("<lily-end-notes></lily-end-notes>");

        expect(host.querySelector("section")!.getAttribute("aria-label")).toBe("End notes");
    });

    test("uses label as the accessible name when provided", () => {
        const host = render('<lily-end-notes label="Sources"></lily-end-notes>');

        expect(host.querySelector("section")!.getAttribute("aria-label")).toBe("Sources");
    });

    test("moves its children into the section", () => {
        const host = render('<lily-end-notes><p id="note"></p></lily-end-notes>');

        expect(host.querySelector("section > #note")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-end-notes class="extra"></lily-end-notes>');

        expect(host.querySelector("section")!.className).toBe("end-notes extra");
    });
});
