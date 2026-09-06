import { afterEach, describe, expect, test } from "vitest";

import { DialGroup } from "./dial-group.js";

if (!customElements.get("lily-dial-group")) {
    customElements.define("lily-dial-group", DialGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DialGroup", () => {
    test("renders itself with the base class and role=group", () => {
        const host = render('<lily-dial-group label="Thermostat controls"></lily-dial-group>');

        expect(host.classList.contains("dial-group")).toBe(true);
        expect(host.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-dial-group label="Thermostat controls"></lily-dial-group>');

        expect(host.getAttribute("aria-label")).toBe("Thermostat controls");
    });

    test("renders child dial content in place", () => {
        const host = render(
            '<lily-dial-group label="Thermostat controls"><span data-testid="dial">72°</span></lily-dial-group>',
        );

        expect(host.querySelector('[data-testid="dial"]')!.textContent).toBe("72°");
    });

    test("appends the consumer's class attribute to the base class", () => {
        const host = render('<lily-dial-group label="Thermostat controls" class="my-extra"></lily-dial-group>');

        expect(host.className).toBe("dial-group my-extra");
    });
});
