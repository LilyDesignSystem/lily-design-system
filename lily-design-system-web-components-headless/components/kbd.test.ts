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

    test("shows a change to its attributes after it is mounted (P50-T28)", () => {
        document.body.innerHTML = `<lily-kbd >Ctrl</lily-kbd>`;
        const el = document.querySelector("lily-kbd")!;
        el.setAttribute("label", "Control");
        const k = el.querySelector("kbd")!;
        expect(k.querySelector(".screen-reader-span")!.textContent).toBe("Control ");
        expect(k.querySelector(".kbd-text")!.getAttribute("aria-hidden")).toBe("true");
        el.removeAttribute("label");
        expect(k.querySelector(".screen-reader-span")).toBeNull();
        expect(k.querySelector(".kbd-text")!.hasAttribute("aria-hidden")).toBe(false);
    });
});
