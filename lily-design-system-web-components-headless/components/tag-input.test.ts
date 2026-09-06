import { afterEach, describe, expect, test, vi } from "vitest";

import { TagInput } from "./tag-input.js";

if (!customElements.get("lily-tag-input")) {
    customElements.define("lily-tag-input", TagInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TagInput", () => {
    test("renders a native input[type=text]", () => {
        const host = render('<lily-tag-input label="Add tag"></lily-tag-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.classList.contains("tag-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tag-input label="Add skill"></lily-tag-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Add skill");
    });

    test("seeds the input from the value attribute and exposes a live value property", () => {
        const host = render('<lily-tag-input label="Add tag" value="draft"></lily-tag-input>') as unknown as TagInput;

        expect(host.value).toBe("draft");
        host.value = "urgent";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("urgent");
    });

    test("disabled sets the input's disabled property", () => {
        const host = render('<lily-tag-input label="Add tag" disabled></lily-tag-input>');

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });

    test("Enter with a non-empty trimmed value fires lily-add and clears the input", () => {
        const host = render('<lily-tag-input label="Add tag"></lily-tag-input>') as unknown as TagInput;
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
        const host = render('<lily-tag-input label="Add tag"></lily-tag-input>') as unknown as TagInput;
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-add", handler);

        input.value = "   ";
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(handler).not.toHaveBeenCalled();
    });
});
