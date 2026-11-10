import { afterEach, describe, expect, test, vi } from "vitest";

import { Editable } from "./editable.js";

if (!customElements.get("lily-editable")) {
    customElements.define("lily-editable", Editable);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Editable", () => {
    test("displays a native button by default", () => {
        const host = render('<lily-editable label="Name" value="Ada"></lily-editable>');

        const span = host.querySelector("button")!;
        const input = host.querySelector("input") as HTMLInputElement;
        expect(host.className).toBe("editable");
        expect(span.type).toBe("button");
        expect(span.className).toBe("editable-button");
        expect(input.className).toBe("editable-input");
        expect(span.hasAttribute("role")).toBe(false);
        expect(span.hidden).toBe(false);
        expect(span.textContent).toBe("Ada");
        expect(input.hidden).toBe(true);
    });

    test("names the display with the value then the label, and the edit element by its label", () => {
        const host = render('<lily-editable label="Name" value="Ada"></lily-editable>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Ada, Name");
        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Name");
    });

    test("clicking the button activates edit mode, and focus moves to the field", () => {
        const host = render('<lily-editable label="Name" value="Ada"></lily-editable>');

        host.querySelector("button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(true);
        expect(host.querySelector("button")!.hidden).toBe(true);
        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.hidden).toBe(false);
        expect(input.value).toBe("Ada");
        expect(document.activeElement).toBe(input);
    });

    test("does not activate edit mode when disabled", () => {
        const host = render('<lily-editable label="Name" value="Ada" disabled></lily-editable>');

        host.querySelector("button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(false);
        expect(host.querySelector("button")!.disabled).toBe(true);
    });

    test("Enter in edit mode confirms and dispatches lily-change", () => {
        const host = render(
            '<lily-editable label="Name" value="Ada" editing></lily-editable>',
        ) as unknown as Editable;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);
        const input = host.querySelector("input") as HTMLInputElement;
        input.value = "Grace";

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(false);
        expect(host.value).toBe("Grace");
        expect(handler).toHaveBeenCalledTimes(1);
        expect((handler.mock.calls[0][0] as CustomEvent<{ value: string }>).detail).toEqual({
            value: "Grace",
        });
    });

    test("Escape in edit mode cancels without changing the value", () => {
        const host = render(
            '<lily-editable label="Name" value="Ada" editing></lily-editable>',
        ) as unknown as Editable;
        const input = host.querySelector("input") as HTMLInputElement;
        input.value = "Grace";

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(false);
        expect(host.value).toBe("Ada");
        expect(document.activeElement).toBe(host.querySelector("button"));
    });
});
