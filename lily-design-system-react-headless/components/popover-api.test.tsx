// The Popover API path. jsdom has no showPopover/hidePopover, so these tests stub them on the prototype and
// fire the `toggle` event a browser would; the component tests run the `hidden` fallback.
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ContextualHelp from "./ContextualHelp";
import Popover, { popoverSupported, syncPopover } from "./Popover";
import Popup from "./Popup";

type Proto = { showPopover?: () => void; hidePopover?: () => void };
const proto = HTMLElement.prototype as unknown as Proto;
let showPopover: ReturnType<typeof vi.fn>;
let hidePopover: ReturnType<typeof vi.fn>;

function fireToggle(node: Element, newState: "open" | "closed") {
    const event = new Event("toggle");
    Object.assign(event, { newState, oldState: newState === "open" ? "closed" : "open" });
    act(() => {
        node.dispatchEvent(event);
    });
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

describe("syncPopover", () => {
    test("calls showPopover and hidePopover where the API exists", () => {
        const node = document.createElement("div");
        expect(popoverSupported(node)).toBe(true);
        syncPopover(node, true);
        syncPopover(node, false);
        expect(showPopover).toHaveBeenCalledOnce();
        expect(hidePopover).toHaveBeenCalledOnce();
    });

    test("falls back to hidden, dropping popover, without the API", () => {
        delete proto.showPopover;
        const node = document.createElement("div");
        node.setAttribute("popover", "auto");
        syncPopover(node, false);
        expect(node.hasAttribute("hidden")).toBe(true);
        expect(node.hasAttribute("popover")).toBe(false);
    });
});

for (const [name, Subject, cls] of [
    ["Popover", Popover, "popover"],
    ["Popup", Popup, "popup"],
] as const) {
    describe(`${name} with the Popover API`, () => {
        test("renders popover=auto and opens with showPopover", () => {
            const { container } = render(
                <Subject
                    label="Info"
                    open
                >
                    C
                </Subject>,
            );
            const root = container.querySelector(`div.${cls}`) as HTMLElement;
            expect(root.getAttribute("popover")).toBe("auto");
            expect(root.hasAttribute("hidden")).toBe(false);
            expect(showPopover).toHaveBeenCalledOnce();
        });

        test("closing open calls hidePopover", () => {
            const { rerender } = render(
                <Subject
                    label="Info"
                    open
                >
                    C
                </Subject>,
            );
            rerender(
                <Subject
                    label="Info"
                    open={false}
                >
                    C
                </Subject>,
            );
            expect(hidePopover).toHaveBeenCalled();
        });

        test("the toggle event (light dismiss, a commandfor trigger) calls onChange", () => {
            const onChange = vi.fn();
            const { container } = render(
                <Subject
                    label="Info"
                    open
                    onChange={onChange}
                >
                    C
                </Subject>,
            );
            const root = container.querySelector(`div.${cls}`) as HTMLElement;
            fireToggle(root, "closed");
            expect(onChange).toHaveBeenLastCalledWith(false);
            fireToggle(root, "open");
            expect(onChange).toHaveBeenLastCalledWith(true);
        });
    });
}

describe("ContextualHelp with the Popover API", () => {
    test("the click leaves toggling to the browser; the toggle event drives aria-expanded", () => {
        const onChange = vi.fn();
        const { container } = render(
            <ContextualHelp
                label="Help"
                triggerLabel="?"
                onChange={onChange}
            >
                Body
            </ContextualHelp>,
        );
        const trigger = screen.getByRole("button", { name: "Help" });
        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        fireEvent.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        fireToggle(panel, "open");
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(onChange).toHaveBeenLastCalledWith(true);
        fireToggle(panel, "closed");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hasAttribute("hidden")).toBe(false);
    });
});

// The menu group (tasks.md P18-T11): the menu panel is popover="auto"; the APG arrow-key focus code stays.
import ActionGroup from "./ActionGroup";
import ContextMenu from "./ContextMenu";
import DropdownMenu from "./DropdownMenu";
import SplitButton from "./SplitButton";

const items = (
    <div>
        <div
            role="menuitem"
            tabIndex={-1}
        >
            Edit
        </div>
        <div
            role="menuitem"
            tabIndex={-1}
        >
            Delete
        </div>
    </div>
);

const menus = [
    {
        name: "DropdownMenu",
        render: (extra: Record<string, unknown> = {}) =>
            render(
                <DropdownMenu
                    label="Options"
                    {...extra}
                >
                    {items}
                </DropdownMenu>,
            ),
        trigger: "button",
        menu: "[role='menu']",
        handler: undefined,
    },
    {
        name: "SplitButton",
        render: (extra: Record<string, unknown> = {}) =>
            render(
                <SplitButton
                    label="Save"
                    primaryLabel="Save"
                    menuLabel="More"
                    {...extra}
                >
                    {items}
                </SplitButton>,
            ),
        trigger: ".split-button-menu-trigger",
        menu: ".split-button-menu",
        handler: "onMenuToggle",
    },
    {
        name: "ActionGroup",
        render: (extra: Record<string, unknown> = {}) =>
            render(
                <ActionGroup
                    label="Editing"
                    overflowLabel="More"
                    overflow={items}
                    {...extra}
                />,
            ),
        trigger: ".action-group-overflow-trigger",
        menu: ".action-group-overflow-menu",
        handler: "onOverflowToggle",
    },
];

for (const m of menus) {
    describe(`${m.name} with the Popover API`, () => {
        test("the trigger names the popover=auto menu and leaves the click to the browser", () => {
            const { container } = m.render();
            const trigger = container.querySelector(m.trigger) as HTMLElement;
            const menu = container.querySelector(m.menu) as HTMLElement;
            expect(menu.getAttribute("popover")).toBe("auto");
            expect(trigger.getAttribute("command")).toBe("toggle-popover");
            expect(trigger.getAttribute("commandfor")).toBe(menu.id);
            expect(trigger.getAttribute("popovertarget")).toBe(menu.id);
            expect(trigger.getAttribute("aria-controls")).toBe(menu.id);
            fireEvent.click(trigger);
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
            expect(showPopover).not.toHaveBeenCalled();
            expect(menu.hasAttribute("hidden")).toBe(false);
        });

        test("the menu's toggle event drives aria-expanded and onChange", () => {
            const onChange = vi.fn();
            const { container } = m.render({ onChange });
            const trigger = container.querySelector(m.trigger) as HTMLElement;
            const menu = container.querySelector(m.menu) as HTMLElement;
            fireToggle(menu, "open");
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            fireToggle(menu, "closed");
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
            expect(onChange.mock.calls).toEqual([[true], [false]]);
        });
    });
}

describe("ContextMenu with the Popover API", () => {
    test("open shows it with showPopover, and a light dismiss reports onChange(false)", () => {
        const onChange = vi.fn();
        const { container, rerender } = render(
            <ContextMenu
                label="Actions"
                open
                onChange={onChange}
            >
                {items}
            </ContextMenu>,
        );
        const menu = container.querySelector(".context-menu") as HTMLElement;
        expect(menu.getAttribute("popover")).toBe("auto");
        expect(showPopover).toHaveBeenCalledOnce();
        fireToggle(menu, "closed");
        expect(onChange).toHaveBeenCalledWith(false);
        rerender(
            <ContextMenu
                label="Actions"
                open={false}
                onChange={onChange}
            >
                {items}
            </ContextMenu>,
        );
        expect(hidePopover).toHaveBeenCalledOnce();
    });
});

describe("the menu group without the Popover API", () => {
    beforeEach(() => {
        delete proto.showPopover;
        delete proto.hidePopover;
    });

    for (const m of menus) {
        test(`${m.name}: the trigger toggles the menu with hidden${m.handler ? ", unless its handler prevents the default" : ""}`, () => {
            const { container, unmount } = m.render();
            const trigger = container.querySelector(m.trigger) as HTMLElement;
            const menu = container.querySelector(m.menu) as HTMLElement;
            expect(menu.hasAttribute("hidden")).toBe(true);
            fireEvent.click(trigger);
            expect(menu.hasAttribute("hidden")).toBe(false);
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            fireEvent.click(trigger);
            expect(menu.hasAttribute("hidden")).toBe(true);
            unmount();
            if (!m.handler) return;
            const again = m.render({
                [m.handler]: (event: React.MouseEvent) => event.preventDefault(),
            });
            fireEvent.click(again.container.querySelector(m.trigger) as HTMLElement);
            expect(
                (again.container.querySelector(m.menu) as HTMLElement).hasAttribute("hidden"),
            ).toBe(true);
        });
    }
});
