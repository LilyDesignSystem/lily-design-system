import { afterEach, describe, expect, test } from "vitest";

import { GrailLayout } from "./grail-layout.js";

if (!customElements.get("lily-grail-layout")) {
    customElements.define("lily-grail-layout", GrailLayout);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GrailLayout", () => {
    test("renders as itself with the base class", () => {
        const host = render("<lily-grail-layout></lily-grail-layout>");

        expect(host.tagName.toLowerCase()).toBe("lily-grail-layout");
        expect(host.className).toBe("grail-layout");
    });

    test("carries no implicit ARIA role", () => {
        const host = render("<lily-grail-layout></lily-grail-layout>");

        expect(host.hasAttribute("role")).toBe(false);
        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("preserves section children in place", () => {
        const host = render("<lily-grail-layout><header>Top</header><main>Center</main><footer>Bottom</footer></lily-grail-layout>");

        expect(host.children.length).toBe(3);
        expect(host.querySelector("header")).not.toBeNull();
        expect(host.querySelector("main")).not.toBeNull();
        expect(host.querySelector("footer")).not.toBeNull();
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-grail-layout class="app-shell"></lily-grail-layout>');

        expect(host.className).toBe("grail-layout app-shell");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-grail-layout data-testid="shell"></lily-grail-layout>');

        expect(host.getAttribute("data-testid")).toBe("shell");
    });
});
