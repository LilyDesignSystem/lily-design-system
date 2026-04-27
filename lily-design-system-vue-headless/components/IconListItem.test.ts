import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./IconListItem.vue";


describe("IconListItem", () => {
    test("renders as an li element", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li).toBeTruthy();
    });

    test("has icon-list-item class on root", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.classList.contains("icon-list-item")).toBe(true);
    });

    test("renders default slot text inside text span", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });

        const text: HTMLElement | null = container.querySelector(".icon-list-item-text");
        expect(text).toBeTruthy();
        expect(text?.textContent).toContain("Hello");
    });

    test("renders icon slot inside aria-hidden span", () => {
        const { container } = render(Subject, {
            slots: { default: "Hello", icon: "★" },
        });

        const icon: HTMLElement | null = container.querySelector(".icon-list-item-icon");
        expect(icon).toBeTruthy();
        expect(icon?.getAttribute("aria-hidden")).toBe("true");
        expect(icon?.textContent).toContain("★");
    });

    test("does not render icon span when no icon slot provided", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });

        const icon: HTMLElement | null = container.querySelector(".icon-list-item-icon");
        expect(icon).toBeNull();
    });

    test("default slot text is the accessible content", () => {
        render(Subject, { slots: { default: "Featured", icon: "★" } });

        expect(screen.getByText("Featured")).toBeTruthy();
    });
});
