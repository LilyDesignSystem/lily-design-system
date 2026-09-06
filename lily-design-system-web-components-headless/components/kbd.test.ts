import { afterEach, describe, expect, test } from "vitest";

import { Kbd } from "./kbd.js";

if (!customElements.get("lily-kbd")) {
    customElements.define("lily-kbd", Kbd);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Kbd", () => {
    test("renders a native kbd element with the correct class", () => {
        const host = render("<lily-kbd>Ctrl</lily-kbd>");

        const kbd = host.querySelector("kbd") as HTMLElement;
        expect(kbd).not.toBeNull();
        expect(kbd.className).toBe("kbd");
    });

    test("moves children into the inner kbd", () => {
        const host = render("<lily-kbd>Enter</lily-kbd>");

        expect(host.querySelector("kbd")!.textContent).toBe("Enter");
    });

    test("passes through rest attributes and the class hook", () => {
        const host = render('<lily-kbd class="key" aria-label="Control">Ctrl</lily-kbd>');

        const kbd = host.querySelector("kbd")!;
        expect(kbd.className).toBe("kbd key");
        expect(kbd.getAttribute("aria-label")).toBe("Control");
    });

    test("does not double-build on a second connectedCallback", () => {
        const host = render("<lily-kbd>S</lily-kbd>") as Kbd;
        host.connectedCallback();

        expect(host.querySelectorAll("kbd").length).toBe(1);
    });
});
