import { afterEach, describe, expect, test } from "vitest";

import { BackLink } from "./back-link.js";

if (!customElements.get("lily-back-link")) {
    customElements.define("lily-back-link", BackLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BackLink", () => {
    test("renders a native anchor with the given href", () => {
        const host = render('<lily-back-link href="/previous">Back</lily-back-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.getAttribute("href")).toBe("/previous");
        expect(a.textContent).toBe("Back");
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-back-link href="/previous" label="Back to results">Back</lily-back-link>');

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Back to results");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-back-link href="/x" class="extra">Back</lily-back-link>');

        expect(host.querySelector("a")!.className).toBe("back-link extra");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-back-link href="/x">Back</lily-back-link>');

        (host as unknown as BackLink).connectedCallback();

        expect(host.querySelectorAll("a.back-link").length).toBe(1);
    });
});
