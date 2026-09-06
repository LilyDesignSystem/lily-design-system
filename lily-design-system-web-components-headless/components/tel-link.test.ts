import { afterEach, describe, expect, test } from "vitest";

import { TelLink } from "./tel-link.js";

if (!customElements.get("lily-tel-link")) {
    customElements.define("lily-tel-link", TelLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TelLink", () => {
    test("renders a tel anchor with the phone number as visible text", () => {
        const host = render('<lily-tel-link phone="+1-555-0100"></lily-tel-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("tel-link");
        expect(a.getAttribute("href")).toBe("tel:+1-555-0100");
        expect(a.textContent).toBe("+1-555-0100");
    });

    test("uses label as an aria-label override", () => {
        const host = render(
            '<lily-tel-link phone="+1-555-0100" label="Call customer support"></lily-tel-link>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Call customer support");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-tel-link phone="+1-555-0100" class="extra"></lily-tel-link>');

        expect(host.querySelector("a")!.className).toBe("tel-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-tel-link phone="+1-555-0100" data-testid="tel-link"></lily-tel-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("tel-link");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-tel-link phone="+1-555-0100"></lily-tel-link>');

        (host as unknown as TelLink).connectedCallback();

        expect(host.querySelectorAll("a.tel-link").length).toBe(1);
    });
});
