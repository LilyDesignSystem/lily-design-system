import { afterEach, describe, expect, test } from "vitest";

import { Separator } from "./separator.js";

if (!customElements.get("lily-separator")) {
    customElements.define("lily-separator", Separator);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Separator", () => {
    test("renders a native hr with role=separator", () => {
        const host = render("<lily-separator></lily-separator>");

        const hr = host.querySelector("hr.separator");
        expect(hr).toBeTruthy();
        expect(hr!.getAttribute("role")).toBe("separator");
    });

    test("has no aria-label when label is omitted", () => {
        const host = render("<lily-separator></lily-separator>");

        expect(host.querySelector("hr")!.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as the accessible label when supplied", () => {
        const host = render('<lily-separator label="End of introduction"></lily-separator>');

        expect(host.querySelector("hr")!.getAttribute("aria-label")).toBe("End of introduction");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-separator class="extra"></lily-separator>');

        expect(host.querySelector("hr")!.className).toBe("separator extra");
    });

    test("passes through rest attributes to the hr", () => {
        const host = render('<lily-separator data-testid="sep"></lily-separator>');

        expect(host.querySelector("hr")!.getAttribute("data-testid")).toBe("sep");
    });
});
