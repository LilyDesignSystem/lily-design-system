import { afterEach, describe, expect, test } from "vitest";

import { EireIndividualHealthIdentifierView } from "./eire-individual-health-identifier-view.js";

if (!customElements.get("lily-eire-individual-health-identifier-view")) {
    customElements.define("lily-eire-individual-health-identifier-view", EireIndividualHealthIdentifierView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EireIndividualHealthIdentifierView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-eire-individual-health-identifier-view label="Individual Health Identifier (IHI)" value="1234567890"></lily-eire-individual-health-identifier-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("eire-individual-health-identifier-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-eire-individual-health-identifier-view label="Individual Health Identifier (IHI)" value="1234567890"></lily-eire-individual-health-identifier-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Individual Health Identifier (IHI)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-eire-individual-health-identifier-view label="Individual Health Identifier (IHI)" value="1234567890"></lily-eire-individual-health-identifier-view>') as unknown as EireIndividualHealthIdentifierView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("1234567890");
        expect(host.value).toBe("1234567890");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
