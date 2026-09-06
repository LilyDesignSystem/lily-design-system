import { afterEach, describe, expect, test } from "vitest";

import { TabPanel } from "./tab-panel.js";

if (!customElements.get("lily-tab-panel")) {
    customElements.define("lily-tab-panel", TabPanel);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TabPanel", () => {
    test("the custom element itself is the panel (self-is-the-wrapper)", () => {
        const host = render('<lily-tab-panel label="Details">Panel content.</lily-tab-panel>');

        expect(host.className).toBe("tab-panel");
        expect(host.getAttribute("role")).toBe("tabpanel");
        expect(host.tabIndex).toBe(0);
    });

    test("uses label as the accessible name when labelled-by is absent", () => {
        const host = render('<lily-tab-panel label="Details">Panel content.</lily-tab-panel>');

        expect(host.getAttribute("aria-label")).toBe("Details");
        expect(host.hasAttribute("aria-labelledby")).toBe(false);
    });

    test("uses labelled-by when present and omits aria-label", () => {
        const host = render('<lily-tab-panel label="Details" labelled-by="tab-1">Panel content.</lily-tab-panel>');

        expect(host.getAttribute("aria-labelledby")).toBe("tab-1");
        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("is hidden by default (selected absent)", () => {
        const host = render('<lily-tab-panel label="Details">Panel content.</lily-tab-panel>');

        expect(host.hidden).toBe(true);
    });

    test("selected removes the hidden attribute", () => {
        const host = render('<lily-tab-panel label="Details" selected>Panel content.</lily-tab-panel>');

        expect(host.hidden).toBe(false);
    });

    test("toggling selected externally updates hidden", () => {
        const host = render('<lily-tab-panel label="Details" selected>Panel content.</lily-tab-panel>');

        host.removeAttribute("selected");

        expect(host.hidden).toBe(true);
    });
});
