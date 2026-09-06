import { afterEach, describe, expect, test } from "vitest";

import { Cascader } from "./cascader.js";

if (!customElements.get("lily-cascader")) {
    customElements.define("lily-cascader", Cascader);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Cascader", () => {
    test("the custom element itself is the combobox (self-is-the-wrapper)", () => {
        const host = render('<lily-cascader label="Region"><ul>Options</ul></lily-cascader>');

        expect(host.className).toBe("cascader");
        expect(host.getAttribute("role")).toBe("combobox");
        expect(host.getAttribute("aria-haspopup")).toBe("tree");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-cascader label="Region"></lily-cascader>');

        expect(host.getAttribute("aria-label")).toBe("Region");
    });

    test("defaults aria-expanded to false and hides the panel", () => {
        const host = render('<lily-cascader label="Region"><ul>Options</ul></lily-cascader>');

        expect(host.getAttribute("aria-expanded")).toBe("false");
        expect((host.querySelector(".cascader-panel") as HTMLElement).hidden).toBe(true);
    });

    test("moves original content into the panel", () => {
        const host = render('<lily-cascader label="Region"><ul>Options</ul></lily-cascader>');

        expect(host.querySelector(".cascader-panel ul")).toBeTruthy();
    });

    test("trigger shows value or placeholder", () => {
        const host = render('<lily-cascader label="Region" placeholder="Select…"></lily-cascader>');

        expect(host.querySelector(".cascader-trigger")!.textContent).toBe("Select…");
    });

    test("clicking the trigger toggles expanded and the panel", () => {
        const host = render('<lily-cascader label="Region"><ul>Options</ul></lily-cascader>');
        const trigger = host.querySelector(".cascader-trigger") as HTMLButtonElement;

        trigger.click();

        expect(host.hasAttribute("expanded")).toBe(true);
        expect(host.getAttribute("aria-expanded")).toBe("true");
        expect((host.querySelector(".cascader-panel") as HTMLElement).hidden).toBe(false);

        trigger.click();

        expect(host.hasAttribute("expanded")).toBe(false);
    });

    test("disabled disables the trigger and prevents toggling", () => {
        const host = render('<lily-cascader label="Region" disabled><ul>Options</ul></lily-cascader>');
        const trigger = host.querySelector(".cascader-trigger") as HTMLButtonElement;

        expect(trigger.disabled).toBe(true);
        trigger.click();

        expect(host.hasAttribute("expanded")).toBe(false);
    });

    test("Escape closes the panel", () => {
        const host = render('<lily-cascader label="Region" expanded><ul>Options</ul></lily-cascader>');
        const trigger = host.querySelector(".cascader-trigger") as HTMLButtonElement;

        trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("expanded")).toBe(false);
    });

    test("external toggleAttribute API updates the rendered panel", () => {
        const host = render('<lily-cascader label="Region"><ul>Options</ul></lily-cascader>');

        host.toggleAttribute("expanded", true);

        expect((host.querySelector(".cascader-panel") as HTMLElement).hidden).toBe(false);
    });
});
