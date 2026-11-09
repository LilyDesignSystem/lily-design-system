import { afterEach, describe, expect, test } from "vitest";

import { Panel } from "./panel.js";

if (!customElements.get("lily-panel")) {
    customElements.define("lily-panel", Panel);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Panel", () => {
    test("renders a div role=group with the correct class", () => {
        const host = render('<lily-panel label="Settings"></lily-panel>');

        const section = host.querySelector("div.panel") as HTMLElement;
        expect(section).not.toBeNull();
        expect(section.className).toBe("panel");
        expect(section.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name, naming the group", () => {
        const host = render('<lily-panel label="Settings"></lily-panel>');

        expect(host.querySelector("div.panel")!.getAttribute("aria-label")).toBe("Settings");
    });

    test("moves light-DOM children into the group", () => {
        const host = render(
            '<lily-panel label="Settings"><p>Adjust your preferences below.</p></lily-panel>',
        );

        expect(host.querySelector("div.panel")!.querySelector("p")!.textContent).toBe(
            "Adjust your preferences below.",
        );
    });

    test("passes through rest attributes onto the group", () => {
        const host = render('<lily-panel label="Settings" data-testid="panel"></lily-panel>');

        expect(host.querySelector("div.panel")!.getAttribute("data-testid")).toBe("panel");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-panel label="Settings" class="extra"></lily-panel>');

        expect(host.querySelector("div.panel")!.className).toBe("panel extra");
    });
});
