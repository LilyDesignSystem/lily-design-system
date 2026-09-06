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
    test("displays a span with role=button by default", () => {
        const host = render('<lily-editable label="Name" value="Ada"></lily-editable>');

        const span = host.querySelector("span")!;
        const input = host.querySelector("input") as HTMLInputElement;
        expect(host.className).toBe("editable");
        expect(span.getAttribute("role")).toBe("button");
        expect(span.hidden).toBe(false);
        expect(span.textContent).toBe("Ada");
        expect(input.hidden).toBe(true);
    });

    test("uses label as the accessible name on both display and edit elements", () => {
        const host = render('<lily-editable label="Name" value="Ada"></lily-editable>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Name");
        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Name");
    });

    test("clicking the display span activates edit mode", () => {
        const host = render('<lily-editable label="Name" value="Ada"></lily-editable>');

        host.querySelector("span")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(true);
        expect(host.querySelector("span")!.hidden).toBe(true);
        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.hidden).toBe(false);
        expect(input.value).toBe("Ada");
    });

    test("Enter/Space on the display span activates edit mode", () => {
        const host = render('<lily-editable label="Name" value="Ada"></lily-editable>');

        host.querySelector("span")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(true);
    });

    test("does not activate edit mode when disabled", () => {
        const host = render('<lily-editable label="Name" value="Ada" disabled></lily-editable>');

        host.querySelector("span")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(false);
        expect(host.querySelector("span")!.getAttribute("aria-disabled")).toBe("true");
        expect(host.querySelector("span")!.tabIndex).toBe(-1);
    });

    test("Enter in edit mode confirms and dispatches lily-change", () => {
        const host = render('<lily-editable label="Name" value="Ada" editing></lily-editable>') as unknown as Editable;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);
        const input = host.querySelector("input") as HTMLInputElement;
        input.value = "Grace";

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(false);
        expect(host.value).toBe("Grace");
        expect(handler).toHaveBeenCalledTimes(1);
        expect((handler.mock.calls[0][0] as CustomEvent<{ value: string }>).detail).toEqual({ value: "Grace" });
    });

    test("Escape in edit mode cancels without changing the value", () => {
        const host = render('<lily-editable label="Name" value="Ada" editing></lily-editable>') as unknown as Editable;
        const input = host.querySelector("input") as HTMLInputElement;
        input.value = "Grace";

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("editing")).toBe(false);
        expect(host.value).toBe("Ada");
    });
});
