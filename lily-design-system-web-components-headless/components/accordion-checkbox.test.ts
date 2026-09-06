import { afterEach, describe, expect, test, vi } from "vitest";

import { AccordionCheckbox } from "./accordion-checkbox.js";

if (!customElements.get("lily-accordion-checkbox")) {
    customElements.define("lily-accordion-checkbox", AccordionCheckbox);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AccordionCheckbox", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render('<lily-accordion-checkbox label="Comments">Tell us more.</lily-accordion-checkbox>');

        expect(host.className).toBe("accordion-checkbox");
    });

    test("renders a linked checkbox, label, and panel", () => {
        const host = render('<lily-accordion-checkbox label="Comments">Tell us more.</lily-accordion-checkbox>');

        const input = host.querySelector("input.accordion-checkbox-input") as HTMLInputElement;
        const label = host.querySelector("label.accordion-checkbox-label") as HTMLLabelElement;
        const panel = host.querySelector(".accordion-checkbox-panel") as HTMLDivElement;

        expect(input.type).toBe("checkbox");
        expect(label.textContent).toBe("Comments");
        expect(label.getAttribute("for")).toBe(input.id);
        expect(input.getAttribute("aria-controls")).toBe(panel.id);
        expect(panel.getAttribute("role")).toBe("region");
        expect(panel.getAttribute("aria-labelledby")).toBe(input.id);
    });

    test("moves original content into the panel", () => {
        const host = render('<lily-accordion-checkbox label="Comments">Tell us more.</lily-accordion-checkbox>');

        expect(host.querySelector(".accordion-checkbox-panel")!.textContent).toBe("Tell us more.");
    });

    test("panel is hidden unless checked", () => {
        const host = render('<lily-accordion-checkbox label="Comments">Content</lily-accordion-checkbox>');

        expect((host.querySelector(".accordion-checkbox-panel") as HTMLElement).hidden).toBe(true);
        expect(host.querySelector("input")!.getAttribute("aria-expanded")).toBe("false");
    });

    test("checked attribute reveals the panel", () => {
        const host = render('<lily-accordion-checkbox label="Comments" checked>Content</lily-accordion-checkbox>');

        expect((host.querySelector(".accordion-checkbox-panel") as HTMLElement).hidden).toBe(false);
        expect(host.querySelector("input")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("toggling the checkbox reveals the panel and dispatches lily-change", () => {
        const host = render('<lily-accordion-checkbox label="Comments">Content</lily-accordion-checkbox>');
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        input.checked = true;
        input.dispatchEvent(new Event("change"));

        expect(host.hasAttribute("checked")).toBe(true);
        expect((host.querySelector(".accordion-checkbox-panel") as HTMLElement).hidden).toBe(false);
        expect(handler).toHaveBeenCalled();
    });

    test("auto-generates a base id when data-id is absent, unique per instance", () => {
        document.body.innerHTML =
            '<lily-accordion-checkbox label="One">A</lily-accordion-checkbox>' +
            '<lily-accordion-checkbox label="Two">B</lily-accordion-checkbox>';
        const [first, second] = Array.from(document.body.children) as HTMLElement[];

        const firstId = first.querySelector("input")!.id;
        const secondId = second.querySelector("input")!.id;
        expect(firstId).not.toBe(secondId);
    });
});
