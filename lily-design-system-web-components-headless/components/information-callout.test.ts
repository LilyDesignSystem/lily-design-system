import { afterEach, describe, expect, test } from "vitest";

import { InformationCallout } from "./information-callout.js";

if (!customElements.get("lily-information-callout")) {
    customElements.define("lily-information-callout", InformationCallout);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("InformationCallout", () => {
    test("renders a native aside with role=note", () => {
        const host = render('<lily-information-callout label="Tip">Save often.</lily-information-callout>');

        const aside = host.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("role")).toBe("note");
        expect(aside.textContent).toBe("Save often.");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-information-callout label="Tip">Save often.</lily-information-callout>');

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("Tip");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-information-callout label="Tip" class="extra">Save often.</lily-information-callout>');

        expect(host.querySelector("aside")!.className).toBe("information-callout extra");
    });
});
