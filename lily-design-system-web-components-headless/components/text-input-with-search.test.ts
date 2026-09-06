import { afterEach, describe, expect, test, vi } from "vitest";

import { TextInputWithSearch } from "./text-input-with-search.js";

if (!customElements.get("lily-text-input-with-search")) {
    customElements.define("lily-text-input-with-search", TextInputWithSearch);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TextInputWithSearch", () => {
    test("carries the base class and role=search", () => {
        const host = render('<lily-text-input-with-search label="Site search"></lily-text-input-with-search>');

        expect(host.classList.contains("text-input-with-search")).toBe(true);
        expect(host.getAttribute("role")).toBe("search");
        expect(host.getAttribute("aria-label")).toBe("Site search");
    });

    test("renders an input[type=text] and a button[type=button] with default labels", () => {
        const host = render('<lily-text-input-with-search label="Site search"></lily-text-input-with-search>');

        const input = host.querySelector("input") as HTMLInputElement;
        const button = host.querySelector("button") as HTMLButtonElement;
        expect(input.type).toBe("text");
        expect(input.getAttribute("aria-label")).toBe("Search");
        expect(button.type).toBe("button");
        expect(button.getAttribute("aria-label")).toBe("Search");
        expect(button.textContent).toBe("Search");
    });

    test("honours custom input-label and search-label", () => {
        const host = render(
            '<lily-text-input-with-search label="Site search" input-label="Query" search-label="Go"></lily-text-input-with-search>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Query");
        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Go");
        expect(host.querySelector("button")!.textContent).toBe("Go");
    });

    test("exposes a live value property seeded from the value attribute", () => {
        const host = render(
            '<lily-text-input-with-search label="Site search" value="nhs"></lily-text-input-with-search>',
        ) as unknown as TextInputWithSearch;

        expect(host.value).toBe("nhs");
        host.value = "gov";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("gov");
    });

    test("Enter in the input fires lily-search with the current value", () => {
        const host = render(
            '<lily-text-input-with-search label="Site search"></lily-text-input-with-search>',
        ) as unknown as TextInputWithSearch;
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-search", handler);

        input.value = "accessibility";
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(1);
        const event = handler.mock.calls[0][0] as CustomEvent<{ value: string }>;
        expect(event.detail).toEqual({ value: "accessibility" });
    });

    test("clicking the search button fires lily-search", () => {
        const host = render(
            '<lily-text-input-with-search label="Site search" value="wcag"></lily-text-input-with-search>',
        );
        const button = host.querySelector("button") as HTMLButtonElement;
        const handler = vi.fn();
        host.addEventListener("lily-search", handler);

        button.click();

        expect(handler).toHaveBeenCalledTimes(1);
        const event = handler.mock.calls[0][0] as CustomEvent<{ value: string }>;
        expect(event.detail).toEqual({ value: "wcag" });
    });

    test("disabled propagates to both the input and the button", () => {
        const host = render(
            '<lily-text-input-with-search label="Site search" disabled></lily-text-input-with-search>',
        );

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });
});
