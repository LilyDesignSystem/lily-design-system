import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Cascader";

describe("Cascader", () => {
    test("renders a combobox with the required aria-label", () => {
        render(
            <Subject label="Region">
                <ul>options</ul>
            </Subject>
        );

        const combo: HTMLElement = screen.getByRole("combobox");
        expect(combo.getAttribute("aria-label")).toBe("Region");
        expect(combo.getAttribute("aria-haspopup")).toBe("tree");
    });

    test("applies the cascader root class", () => {
        const { container } = render(
            <Subject label="R">
                <ul>x</ul>
            </Subject>
        );

        const root: HTMLElement = container.querySelector(".cascader") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("aria-expanded reflects expanded prop", () => {
        const { rerender } = render(
            <Subject label="R" expanded={false}>
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("false");

        rerender(
            <Subject label="R" expanded={true}>
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    });

    test("renders trigger button with value when provided", () => {
        render(
            <Subject label="R" value="Asia / Japan">
                <ul>x</ul>
            </Subject>
        );

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.textContent).toBe("Asia / Japan");
    });

    test("falls back to placeholder when no value", () => {
        render(
            <Subject label="R" placeholder="Choose…">
                <ul>x</ul>
            </Subject>
        );

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.textContent).toBe("Choose…");
    });

    test("disables the trigger when disabled", () => {
        render(
            <Subject label="R" disabled>
                <ul>x</ul>
            </Subject>
        );

        const trigger: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(trigger.disabled).toBe(true);
    });

    test("hides the panel when not expanded", () => {
        const { container } = render(
            <Subject label="R" expanded={false}>
                <ul>x</ul>
            </Subject>
        );

        const panel: HTMLElement = container.querySelector(".cascader-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("shows the panel when expanded", () => {
        const { container } = render(
            <Subject label="R" expanded={true}>
                <ul>x</ul>
            </Subject>
        );

        const panel: HTMLElement = container.querySelector(".cascader-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("invokes onClick when trigger clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <Subject label="R" onClick={handleClick}>
                <ul>x</ul>
            </Subject>
        );

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });
});
