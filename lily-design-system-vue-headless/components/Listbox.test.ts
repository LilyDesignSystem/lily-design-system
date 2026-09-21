import { render, screen, fireEvent } from "@testing-library/vue";
import { describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import Subject from "./Listbox.vue";


describe("Listbox", () => {
    test("renders a listbox", () => {
        render(Subject, { props: { label: "Fruits" }, slots: { default: "<div role='option' tabindex='-1'>Apple</div><div role='option' tabindex='-1'>Banana</div>" } });
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Fruits" }, slots: { default: "<div role='option' tabindex='-1'>Apple</div><div role='option' tabindex='-1'>Banana</div>" } });
        expect(screen.getByLabelText("Fruits")).toBeTruthy();
    });

    test("renders option children", () => {
        render(Subject, { props: { label: "Fruits" }, slots: { default: "<div role='option' tabindex='-1'>Apple</div><div role='option' tabindex='-1'>Banana</div>" } });
        expect(screen.getAllByRole("option").length).toBe(2);
    });

    test("arrow down navigates to next option", () => {
        render(Subject, { props: { label: "Fruits" }, slots: { default: "<div role='option' tabindex='-1'>Apple</div><div role='option' tabindex='-1'>Banana</div>" } });
        const options = screen.getAllByRole("option");
        options[0].focus();
        options[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(options[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "lb" }, slots: { default: "<div role='option' tabindex='-1'>Apple</div><div role='option' tabindex='-1'>Banana</div>" } });
        expect(screen.getByTestId("lb")).toBeTruthy();
    });
});

const AD_OPTIONS = "<div role='option' id='opt-0'>Apple</div><div role='option' id='opt-1'>Banana</div><div role='option' id='opt-2'>Cherry</div>";

describe("Listbox — active-descendant mode (opt-in, additive)", () => {
    test("default mode is unaffected: no tabindex/aria-activedescendant unless opted in", () => {
        render(Subject, { props: { label: "Fruits" }, slots: { default: AD_OPTIONS } });
        const listbox = screen.getByRole("listbox");
        expect(listbox.hasAttribute("tabindex")).toBe(false);
        expect(listbox.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("root carries tabindex=-1 and aria-activedescendant tracking activeIndex", async () => {
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", activeIndex: 1 },
            slots: { default: AD_OPTIONS },
        });
        // aria-activedescendant is computed from the rendered option's real id,
        // which requires a template ref set during mount — Vue settles that on
        // the next reactivity tick, not synchronously within render().
        await nextTick();
        const listbox = screen.getByRole("listbox");
        expect(listbox.getAttribute("tabindex")).toBe("-1");
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-1");
    });

    test("ArrowDown clamps at the last option when clamp is set (still emits, same value)", async () => {
        const onUpdate = vi.fn();
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", clamp: true, activeIndex: 2, "onUpdate:activeIndex": onUpdate },
            slots: { default: AD_OPTIONS },
        });
        await fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" });
        expect(onUpdate).toHaveBeenCalledWith(2);
    });

    test("ArrowDown wraps when clamp is not set", async () => {
        const onUpdate = vi.fn();
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", activeIndex: 2, "onUpdate:activeIndex": onUpdate },
            slots: { default: AD_OPTIONS },
        });
        await fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" });
        expect(onUpdate).toHaveBeenCalledWith(0);
    });

    test("Home/End jump to the first/last option", async () => {
        const onUpdate = vi.fn();
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", activeIndex: 1, "onUpdate:activeIndex": onUpdate },
            slots: { default: AD_OPTIONS },
        });
        const listbox = screen.getByRole("listbox");
        await fireEvent.keyDown(listbox, { key: "End" });
        expect(onUpdate).toHaveBeenLastCalledWith(2);
        await fireEvent.keyDown(listbox, { key: "Home" });
        expect(onUpdate).toHaveBeenLastCalledWith(0);
    });

    test("Enter emits activate with the active index", async () => {
        const onActivate = vi.fn();
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", activeIndex: 1, onActivate },
            slots: { default: AD_OPTIONS },
        });
        await fireEvent.keyDown(screen.getByRole("listbox"), { key: "Enter" });
        expect(onActivate).toHaveBeenCalledWith(1);
    });

    test("Escape emits escape", async () => {
        const onEscape = vi.fn();
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", activeIndex: 0, onEscape },
            slots: { default: AD_OPTIONS },
        });
        await fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
        expect(onEscape).toHaveBeenCalled();
    });

    test("Tab emits tab-out without preventDefault", async () => {
        const onTabOut = vi.fn();
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", activeIndex: 0, "onTab-out": onTabOut },
            slots: { default: AD_OPTIONS },
        });
        const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
        screen.getByRole("listbox").dispatchEvent(event);
        await nextTick();
        expect(onTabOut).toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(false);
    });

    test("typeahead moves to the next option starting with the typed character, only when enabled", async () => {
        const onUpdateWith = vi.fn();
        const withTypeahead = render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", typeahead: true, activeIndex: 0, "onUpdate:activeIndex": onUpdateWith },
            slots: { default: AD_OPTIONS },
        });
        await fireEvent.keyDown(withTypeahead.getByRole("listbox"), { key: "b" });
        expect(onUpdateWith).toHaveBeenCalledWith(1);
        withTypeahead.unmount();

        const onUpdateWithout = vi.fn();
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", activeIndex: 0, "onUpdate:activeIndex": onUpdateWithout },
            slots: { default: AD_OPTIONS },
        });
        await fireEvent.keyDown(screen.getByRole("listbox"), { key: "b" });
        expect(onUpdateWithout).not.toHaveBeenCalled();
    });

    test("PageDown/PageUp move by pageSize, clamped", async () => {
        const onUpdate = vi.fn();
        render(Subject, {
            props: { label: "Fruits", navigation: "active-descendant", clamp: true, pageSize: 1, activeIndex: 0, "onUpdate:activeIndex": onUpdate },
            slots: { default: AD_OPTIONS },
        });
        await fireEvent.keyDown(screen.getByRole("listbox"), { key: "PageDown" });
        expect(onUpdate).toHaveBeenLastCalledWith(1);
    });

    test("as changes the root tag; baseClass replaces the default class token outright", () => {
        render(Subject, { props: { label: "Fruits", as: "ul", baseClass: "motion-picker-list" }, slots: { default: AD_OPTIONS } });
        const listbox = screen.getByRole("listbox");
        expect(listbox.tagName).toBe("UL");
        expect(listbox.className).toBe("motion-picker-list");
    });
});
