import { afterEach, describe, expect, test } from "vitest";

import { Code } from "./code.js";

if (!customElements.get("lily-code")) {
    customElements.define("lily-code", Code);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Code", () => {
    test("renders a native code element", () => {
        const host = render("<lily-code>const x = 1;</lily-code>");

        expect(host.querySelector("code.code")).toBeTruthy();
    });

    test("moves original content into the code element", () => {
        const host = render("<lily-code>const x = 1;</lily-code>");

        expect(host.querySelector("code")!.textContent).toBe("const x = 1;");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-code class="inline">x</lily-code>');

        expect(host.querySelector("code")!.className).toBe("code inline");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-code>x</lily-code>");

        (host as unknown as Code).connectedCallback();

        expect(host.querySelectorAll("code").length).toBe(1);
    });
});
