import { afterEach, describe, expect, test, vi } from "vitest";

import { TagInputDiv } from "./tag-input-div.js";

if (!customElements.get("lily-tag-input-div")) {
    customElements.define("lily-tag-input-div", TagInputDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TagInputDiv", () => {
    test("the root is a named group holding a native input[type=text]", () => {
        const host = render('<lily-tag-input-div label="Add tag" class="extra" data-x="1"></lily-tag-input-div>');

        const root = host.querySelector("div.tag-input-div") as HTMLElement;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Add tag");
        expect(root.classList.contains("extra")).toBe(true);
        expect(root.getAttribute("data-x")).toBe("1");
        const input = root.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.classList.contains("tag-input-div-field")).toBe(true);
    });

    test("keeps the consumer's tags before the field", () => {
        const host = render(
            '<lily-tag-input-div label="Tags"><span class="tag">one</span></lily-tag-input-div>',
        );

        expect(host.querySelector("div.tag-input-div > span.tag")?.nextElementSibling).toBe(
            host.querySelector("input"),
        );
    });

    test("the field takes placeholder, name and required", () => {
        const host = render(
            '<lily-tag-input-div label="T" placeholder="P" name="n" required></lily-tag-input-div>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.placeholder).toBe("P");
        expect(input.name).toBe("n");
        expect(input.required).toBe(true);
        expect(host.querySelector("div.tag-input-div")!.hasAttribute("placeholder")).toBe(false);
    });

    test("Enter during an IME composition adds nothing", () => {
        const host = render('<lily-tag-input-div label="T" value="one"></lily-tag-input-div>');
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-add", handler);

        input.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Enter", bubbles: true, isComposing: true }),
        );

        expect(handler).not.toHaveBeenCalled();
        expect(input.value).toBe("one");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tag-input-div label="Add skill"></lily-tag-input-div>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Add skill");
    });

    test("seeds the input from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-tag-input-div label="Add tag" value="draft"></lily-tag-input-div>',
        ) as unknown as TagInputDiv;

        expect(host.value).toBe("draft");
        host.value = "urgent";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("urgent");
    });

    test("disabled sets the input's disabled property", () => {
        const host = render('<lily-tag-input-div label="Add tag" disabled></lily-tag-input-div>');

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });

    test("Enter with a non-empty trimmed value fires lily-add and clears the input", () => {
        const host = render(
            '<lily-tag-input-div label="Add tag"></lily-tag-input-div>',
        ) as unknown as TagInputDiv;
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-add", handler);

        input.value = "  urgent  ";
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(1);
        const event = handler.mock.calls[0][0] as CustomEvent<{ value: string }>;
        expect(event.detail).toEqual({ value: "urgent" });
        expect(input.value).toBe("");
    });

    test("Enter with an empty (or whitespace-only) value does nothing", () => {
        const host = render(
            '<lily-tag-input-div label="Add tag"></lily-tag-input-div>',
        ) as unknown as TagInputDiv;
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-add", handler);

        input.value = "   ";
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(handler).not.toHaveBeenCalled();
    });
});
