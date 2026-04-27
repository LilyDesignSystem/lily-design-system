import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CollectionListItem";

describe("CollectionListItem", () => {
    test("renders as a list item", () => {
        render(
            <ul>
                <Subject heading="Article one" />
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item).toBeTruthy();
    });

    test("applies the collection-list-item root class", () => {
        render(
            <ul>
                <Subject heading="Article one" />
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.className.includes("collection-list-item")).toBe(true);
    });

    test("renders the heading text", () => {
        render(
            <ul>
                <Subject heading="Article one" />
            </ul>
        );

        const heading: HTMLElement = screen.getByRole("heading", { level: 3 });
        expect(heading.textContent).toContain("Article one");
    });

    test("wraps heading in an anchor when href is provided", () => {
        render(
            <ul>
                <Subject heading="Article one" href="/articles/1" />
            </ul>
        );

        const link: HTMLElement = screen.getByRole("link", { name: "Article one" });
        expect(link.getAttribute("href")).toBe("/articles/1");
    });

    test("does not render an anchor when href is omitted", () => {
        const { container } = render(
            <ul>
                <Subject heading="Article one" />
            </ul>
        );

        const anchor: HTMLElement | null = container.querySelector("a");
        expect(anchor).toBeNull();
    });

    test("renders an image when imageUrl is provided", () => {
        render(
            <ul>
                <Subject heading="Article one" imageUrl="/cover.jpg" imageAlt="Cover" />
            </ul>
        );

        const img: HTMLElement = screen.getByRole("img", { name: "Cover" });
        expect(img.getAttribute("src")).toBe("/cover.jpg");
    });

    test("does not render an image when imageUrl is omitted", () => {
        const { container } = render(
            <ul>
                <Subject heading="Article one" />
            </ul>
        );

        const img: HTMLElement | null = container.querySelector("img");
        expect(img).toBeNull();
    });

    test("renders meta and description when provided", () => {
        const { container } = render(
            <ul>
                <Subject
                    heading="Article one"
                    meta="2026-04-27"
                    description="Body text here"
                />
            </ul>
        );

        expect(container.textContent).toContain("2026-04-27");
        expect(container.textContent).toContain("Body text here");
    });

    test("sets aria-label override when provided", () => {
        render(
            <ul>
                <Subject heading="Article one" label="Custom label" />
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.getAttribute("aria-label")).toBe("Custom label");
    });

    test("renders additional children", () => {
        render(
            <ul>
                <Subject heading="Article one">
                    <span>Extra</span>
                </Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.textContent).toContain("Extra");
    });
});
