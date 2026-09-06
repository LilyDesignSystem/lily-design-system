import { afterEach, describe, expect, test } from "vitest";

import { Expander } from "./expander.js";

if (!customElements.get("lily-expander")) {
    customElements.define("lily-expander", Expander);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Expander", () => {
    test("renders a button and a role=region content wrapper", () => {
        const host = render('<lily-expander label="Show details"><p>Details</p></lily-expander>');

        const button = host.querySelector("button") as HTMLButtonElement;
        const region = host.querySelector('[role="region"]') as HTMLElement;
        expect(host.className).toBe("expander");
        expect(button.textContent).toBe("Show details");
        expect(region.getAttribute("aria-label")).toBe("Show details");
    });

    test("button aria-expanded/aria-controls link to the content region", () => {
        const host = render('<lily-expander label="Show details"><p>Details</p></lily-expander>');

        const button = host.querySelector("button")!;
        const region = host.querySelector('[role="region"]') as HTMLElement;
        expect(button.getAttribute("aria-controls")).toBe(region.id);
        expect(region.id).not.toBe("");
    });

    test("content is hidden by default and visible when expanded", () => {
        const closed = render('<lily-expander label="Show details"><p>Details</p></lily-expander>');
        expect(closed.querySelector('[role="region"]')!.hasAttribute("hidden")).toBe(true);
        expect(closed.querySelector("button")!.getAttribute("aria-expanded")).toBe("false");

        const open = render('<lily-expander label="Show details" expanded><p>Details</p></lily-expander>');
        expect(open.querySelector('[role="region"]')!.hasAttribute("hidden")).toBe(false);
        expect(open.querySelector("button")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("clicking the button toggles expanded", () => {
        const host = render('<lily-expander label="Show details"><p>Details</p></lily-expander>');

        host.querySelector("button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(host.hasAttribute("expanded")).toBe(true);

        host.querySelector("button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(host.hasAttribute("expanded")).toBe(false);
    });

    test("preserves the expandable content", () => {
        const host = render('<lily-expander label="Show details"><p>Advanced settings go here.</p></lily-expander>');

        expect(host.querySelector("p")!.textContent).toBe("Advanced settings go here.");
    });
});
