import { afterEach, describe, expect, test } from "vitest";

import { AustraliaIndividualHealthcareIdentifierView } from "./australia-individual-healthcare-identifier-view.js";

if (!customElements.get("lily-australia-individual-healthcare-identifier-view")) {
    customElements.define(
        "lily-australia-individual-healthcare-identifier-view",
        AustraliaIndividualHealthcareIdentifierView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AustraliaIndividualHealthcareIdentifierView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-australia-individual-healthcare-identifier-view label="ID"></lily-australia-individual-healthcare-identifier-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("australia-individual-healthcare-identifier-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-australia-individual-healthcare-identifier-view label="Individual Healthcare Identifier"></lily-australia-individual-healthcare-identifier-view>',
        );

        expect(
            host
                .querySelector("span .screen-reader-span")
                ?.textContent?.replace(
                    host
                        .querySelector("span .screen-reader-span")
                        ?.querySelector(".screen-reader-span")?.textContent ?? "",
                    "",
                ),
        ).toBe(`${"Individual Healthcare Identifier"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-australia-individual-healthcare-identifier-view label="ID" value="8003608833357361"></lily-australia-individual-healthcare-identifier-view>',
        ) as unknown as AustraliaIndividualHealthcareIdentifierView;

        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("8003608833357361");
        expect(host.value).toBe("8003608833357361");

        host.value = "changed";
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
