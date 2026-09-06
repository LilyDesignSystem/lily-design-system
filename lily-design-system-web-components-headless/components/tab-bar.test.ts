import { afterEach, describe, expect, test } from "vitest";

import { TabBar } from "./tab-bar.js";
import { TabBarButton } from "./tab-bar-button.js";

if (!customElements.get("lily-tab-bar")) {
    customElements.define("lily-tab-bar", TabBar);
}
if (!customElements.get("lily-tab-bar-button")) {
    customElements.define("lily-tab-bar-button", TabBarButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

function tabsMarkup(): string {
    return (
        '<lily-tab-bar label="Medication information">' +
        '<lily-tab-bar-button selected controls="panel-about">About</lily-tab-bar-button>' +
        '<lily-tab-bar-button controls="panel-dosage">Dosage</lily-tab-bar-button>' +
        '<lily-tab-bar-button controls="panel-side-effects">Side effects</lily-tab-bar-button>' +
        "</lily-tab-bar>"
    );
}

describe("TabBar", () => {
    test("renders itself with the base class and role=tablist", () => {
        const host = render(tabsMarkup());

        expect(host.classList.contains("tab-bar")).toBe(true);
        expect(host.getAttribute("role")).toBe("tablist");
    });

    test("uses label as the accessible name", () => {
        const host = render(tabsMarkup());

        expect(host.getAttribute("aria-label")).toBe("Medication information");
    });

    test("ArrowRight moves focus to the next tab, wrapping to the first", () => {
        const host = render(tabsMarkup());
        const tabs = host.querySelectorAll<HTMLElement>("[role='tab']");
        tabs[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(tabs[1]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(tabs[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(tabs[0]);
    });

    test("ArrowLeft moves focus to the previous tab, wrapping to the last", () => {
        const host = render(tabsMarkup());
        const tabs = host.querySelectorAll<HTMLElement>("[role='tab']");
        tabs[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
        expect(document.activeElement).toBe(tabs[2]);
    });

    test("Home and End jump to the first and last tab", () => {
        const host = render(tabsMarkup());
        const tabs = host.querySelectorAll<HTMLElement>("[role='tab']");
        tabs[1].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(document.activeElement).toBe(tabs[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(document.activeElement).toBe(tabs[0]);
    });

    test("appends the consumer's class attribute to the base class", () => {
        const host = render('<lily-tab-bar label="Tabs" class="my-extra"></lily-tab-bar>');

        expect(host.className).toBe("tab-bar my-extra");
    });
});
