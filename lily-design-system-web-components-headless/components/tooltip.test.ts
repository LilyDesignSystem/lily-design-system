import { afterEach, describe, expect, test } from "vitest";

import { Tooltip } from "./tooltip.js";

if (!customElements.get("lily-tooltip")) {
    customElements.define("lily-tooltip", Tooltip);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Tooltip", () => {
    test("renders a native div with role=tooltip", () => {
        const host = render('<lily-tooltip label="Additional info" visible></lily-tooltip>');

        const tooltip = host.querySelector("div") as HTMLDivElement;
        expect(tooltip.classList.contains("tooltip")).toBe(true);
        expect(tooltip.getAttribute("role")).toBe("tooltip");
    });

    test("renders label as the tooltip text content", () => {
        const host = render('<lily-tooltip label="Additional info" visible></lily-tooltip>');

        expect(host.querySelector("div")!.textContent).toBe("Additional info");
    });

    test("is hidden by default", () => {
        const host = render('<lily-tooltip label="Additional info"></lily-tooltip>');

        expect((host.querySelector("div") as HTMLDivElement).hidden).toBe(true);
    });

    test("visible reveals the tooltip", () => {
        const host = render('<lily-tooltip label="Additional info" visible></lily-tooltip>');

        expect((host.querySelector("div") as HTMLDivElement).hidden).toBe(false);
    });

    test("toggling the visible attribute reactively shows/hides the tooltip", () => {
        const host = render('<lily-tooltip label="Additional info"></lily-tooltip>');
        const tooltip = host.querySelector("div") as HTMLDivElement;
        expect(tooltip.hidden).toBe(true);

        host.setAttribute("visible", "");
        expect(tooltip.hidden).toBe(false);

        host.removeAttribute("visible");
        expect(tooltip.hidden).toBe(true);
    });

    test("moves an id attribute to the inner tooltip element (avoiding a duplicate id)", () => {
        const host = render('<lily-tooltip id="tip" label="Additional info" visible></lily-tooltip>');

        expect(host.hasAttribute("id")).toBe(false);
        expect((host.querySelector("div") as HTMLDivElement).id).toBe("tip");
    });
});
