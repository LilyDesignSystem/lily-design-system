import { afterEach, describe, expect, test, vi } from "vitest";

import { Command } from "./command.js";

if (!customElements.get("lily-command")) {
    customElements.define("lily-command", Command);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Command", () => {
    test("carries the base class, role=search, and aria-label", () => {
        const host = render('<lily-command label="Command palette"></lily-command>');

        expect(host.className).toBe("command");
        expect(host.getAttribute("role")).toBe("search");
        expect(host.getAttribute("aria-label")).toBe("Command palette");
    });

    test("builds a search input and a listbox, both labelled", () => {
        const host = render('<lily-command label="Command palette"></lily-command>');

        const input = host.querySelector("input") as HTMLInputElement;
        const listbox = host.querySelector('[role="listbox"]') as HTMLElement;
        expect(input.type).toBe("search");
        expect(input.autocomplete).toBe("off");
        expect(input.getAttribute("aria-label")).toBe("Command palette");
        expect(listbox.getAttribute("aria-label")).toBe("Command palette");
        expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    });

    test("applies the placeholder attribute to the input", () => {
        const host = render('<lily-command label="Command palette" placeholder="Search commands..."></lily-command>');

        expect((host.querySelector("input") as HTMLInputElement).placeholder).toBe("Search commands...");
    });

    test("preserves the consumer's option children inside the listbox", () => {
        const host = render(
            '<lily-command label="Command palette"><div role="option">Open file</div></lily-command>',
        );

        expect(host.querySelector('[role="listbox"] [role="option"]')!.textContent).toBe("Open file");
    });

    test("ArrowDown/ArrowUp navigate aria-activedescendant among options", () => {
        const host = render(
            '<lily-command label="Command palette"><div role="option">Open file</div><div role="option">Save file</div></lily-command>',
        );
        const input = host.querySelector("input") as HTMLInputElement;
        const opts = host.querySelectorAll('[role="option"]');

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(input.getAttribute("aria-activedescendant")).toBe(opts[0].id);

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(input.getAttribute("aria-activedescendant")).toBe(opts[1].id);

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        expect(input.getAttribute("aria-activedescendant")).toBe(opts[0].id);
    });

    test("Enter selects the active option and dispatches lily-change", () => {
        const host = render(
            '<lily-command label="Command palette"><div role="option">Open file</div></lily-command>',
        ) as unknown as Command;
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(host.value).toBe("Open file");
        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("typing updates the bindable value", () => {
        const host = render('<lily-command label="Command palette"></lily-command>') as unknown as Command;
        const input = host.querySelector("input") as HTMLInputElement;

        input.value = "open";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        expect(host.value).toBe("open");
    });

    test("exposes a live value property", () => {
        const host = render('<lily-command label="Command palette"></lily-command>') as unknown as Command;

        host.value = "deploy";

        expect(host.value).toBe("deploy");
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("deploy");
    });
});
