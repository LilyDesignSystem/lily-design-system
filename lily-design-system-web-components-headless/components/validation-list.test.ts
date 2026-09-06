import { afterEach, describe, expect, test } from "vitest";

import { ValidationList } from "./validation-list.js";

if (!customElements.get("lily-validation-list")) {
    customElements.define("lily-validation-list", ValidationList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ValidationList", () => {
    test("renders a native unordered list", () => {
        const host = render('<lily-validation-list label="Password requirements"></lily-validation-list>');

        expect(host.querySelector("ul.validation-list")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-validation-list label="Password requirements"></lily-validation-list>');

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Password requirements");
    });

    test("aria-live is polite", () => {
        const host = render('<lily-validation-list label="Password requirements"></lily-validation-list>');

        expect(host.querySelector("ul")!.getAttribute("aria-live")).toBe("polite");
    });

    test("moves its children into the ul", () => {
        const host = render(
            '<lily-validation-list label="Password requirements"><li data-status="pending">At least 8 characters</li></lily-validation-list>',
        );

        expect(host.querySelector("ul > li")!.textContent).toBe("At least 8 characters");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-validation-list label="Password requirements" class="extra"></lily-validation-list>');

        expect(host.querySelector("ul")!.className).toBe("validation-list extra");
    });

    test("passes through rest attributes to the ul", () => {
        const host = render('<lily-validation-list label="Password requirements" data-testid="rules"></lily-validation-list>');

        expect(host.querySelector("ul")!.getAttribute("data-testid")).toBe("rules");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-validation-list label="Password requirements"></lily-validation-list>');

        (host as unknown as ValidationList).connectedCallback();

        expect(host.querySelectorAll("ul").length).toBe(1);
    });
});
