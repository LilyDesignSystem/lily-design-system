import { afterEach, describe, expect, test } from "vitest";

import { FloatingPanel } from "./floating-panel.js";

if (!customElements.get("lily-floating-panel")) {
    customElements.define("lily-floating-panel", FloatingPanel);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FloatingPanel", () => {
    test("renders as itself with the base class", () => {
        const host = render('<lily-floating-panel label="Options"><p>Content</p></lily-floating-panel>');

        expect(host.tagName.toLowerCase()).toBe("lily-floating-panel");
        expect(host.className).toBe("floating-panel");
    });

    test("is hidden and carries no role/aria-label by default (closed)", () => {
        const host = render('<lily-floating-panel label="Options"><p>Content</p></lily-floating-panel>');

        expect(host.hidden).toBe(true);
        expect(host.hasAttribute("role")).toBe(false);
        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("shows role=region and aria-label when open", () => {
        const host = render('<lily-floating-panel open label="Options"><p>Content</p></lily-floating-panel>');

        expect(host.hidden).toBe(false);
        expect(host.getAttribute("role")).toBe("region");
        expect(host.getAttribute("aria-label")).toBe("Options");
    });

    test("toggling the open attribute updates hidden and ARIA reactively", () => {
        const host = render('<lily-floating-panel label="Options"><p>Content</p></lily-floating-panel>');

        expect(host.hidden).toBe(true);
        host.setAttribute("open", "");
        expect(host.hidden).toBe(false);
        expect(host.getAttribute("role")).toBe("region");

        host.removeAttribute("open");
        expect(host.hidden).toBe(true);
        expect(host.hasAttribute("role")).toBe(false);
    });

    test("preserves children content in place", () => {
        const host = render('<lily-floating-panel open label="Options"><p>Panel content</p></lily-floating-panel>');

        expect(host.textContent).toBe("Panel content");
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-floating-panel label="Options" class="chat-widget"></lily-floating-panel>');

        expect(host.className).toBe("floating-panel chat-widget");
    });
});
