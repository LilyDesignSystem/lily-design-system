import { afterEach, describe, expect, test } from "vitest";

import { Footer } from "./footer.js";

if (!customElements.get("lily-footer")) {
    customElements.define("lily-footer", Footer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Footer", () => {
    test("renders a native footer", () => {
        const host = render("<lily-footer></lily-footer>");

        expect(host.querySelector("footer.footer")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-footer></lily-footer>");

        expect(host.querySelector("footer")!.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as the accessible name when provided", () => {
        const host = render('<lily-footer label="Site footer"></lily-footer>');

        expect(host.querySelector("footer")!.getAttribute("aria-label")).toBe("Site footer");
    });

    test("moves its children into the footer", () => {
        const host = render('<lily-footer><p id="copyright"></p></lily-footer>');

        expect(host.querySelector("footer > #copyright")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-footer class="extra"></lily-footer>');

        expect(host.querySelector("footer")!.className).toBe("footer extra");
    });
});
