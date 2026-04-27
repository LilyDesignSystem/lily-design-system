import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TreeSelect";

describe("TreeSelect", () => {
    test("renders a combobox with the required aria-label", () => {
        render(
            <Subject label="Category">
                <ul>tree</ul>
            </Subject>
        );

        const combo: HTMLElement = screen.getByRole("combobox");
        expect(combo.getAttribute("aria-label")).toBe("Category");
        expect(combo.getAttribute("aria-haspopup")).toBe("tree");
    });

    test("applies the tree-select root class", () => {
        const { container } = render(
            <Subject label="C">
                <ul>x</ul>
            </Subject>
        );
        const root: HTMLElement = container.querySelector(".tree-select") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("aria-expanded reflects expanded prop", () => {
        const { rerender } = render(
            <Subject label="C" expanded={false}>
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("false");

        rerender(
            <Subject label="C" expanded={true}>
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    });

    test("aria-multiselectable when multiple", () => {
        render(
            <Subject label="C" multiple>
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("combobox").getAttribute("aria-multiselectable")).toBe("true");
    });

    test("no aria-multiselectable when single select", () => {
        render(
            <Subject label="C">
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("combobox").getAttribute("aria-multiselectable")).toBeNull();
    });

    test("trigger displays value when provided", () => {
        render(
            <Subject label="C" value="Fruits / Apple">
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("button").textContent).toBe("Fruits / Apple");
    });

    test("trigger displays placeholder when no value", () => {
        render(
            <Subject label="C" placeholder="Pick…">
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("button").textContent).toBe("Pick…");
    });

    test("disables the trigger when disabled", () => {
        render(
            <Subject label="C" disabled>
                <ul>x</ul>
            </Subject>
        );
        const trigger: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(trigger.disabled).toBe(true);
    });

    test("hides the panel when not expanded", () => {
        const { container } = render(
            <Subject label="C" expanded={false}>
                <ul>x</ul>
            </Subject>
        );
        const panel: HTMLElement = container.querySelector(".tree-select-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("shows the panel when expanded", () => {
        const { container } = render(
            <Subject label="C" expanded={true}>
                <ul>x</ul>
            </Subject>
        );
        const panel: HTMLElement = container.querySelector(".tree-select-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("invokes onClick when trigger clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <Subject label="C" onClick={handleClick}>
                <ul>x</ul>
            </Subject>
        );
        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });
});
