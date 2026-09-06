import { afterEach, describe, expect, test } from "vitest";

import { AddressographBox } from "./addressograph-box.js";

if (!customElements.get("lily-addressograph-box")) {
    customElements.define("lily-addressograph-box", AddressographBox);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AddressographBox", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-addressograph-box>Jane Doe, NHS 123 456 7890</lily-addressograph-box>");

        expect(host.className).toBe("addressograph-box");
    });

    test("has no aria-label when label is absent", () => {
        const host = render("<lily-addressograph-box>Jane Doe</lily-addressograph-box>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as aria-label", () => {
        const host = render('<lily-addressograph-box label="Patient identification">Jane Doe</lily-addressograph-box>');

        expect(host.getAttribute("aria-label")).toBe("Patient identification");
    });

    test("preserves original content", () => {
        const host = render("<lily-addressograph-box>Jane Doe</lily-addressograph-box>");

        expect(host.textContent).toBe("Jane Doe");
    });

    test("class hook includes the consumer's class attribute", () => {
        const host = render('<lily-addressograph-box class="extra">Jane Doe</lily-addressograph-box>');

        expect(host.className).toBe("addressograph-box extra");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-addressograph-box>Jane Doe</lily-addressograph-box>");

        (host as unknown as AddressographBox).connectedCallback();

        expect(host.className).toBe("addressograph-box");
    });
});
