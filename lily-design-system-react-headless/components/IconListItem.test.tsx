import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./IconListItem";

describe("IconListItem", () => {
    test("renders as a list item", () => {
        render(
            <ul>
                <Subject>Easy to use</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item).toBeTruthy();
    });

    test("applies the icon-list-item root class", () => {
        render(
            <ul>
                <Subject>Easy to use</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.className.includes("icon-list-item")).toBe(true);
    });

    test("renders the text content", () => {
        render(
            <ul>
                <Subject>Easy to use</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.textContent).toContain("Easy to use");
    });

    test("renders the icon when provided", () => {
        const { container } = render(
            <ul>
                <Subject icon={<svg data-testid="check" />}>Easy to use</Subject>
            </ul>
        );

        const iconSpan: HTMLElement | null = container.querySelector(
            ".icon-list-item-icon"
        );
        expect(iconSpan).toBeTruthy();
        expect(iconSpan!.getAttribute("aria-hidden")).toBe("true");
    });

    test("does not render an icon span when no icon is provided", () => {
        const { container } = render(
            <ul>
                <Subject>Easy to use</Subject>
            </ul>
        );

        const iconSpan: HTMLElement | null = container.querySelector(
            ".icon-list-item-icon"
        );
        expect(iconSpan).toBeNull();
    });

    test("wraps text in a text span", () => {
        const { container } = render(
            <ul>
                <Subject>Easy to use</Subject>
            </ul>
        );

        const textSpan: HTMLElement | null = container.querySelector(
            ".icon-list-item-text"
        );
        expect(textSpan).toBeTruthy();
        expect(textSpan!.textContent).toContain("Easy to use");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <ul>
                <Subject id="my-item">Easy to use</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.getAttribute("id")).toBe("my-item");
    });
});
