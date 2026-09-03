import { afterEach, describe, expect, test } from "vitest";

import { WarningCallout } from "./warning-callout.js";

if (!customElements.get("lily-warning-callout")) {
    customElements.define("lily-warning-callout", WarningCallout);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("WarningCallout", () => {
    test("renders a native aside with role=alert", () => {
        const host = render("<lily-warning-callout>This action cannot be undone.</lily-warning-callout>");

        const aside = host.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("role")).toBe("alert");
        expect(aside.textContent).toBe("This action cannot be undone.");
    });

    test("label is optional and sets aria-label when present", () => {
        const withoutLabel = render("<lily-warning-callout>Careful.</lily-warning-callout>");
        expect(withoutLabel.querySelector("aside")!.hasAttribute("aria-label")).toBe(false);

        const withLabel = render('<lily-warning-callout label="Warning">Careful.</lily-warning-callout>');
        expect(withLabel.querySelector("aside")!.getAttribute("aria-label")).toBe("Warning");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-warning-callout>Careful.</lily-warning-callout>");

        (host as unknown as WarningCallout).connectedCallback();

        expect(host.querySelectorAll("aside").length).toBe(1);
    });
});
