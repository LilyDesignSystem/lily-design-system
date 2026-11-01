// The menu group (tasks.md P18-T11): the menu panel is popover="auto"; the APG arrow-key focus code stays. jsdom
// has no showPopover/hidePopover, so the Popover API path stubs them on the prototype and fires the `toggle` event a
// browser would; the fallback path runs without them.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ActionGroup } from "./ActionGroup";
import { ContextMenu } from "./ContextMenu";
import { DropdownMenu } from "./DropdownMenu";
import { SplitButton } from "./SplitButton";

type Proto = { showPopover?: () => void; hidePopover?: () => void };
const proto = HTMLElement.prototype as unknown as Proto;

function fireToggle(node: Element, newState: "open" | "closed") {
    const event = new Event("toggle");
    Object.assign(event, { newState, oldState: newState === "open" ? "closed" : "open" });
    node.dispatchEvent(event);
}

interface Case {
    name: string;
    subject: Type<unknown>;
    inputs: Record<string, unknown>;
    model: string;
    trigger: string;
    menu: string;
    output?: string;
}

const cases: Case[] = [
    {
        name: "DropdownMenu",
        subject: DropdownMenu,
        inputs: { label: "Options" },
        model: "open",
        trigger: "button",
        menu: "[role='menu']",
    },
    {
        name: "SplitButton",
        subject: SplitButton,
        inputs: { label: "Save", primaryLabel: "Save", menuLabel: "More" },
        model: "menuOpen",
        trigger: ".split-button-menu-trigger",
        menu: ".split-button-menu",
        output: "menuToggle",
    },
    {
        name: "ActionGroup",
        subject: ActionGroup,
        inputs: { label: "Editing", overflowLabel: "More" },
        model: "overflowOpen",
        trigger: ".action-group-overflow-trigger",
        menu: ".action-group-overflow-menu",
        output: "overflowToggle",
    },
];

function create(c: Case) {
    const fixture = TestBed.createComponent(c.subject);
    for (const [key, value] of Object.entries(c.inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return {
        fixture,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        instance: fixture.componentInstance as any,
        trigger: root.querySelector(c.trigger) as HTMLButtonElement,
        menu: root.querySelector(c.menu) as HTMLElement,
    };
}

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
            const { fixture, trigger, menu } = create(c);
            expect(menu.getAttribute("popover")).toBe("auto");
            expect(trigger.getAttribute("command")).toBe("toggle-popover");
            expect(trigger.getAttribute("commandfor")).toBe(menu.id);
            expect(trigger.getAttribute("popovertarget")).toBe(menu.id);
            expect(trigger.getAttribute("aria-controls")).toBe(menu.id);
            trigger.click();
            fixture.detectChanges();
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
            expect(showPopover).not.toHaveBeenCalled();
            expect(menu.hidden).toBe(false);
        });

        test(`${c.name}: the menu's toggle event writes the model and aria-expanded`, () => {
            const { fixture, instance, trigger, menu } = create(c);
            fireToggle(menu, "open");
            fixture.detectChanges();
            expect(instance[c.model]()).toBe(true);
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            fireToggle(menu, "closed");
            fixture.detectChanges();
            expect(instance[c.model]()).toBe(false);
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
        });
    }

    test("ContextMenu: open shows it with showPopover, and a light dismiss writes open back", () => {
        const fixture = TestBed.createComponent(ContextMenu);
        fixture.componentRef.setInput("label", "Actions");
        fixture.componentRef.setInput("open", true);
        fixture.detectChanges();
        const menu = fixture.nativeElement.querySelector(".context-menu") as HTMLElement;
        expect(menu.getAttribute("popover")).toBe("auto");
        expect(showPopover).toHaveBeenCalled();
        fireToggle(menu, "closed");
        fixture.detectChanges();
        expect(fixture.componentInstance.open()).toBe(false);
    });
});

describe("the menu group without the Popover API", () => {
    for (const c of cases) {
        test(`${c.name}: the trigger toggles the menu with hidden${c.output ? ", unless a listener prevents the default" : ""}`, () => {
            const { fixture, instance, trigger, menu } = create(c);
            expect(menu.hidden).toBe(true);
            trigger.click();
            fixture.detectChanges();
            expect(menu.hidden).toBe(false);
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            trigger.click();
            fixture.detectChanges();
            expect(menu.hidden).toBe(true);
            if (!c.output) return;
            instance[c.output].subscribe((event: MouseEvent) => event.preventDefault());
            trigger.click();
            fixture.detectChanges();
            expect(menu.hidden).toBe(true);
        });
    }
});
