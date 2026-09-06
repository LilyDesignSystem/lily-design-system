import { afterEach, describe, expect, test, vi } from "vitest";

import { TreeSelect } from "./tree-select.js";

if (!customElements.get("lily-tree-select")) {
    customElements.define("lily-tree-select", TreeSelect);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TreeSelect", () => {
    test("carries the base class, role=combobox, and aria-haspopup=tree", () => {
        const host = render('<lily-tree-select label="Select category"></lily-tree-select>');

        expect(host.classList.contains("tree-select")).toBe(true);
        expect(host.getAttribute("role")).toBe("combobox");
        expect(host.getAttribute("aria-haspopup")).toBe("tree");
        expect(host.getAttribute("aria-label")).toBe("Select category");
    });

    test("aria-expanded defaults to false and the panel starts hidden", () => {
        const host = render('<lily-tree-select label="Select category"></lily-tree-select>');

        expect(host.getAttribute("aria-expanded")).toBe("false");
        expect((host.querySelector(".tree-select-panel") as HTMLElement).hidden).toBe(true);
    });

    test("an initial expanded attribute opens the panel", () => {
        const host = render('<lily-tree-select label="Select category" expanded></lily-tree-select>');

        expect(host.getAttribute("aria-expanded")).toBe("true");
        expect((host.querySelector(".tree-select-panel") as HTMLElement).hidden).toBe(false);
    });

    test("aria-multiselectable is set only when multiple is present", () => {
        const single = render('<lily-tree-select label="Select category"></lily-tree-select>');
        expect(single.hasAttribute("aria-multiselectable")).toBe(false);

        document.body.innerHTML = "";

        const multi = render('<lily-tree-select label="Select departments" multiple></lily-tree-select>');
        expect(multi.getAttribute("aria-multiselectable")).toBe("true");
    });

    test("trigger shows value, falling back to placeholder, then empty", () => {
        const withValue = render(
            '<lily-tree-select label="Select category" value="Cardiology" placeholder="Choose…"></lily-tree-select>',
        );
        expect(withValue.querySelector(".tree-select-trigger")!.textContent).toBe("Cardiology");

        document.body.innerHTML = "";

        const withPlaceholder = render('<lily-tree-select label="Select category" placeholder="Choose…"></lily-tree-select>');
        expect(withPlaceholder.querySelector(".tree-select-trigger")!.textContent).toBe("Choose…");
    });

    test("disabled disables the trigger button", () => {
        const host = render('<lily-tree-select label="Select category" disabled></lily-tree-select>');

        expect((host.querySelector(".tree-select-trigger") as HTMLButtonElement).disabled).toBe(true);
    });

    test("clicking the trigger toggles the panel open and closed, and fires lily-expanded-change", () => {
        const host = render('<lily-tree-select label="Select category"></lily-tree-select>') as unknown as TreeSelect;
        const trigger = host.querySelector(".tree-select-trigger") as HTMLButtonElement;
        const panel = host.querySelector(".tree-select-panel") as HTMLElement;
        const handler = vi.fn();
        host.addEventListener("lily-expanded-change", handler);

        trigger.click();
        expect(host.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hidden).toBe(false);
        expect(host.expanded).toBe(true);
        expect(handler).toHaveBeenCalledTimes(1);
        expect((handler.mock.calls[0][0] as CustomEvent<{ expanded: boolean }>).detail).toEqual({ expanded: true });

        trigger.click();
        expect(host.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hidden).toBe(true);
        expect(handler).toHaveBeenCalledTimes(2);
    });

    test("a disabled trigger does not respond to clicks", () => {
        const host = render('<lily-tree-select label="Select category" disabled></lily-tree-select>') as unknown as TreeSelect;
        const trigger = host.querySelector(".tree-select-trigger") as HTMLButtonElement;

        trigger.click();

        expect(host.getAttribute("aria-expanded")).toBe("false");
    });

    test("Escape closes the panel and returns focus to the trigger", () => {
        const host = render('<lily-tree-select label="Select category" expanded></lily-tree-select>') as unknown as TreeSelect;
        const trigger = host.querySelector(".tree-select-trigger") as HTMLButtonElement;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(trigger);
    });

    test("the expanded property sets/reads state and is idempotent", () => {
        const host = render('<lily-tree-select label="Select category"></lily-tree-select>') as unknown as TreeSelect;
        const handler = vi.fn();
        host.addEventListener("lily-expanded-change", handler);

        host.expanded = true;
        expect(host.getAttribute("aria-expanded")).toBe("true");
        expect(handler).toHaveBeenCalledTimes(1);

        host.expanded = true;
        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("moves tree content children into the panel", () => {
        const host = render(
            '<lily-tree-select label="Select category" expanded><ul role="tree"><li role="treeitem">Cardiology</li></ul></lily-tree-select>',
        );

        const panel = host.querySelector(".tree-select-panel") as HTMLElement;
        expect(panel.querySelector("ul[role=tree]")).toBeTruthy();
        expect(panel.querySelector("li")?.textContent).toBe("Cardiology");
    });
});
