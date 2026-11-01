// The Popover API path. jsdom has no showPopover/hidePopover, so these tests stub them on the prototype and
// fire the `toggle` event a browser would; the component tests run the `hidden` fallback.
import { fireEvent, render, screen } from "@testing-library/vue";
import { nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ContextualHelp from "./ContextualHelp.vue";
import Popover from "./Popover.vue";
import Popup from "./Popup.vue";

type Proto = { showPopover?: () => void; hidePopover?: () => void };
const proto = HTMLElement.prototype as unknown as Proto;
let showPopover: ReturnType<typeof vi.fn>;
let hidePopover: ReturnType<typeof vi.fn>;

async function fireToggle(node: Element, newState: "open" | "closed") {
    const event = new Event("toggle");
    Object.assign(event, { newState, oldState: newState === "open" ? "closed" : "open" });
    node.dispatchEvent(event);
    await nextTick();
}

beforeEach(() => {
    showPopover = vi.fn();
    hidePopover = vi.fn();
    proto.showPopover = showPopover as unknown as () => void;
    proto.hidePopover = hidePopover as unknown as () => void;
});

afterEach(() => {
    delete proto.showPopover;
    delete proto.hidePopover;
});

for (const [name, Subject, cls] of [
    ["Popover", Popover, "popover"],
    ["Popup", Popup, "popup"],
] as const) {
    describe(`${name} with the Popover API`, () => {
        test("renders popover=auto and opens with showPopover", () => {
            const { container } = render(Subject, {
                props: { label: "Info", open: true },
                slots: { default: "C" },
            });
            const root = container.querySelector(`div.${cls}`) as HTMLElement;
            expect(root.getAttribute("popover")).toBe("auto");
            expect(root.hasAttribute("hidden")).toBe(false);
            expect(showPopover).toHaveBeenCalledOnce();
        });

        test("closing open calls hidePopover", async () => {
            const { rerender } = render(Subject, {
                props: { label: "Info", open: true },
                slots: { default: "C" },
            });
            await rerender({ open: false });
            expect(hidePopover).toHaveBeenCalled();
        });

        test("the toggle event (light dismiss, a commandfor trigger) emits update:open", async () => {
            const onUpdate = vi.fn();
            const { container } = render(Subject, {
                props: { label: "Info", open: true, "onUpdate:open": onUpdate },
                slots: { default: "C" },
            });
            const root = container.querySelector(`div.${cls}`) as HTMLElement;
            await fireToggle(root, "closed");
            expect(onUpdate).toHaveBeenLastCalledWith(false);
        });
    });
}

describe("ContextualHelp with the Popover API", () => {
    test("the click leaves toggling to the browser; the toggle event drives aria-expanded", async () => {
        const { container } = render(ContextualHelp, {
            props: { label: "Help", triggerLabel: "?" },
            slots: { default: "Body" },
        });
        const trigger = screen.getByRole("button", { name: "Help" });
        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        await fireEvent.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        await fireToggle(panel, "open");
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        await fireToggle(panel, "closed");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hasAttribute("hidden")).toBe(false);
    });
});

// The menu group (tasks.md P18-T11): the menu panel is popover="auto"; the APG arrow-key focus code stays.
import ActionGroup from "./ActionGroup.vue";
import ContextMenu from "./ContextMenu.vue";
import DropdownMenu from "./DropdownMenu.vue";
import SplitButton from "./SplitButton.vue";
import { popoverSupported, syncPopover } from "./popover";

const ITEMS =
    "<div><div role='menuitem' tabindex='-1'>Edit</div><div role='menuitem' tabindex='-1'>Delete</div></div>";

const menus = [
    {
        name: "DropdownMenu",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (attrs: Record<string, unknown> = {}): any =>
            render(DropdownMenu, { props: { label: "Options" }, attrs, slots: { default: ITEMS } }),
        trigger: "button",
        menu: "[role='menu']",
        model: "open",
        event: undefined,
    },
    {
        name: "SplitButton",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (attrs: Record<string, unknown> = {}): any =>
            render(SplitButton, {
                props: { label: "Save", primaryLabel: "Save", menuLabel: "More" },
                attrs,
                slots: { default: ITEMS },
            }),
        trigger: ".split-button-menu-trigger",
        menu: ".split-button-menu",
        model: "menuOpen",
        event: "onMenuToggle",
    },
    {
        name: "ActionGroup",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (attrs: Record<string, unknown> = {}): any =>
            render(ActionGroup, {
                props: { label: "Editing", overflowLabel: "More" },
                attrs,
                slots: { overflow: ITEMS },
            }),
        trigger: ".action-group-overflow-trigger",
        menu: ".action-group-overflow-menu",
        model: "overflowOpen",
        event: "onOverflowToggle",
    },
];

describe("popover.ts", () => {
    test("syncPopover calls the API, or falls back to hidden without it", () => {
        const node = document.createElement("div");
        node.setAttribute("popover", "auto");
        expect(popoverSupported(node)).toBe(true);
        syncPopover(node, true);
        expect(showPopover).toHaveBeenCalledOnce();
        delete proto.showPopover;
        syncPopover(node, false);
        expect(node.hasAttribute("hidden")).toBe(true);
        expect(node.hasAttribute("popover")).toBe(false);
    });
});

for (const m of menus) {
    describe(`${m.name} with the Popover API`, () => {
        test("the trigger names the popover=auto menu and leaves the click to the browser", async () => {
            const { container } = m.render();
            const trigger = container.querySelector(m.trigger) as HTMLElement;
            const menu = container.querySelector(m.menu) as HTMLElement;
            expect(menu.getAttribute("popover")).toBe("auto");
            expect(trigger.getAttribute("command")).toBe("toggle-popover");
            expect(trigger.getAttribute("commandfor")).toBe(menu.id);
            expect(trigger.getAttribute("popovertarget")).toBe(menu.id);
            expect(trigger.getAttribute("aria-controls")).toBe(menu.id);
            await fireEvent.click(trigger);
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
            expect(showPopover).not.toHaveBeenCalled();
            expect(menu.hasAttribute("hidden")).toBe(false);
        });

        test("the menu's toggle event drives aria-expanded and the model", async () => {
            const update = vi.fn();
            const { container } = m.render({ [`onUpdate:${m.model}`]: update });
            const trigger = container.querySelector(m.trigger) as HTMLElement;
            const menu = container.querySelector(m.menu) as HTMLElement;
            await fireToggle(menu, "open");
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            await fireToggle(menu, "closed");
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
            expect(update.mock.calls).toEqual([[true], [false]]);
        });
    });
}

describe("ContextMenu with the Popover API", () => {
    test("open shows it with showPopover, and a light dismiss writes open back", async () => {
        const update = vi.fn();
        const { container, rerender } = render(ContextMenu, {
            props: { label: "Actions", open: true, "onUpdate:open": update },
            slots: { default: ITEMS },
        });
        const menu = container.querySelector(".context-menu") as HTMLElement;
        expect(menu.getAttribute("popover")).toBe("auto");
        expect(showPopover).toHaveBeenCalledOnce();
        await fireToggle(menu, "closed");
        expect(update).toHaveBeenCalledWith(false);
        await rerender({ open: false });
        expect(hidePopover).toHaveBeenCalled();
    });
});

describe("the menu group without the Popover API", () => {
    beforeEach(() => {
        delete proto.showPopover;
        delete proto.hidePopover;
    });

    for (const m of menus) {
        test(`${m.name}: the trigger toggles the menu with hidden${m.event ? ", unless a listener prevents the default" : ""}`, async () => {
            const { container, unmount } = m.render();
            const trigger = container.querySelector(m.trigger) as HTMLElement;
            const menu = container.querySelector(m.menu) as HTMLElement;
            expect(menu.hasAttribute("hidden")).toBe(true);
            await fireEvent.click(trigger);
            expect(menu.hasAttribute("hidden")).toBe(false);
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            await fireEvent.click(trigger);
            expect(menu.hasAttribute("hidden")).toBe(true);
            unmount();
            if (!m.event) return;
            const again = m.render({ [m.event]: (event: MouseEvent) => event.preventDefault() });
            await fireEvent.click(again.container.querySelector(m.trigger) as HTMLElement);
            expect(
                (again.container.querySelector(m.menu) as HTMLElement).hasAttribute("hidden"),
            ).toBe(true);
        });
    }
});
