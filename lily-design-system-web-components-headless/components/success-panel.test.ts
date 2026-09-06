import { afterEach, describe, expect, test } from "vitest";

import { SuccessPanel } from "./success-panel.js";

if (!customElements.get("lily-success-panel")) {
    customElements.define("lily-success-panel", SuccessPanel);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SuccessPanel", () => {
    test("carries the base class and role=status", () => {
        const host = render("<lily-success-panel>Application submitted</lily-success-panel>");

        expect(host.classList.contains("success-panel")).toBe(true);
        expect(host.getAttribute("role")).toBe("status");
    });

    test("applies an explicit label as aria-label", () => {
        const host = render('<lily-success-panel label="Application submitted"></lily-success-panel>');

        expect(host.getAttribute("aria-label")).toBe("Application submitted");
    });

    test("omits aria-label when no label is given", () => {
        const host = render("<lily-success-panel>Done</lily-success-panel>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("preserves the consumer's children", () => {
        const host = render("<lily-success-panel><h1>Application complete</h1><p>Reference: ABC123</p></lily-success-panel>");

        expect(host.querySelector("h1")?.textContent).toBe("Application complete");
        expect(host.querySelector("p")?.textContent).toBe("Reference: ABC123");
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render('<lily-success-panel class="my-panel">Done</lily-success-panel>');

        expect(host.classList.contains("success-panel")).toBe(true);
        expect(host.classList.contains("my-panel")).toBe(true);
    });
});
