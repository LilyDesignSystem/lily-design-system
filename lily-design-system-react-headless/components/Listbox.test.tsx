import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Listbox";

const options = (
    <>
        <div role="option" tabIndex={-1}>Apple</div>
        <div role="option" tabIndex={-1}>Banana</div>
    </>
);

describe("Listbox", () => {
    test("renders a listbox", () => {
        render(<Subject label="Fruits">{options}</Subject>);
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Fruits">{options}</Subject>);
        expect(screen.getByLabelText("Fruits")).toBeTruthy();
    });

    test("renders option children", () => {
        render(<Subject label="Fruits">{options}</Subject>);
        expect(screen.getAllByRole("option").length).toBe(2);
    });

    test("arrow down navigates to next option", async () => {
        const user = userEvent.setup();
        render(<Subject label="Fruits">{options}</Subject>);
        const opts = screen.getAllByRole("option");
        opts[0].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(opts[1]);
    });

    test("passes through attributes", () => {
        render(<Subject label="F" data-testid="lb">{options}</Subject>);
        expect(screen.getByTestId("lb")).toBeTruthy();
    });
});

function activeDescendantOptions(activeIndex: number) {
    const labels = ["Apple", "Banana", "Cherry"];
    return (
        <>
            {labels.map((text, i) => (
                <div key={text} role="option" id={`opt-${i}`} aria-selected={i === activeIndex}>
                    {text}
                </div>
            ))}
        </>
    );
}

describe("Listbox — active-descendant mode (opt-in, additive)", () => {
    test("default mode is unaffected: no tabindex/aria-activedescendant unless opted in", () => {
        render(<Subject label="Fruits">{options}</Subject>);
        const listbox = screen.getByRole("listbox");
        expect(listbox.hasAttribute("tabindex")).toBe(false);
        expect(listbox.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("root carries tabindex=-1 and aria-activedescendant tracking activeIndex", () => {
        render(
            <Subject label="Fruits" navigation="active-descendant" activeIndex={1}>
                {activeDescendantOptions(1)}
            </Subject>,
        );
        const listbox = screen.getByRole("listbox");
        expect(listbox.getAttribute("tabindex")).toBe("-1");
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-1");
    });

    test("ArrowDown clamps at the end when clamp is set", async () => {
        const user = userEvent.setup();
        let activeIndex = 2;
        const onActiveIndexChange = vi.fn((i: number) => (activeIndex = i));
        const { rerender } = render(
            <Subject
                label="Fruits"
                navigation="active-descendant"
                clamp
                activeIndex={activeIndex}
                onActiveIndexChange={onActiveIndexChange}
            >
                {activeDescendantOptions(activeIndex)}
            </Subject>,
        );
        const listbox = screen.getByRole("listbox");
        listbox.focus();
        await user.keyboard("{ArrowDown}");
        expect(onActiveIndexChange).toHaveBeenCalledWith(2);
    });

    test("ArrowDown wraps when clamp is not set", async () => {
        const user = userEvent.setup();
        const onActiveIndexChange = vi.fn();
        render(
            <Subject
                label="Fruits"
                navigation="active-descendant"
                activeIndex={2}
                onActiveIndexChange={onActiveIndexChange}
            >
                {activeDescendantOptions(2)}
            </Subject>,
        );
        const listbox = screen.getByRole("listbox");
        listbox.focus();
        await user.keyboard("{ArrowDown}");
        expect(onActiveIndexChange).toHaveBeenCalledWith(0);
    });

    test("Home/End jump to the first/last option", async () => {
        const user = userEvent.setup();
        const onActiveIndexChange = vi.fn();
        render(
            <Subject
                label="Fruits"
                navigation="active-descendant"
                activeIndex={1}
                onActiveIndexChange={onActiveIndexChange}
            >
                {activeDescendantOptions(1)}
            </Subject>,
        );
        const listbox = screen.getByRole("listbox");
        listbox.focus();
        await user.keyboard("{End}");
        expect(onActiveIndexChange).toHaveBeenCalledWith(2);
        await user.keyboard("{Home}");
        expect(onActiveIndexChange).toHaveBeenCalledWith(0);
    });

    test("Enter calls onActivate with the active index", async () => {
        const user = userEvent.setup();
        const onActivate = vi.fn();
        render(
            <Subject label="Fruits" navigation="active-descendant" activeIndex={1} onActivate={onActivate}>
                {activeDescendantOptions(1)}
            </Subject>,
        );
        screen.getByRole("listbox").focus();
        await user.keyboard("{Enter}");
        expect(onActivate).toHaveBeenCalledWith(1);
    });

    test("Escape calls onEscape", async () => {
        const user = userEvent.setup();
        const onEscape = vi.fn();
        render(
            <Subject label="Fruits" navigation="active-descendant" activeIndex={0} onEscape={onEscape}>
                {activeDescendantOptions(0)}
            </Subject>,
        );
        screen.getByRole("listbox").focus();
        await user.keyboard("{Escape}");
        expect(onEscape).toHaveBeenCalled();
    });

    test("Tab calls onTabOut without preventing default", async () => {
        const user = userEvent.setup();
        const onTabOut = vi.fn();
        render(
            <>
                <Subject label="Fruits" navigation="active-descendant" activeIndex={0} onTabOut={onTabOut}>
                    {activeDescendantOptions(0)}
                </Subject>
                <button>after</button>
            </>,
        );
        screen.getByRole("listbox").focus();
        await user.keyboard("{Tab}");
        expect(onTabOut).toHaveBeenCalled();
        // Default Tab was not prevented: focus moved on to the next tabbable element.
        expect(document.activeElement).toBe(screen.getByRole("button", { name: "after" }));
    });

    test("typeahead moves to the next option starting with the typed character, only when enabled", async () => {
        const user = userEvent.setup();
        const onActiveIndexChangeWith = vi.fn();
        const { unmount } = render(
            <Subject
                label="Fruits"
                navigation="active-descendant"
                typeahead
                activeIndex={0}
                onActiveIndexChange={onActiveIndexChangeWith}
            >
                {activeDescendantOptions(0)}
            </Subject>,
        );
        screen.getByRole("listbox").focus();
        await user.keyboard("b");
        expect(onActiveIndexChangeWith).toHaveBeenCalledWith(1);
        unmount();

        const onActiveIndexChangeWithout = vi.fn();
        render(
            <Subject
                label="Fruits"
                navigation="active-descendant"
                activeIndex={0}
                onActiveIndexChange={onActiveIndexChangeWithout}
            >
                {activeDescendantOptions(0)}
            </Subject>,
        );
        screen.getByRole("listbox").focus();
        await user.keyboard("b");
        expect(onActiveIndexChangeWithout).not.toHaveBeenCalled();
    });

    test("PageDown/PageUp move by pageSize, clamped", async () => {
        const user = userEvent.setup();
        const onActiveIndexChange = vi.fn();
        render(
            <Subject
                label="Fruits"
                navigation="active-descendant"
                clamp
                pageSize={1}
                activeIndex={0}
                onActiveIndexChange={onActiveIndexChange}
            >
                {activeDescendantOptions(0)}
            </Subject>,
        );
        screen.getByRole("listbox").focus();
        await user.keyboard("{PageDown}");
        expect(onActiveIndexChange).toHaveBeenCalledWith(1);
    });

    test("baseClass replaces the default class token outright; as changes the root tag", () => {
        render(
            <Subject label="Fruits" as="ul" baseClass="motion-picker-list">
                {options}
            </Subject>,
        );
        const listbox = screen.getByRole("listbox");
        expect(listbox.tagName).toBe("UL");
        expect(listbox.className.trim()).toBe("motion-picker-list");
    });

    test("ref exposes the rendered root", () => {
        const ref = { current: null as HTMLElement | null };
        render(
            <Subject label="Fruits" navigation="active-descendant" ref={ref}>
                {activeDescendantOptions(0)}
            </Subject>,
        );
        expect(ref.current).toBe(screen.getByRole("listbox"));
    });
});
