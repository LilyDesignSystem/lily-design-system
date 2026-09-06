import { afterEach, describe, expect, test } from "vitest";

import { MentionsInput } from "./mentions-input.js";

if (!customElements.get("lily-mentions-input")) {
    customElements.define("lily-mentions-input", MentionsInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MentionsInput", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render('<lily-mentions-input label="Comment"></lily-mentions-input>');

        expect(host.className).toBe("mentions-input");
    });

    test("defaults data-trigger-char to @", () => {
        const host = render('<lily-mentions-input label="Comment"></lily-mentions-input>');

        expect(host.getAttribute("data-trigger-char")).toBe("@");
    });

    test("trigger-char overrides data-trigger-char", () => {
        const host = render('<lily-mentions-input label="Comment" trigger-char="#"></lily-mentions-input>');

        expect(host.getAttribute("data-trigger-char")).toBe("#");
    });

    test("inner input has the combobox contract", () => {
        const host = render('<lily-mentions-input label="Comment"></lily-mentions-input>');
        const input = host.querySelector("input.mentions-input-control") as HTMLInputElement;

        expect(input.type).toBe("text");
        expect(input.getAttribute("role")).toBe("combobox");
        expect(input.getAttribute("aria-haspopup")).toBe("listbox");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(input.getAttribute("aria-label")).toBe("Comment");
    });

    test("aria-expanded and the suggestions panel default to closed", () => {
        const host = render('<lily-mentions-input label="Comment"></lily-mentions-input>');

        expect(host.querySelector("input")!.getAttribute("aria-expanded")).toBe("false");
        expect((host.querySelector(".mentions-input-suggestions") as HTMLElement).hidden).toBe(true);
    });

    test("the expanded attribute opens the suggestions panel", () => {
        const host = render('<lily-mentions-input label="Comment" expanded></lily-mentions-input>');

        expect(host.querySelector("input")!.getAttribute("aria-expanded")).toBe("true");
        expect((host.querySelector(".mentions-input-suggestions") as HTMLElement).hidden).toBe(false);
    });

    test("toggling expanded externally re-syncs the panel", () => {
        const host = render('<lily-mentions-input label="Comment"></lily-mentions-input>');

        host.toggleAttribute("expanded", true);

        expect(host.querySelector("input")!.getAttribute("aria-expanded")).toBe("true");
        expect((host.querySelector(".mentions-input-suggestions") as HTMLElement).hidden).toBe(false);
    });

    test("disabled propagates to the inner input", () => {
        const host = render('<lily-mentions-input label="Comment" disabled></lily-mentions-input>');

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });

    test("moves light-DOM children into the suggestions panel", () => {
        const host = render(
            '<lily-mentions-input label="Comment" expanded><ul role="listbox"><li role="option">@alice</li></ul></lily-mentions-input>',
        );

        const panel = host.querySelector(".mentions-input-suggestions") as HTMLElement;
        expect(panel.querySelector("ul[role=listbox]")).not.toBeNull();
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-mentions-input label="Comment" value="Hello "></lily-mentions-input>') as unknown as MentionsInput;

        expect(host.value).toBe("Hello ");
        host.value = "Hello @al";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Hello @al");
        expect(host.value).toBe("Hello @al");
    });
});
