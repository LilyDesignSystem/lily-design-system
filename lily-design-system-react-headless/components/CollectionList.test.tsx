import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CollectionList";

describe("CollectionList", () => {
    test("renders as a ul list", () => {
        const { container } = render(
            <Subject>
                <li>One</li>
            </Subject>
        );

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul).toBeTruthy();
    });

    test("applies the collection-list root class", () => {
        const { container } = render(
            <Subject>
                <li>One</li>
            </Subject>
        );

        const ul: HTMLElement = container.querySelector("ul")!;
        expect(ul.className.includes("collection-list")).toBe(true);
    });

    test("sets the aria-label when label is provided", () => {
        render(
            <Subject label="Articles">
                <li>One</li>
            </Subject>
        );

        const list: HTMLElement = screen.getByRole("list", { name: "Articles" });
        expect(list.getAttribute("aria-label")).toBe("Articles");
    });

    test("renders children", () => {
        render(
            <Subject>
                <li>One</li>
                <li>Two</li>
            </Subject>
        );

        const items: HTMLElement[] = screen.getAllByRole("listitem");
        expect(items.length).toBe(2);
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject id="my-list">
                <li>One</li>
            </Subject>
        );

        const ul: HTMLElement = container.querySelector("ul")!;
        expect(ul.getAttribute("id")).toBe("my-list");
    });
});
