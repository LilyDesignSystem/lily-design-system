import { afterEach, describe, expect, test } from "vitest";

import { Sidebar } from "./sidebar.js";

if (!customElements.get("lily-sidebar")) {
    customElements.define("lily-sidebar", Sidebar);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Sidebar", () => {
    test("renders a native aside", () => {
        const host = render('<lily-sidebar label="Navigation"></lily-sidebar>');

        expect(host.querySelector("aside.sidebar")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-sidebar label="Navigation"></lily-sidebar>');

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("Navigation");
    });

    test("moves its children into the aside", () => {
        const host = render(
            '<lily-sidebar label="Navigation"><nav><a href="/dashboard">Dashboard</a></nav></lily-sidebar>',
        );

        expect(host.querySelector("aside > nav")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-sidebar label="Navigation" class="extra"></lily-sidebar>');

        expect(host.querySelector("aside")!.className).toBe("sidebar extra");
    });

    test("passes through rest attributes to the aside", () => {
        const host = render('<lily-sidebar label="Navigation" data-testid="sb"></lily-sidebar>');

        expect(host.querySelector("aside")!.getAttribute("data-testid")).toBe("sb");
    });
});
