// The menu group (tasks.md P18-T11): the menu panel is popover="auto"; the APG arrow-key focus code stays. jsdom
// has no showPopover/hidePopover, so the Popover API path stubs them on the prototype and fires the `toggle` event
// a browser would; the fallback path runs without them.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ActionGroup } from "./action-group.js";
import { ContextMenu } from "./context-menu.js";
import { DropdownMenu } from "./dropdown-menu.js";
import { SplitButton } from "./split-button.js";

for (const [tag, ctor] of [
    ["lily-action-group", ActionGroup],
    ["lily-context-menu", ContextMenu],
    ["lily-dropdown-menu", DropdownMenu],
    ["lily-split-button", SplitButton],
] as const) {
    if (!customElements.get(tag)) customElements.define(tag, ctor);
}

type Proto = { showPopover?: () => void; hidePopover?: () => void };
const proto = HTMLElement.prototype as unknown as Proto;

function fireToggle(node: Element, newState: "open" | "closed") {
    const event = new Event("toggle");
    Object.assign(event, { newState, oldState: newState === "open" ? "closed" : "open" });
    node.dispatchEvent(event);
}

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

afterEach(() => {
    document.body.innerHTML = "";
});

const ITEMS = `<div role="menuitem" tabindex="-1">Edit</div><div role="menuitem" tabindex="-1">Delete</div>`;

const cases = [
    {
        name: "DropdownMenu",
        html: `<lily-dropdown-menu label="Options">${ITEMS}</lily-dropdown-menu>`,
        trigger: "button",
        menu: "[role='menu']",
        state: (host: HTMLElement) => host.hasAttribute("open"),
    },
    {
        name: "SplitButton",
        html: `<lily-split-button label="Save" primary-label="Save" menu-label="More">${ITEMS}</lily-split-button>`,
        trigger: ".split-button-menu-trigger",
        menu: ".split-button-menu",
        state: (host: HTMLElement) => (host as SplitButton).menuOpen,
    },
    {
        name: "ActionGroup",
        html: `<lily-action-group label="Editing" overflow-label="More"><div slot="overflow">${ITEMS}</div></lily-action-group>`,
        trigger: ".action-group-overflow-trigger",
        menu: ".action-group-overflow-menu",
        state: (host: HTMLElement) => host.hasAttribute("overflow-open"),
    },
];

describe("the menu group with the Popover API", () => {
    let showPopover: ReturnType<typeof vi.fn>;
    beforeEach(() => {
        showPopover = vi.fn();
        proto.showPopover = showPopover as unknown as () => void;
        proto.hidePopover = vi.fn() as unknown as () => void;
    });
    afterEach(() => {
        delete proto.showPopover;
        delete proto.hidePopover;
    });

    for (const c of cases) {
        test(`${c.name}: the trigger names the popover=auto menu and leaves the click to the browser`, () => {
            const host = render(c.html);
            const trigger = host.querySelector(c.trigger) as HTMLButtonElement;
            const menu = host.querySelector(c.menu) as HTMLElement;
            expect(menu.getAttribute("popover")).toBe("auto");
            expect(trigger.getAttribute("command")).toBe("toggle-popover");
            expect(trigger.getAttribute("commandfor")).toBe(menu.id);
            expect(trigger.getAttribute("popovertarget")).toBe(menu.id);
            expect(trigger.getAttribute("aria-controls")).toBe(menu.id);
            trigger.click();
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
            expect(c.state(host)).toBe(false);
            expect(showPopover).not.toHaveBeenCalled();
            expect(menu.hidden).toBe(false);
        });

        test(`${c.name}: the menu's toggle event writes the state and aria-expanded`, () => {
            const host = render(c.html);
            const trigger = host.querySelector(c.trigger) as HTMLButtonElement;
            const menu = host.querySelector(c.menu) as HTMLElement;
            fireToggle(menu, "open");
            expect(c.state(host)).toBe(true);
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            fireToggle(menu, "closed");
            expect(c.state(host)).toBe(false);
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
        });
    }

    test("ContextMenu: open shows it with showPopover, and a light dismiss removes open", () => {
        const host = render(`<lily-context-menu label="Actions" open>${ITEMS}</lily-context-menu>`);
        expect(host.getAttribute("popover")).toBe("auto");
        expect(showPopover).toHaveBeenCalled();
        fireToggle(host, "closed");
        expect(host.hasAttribute("open")).toBe(false);
    });
});

describe("the menu group without the Popover API", () => {
    for (const c of cases) {
        test(`${c.name}: the trigger toggles the menu with hidden`, () => {
            const host = render(c.html);
            const trigger = host.querySelector(c.trigger) as HTMLButtonElement;
            const menu = host.querySelector(c.menu) as HTMLElement;
            expect(menu.hidden).toBe(true);
            expect(menu.hasAttribute("popover")).toBe(false);
            trigger.click();
            expect(menu.hidden).toBe(false);
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            trigger.click();
            expect(menu.hidden).toBe(true);
        });
    }
});
