import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./IconList";

describe("IconList", () => {
    test("renders as a ul list", () => {
        const { container } = render(
            <Subject>
                <li>One</li>
            </Subject>
        );

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul).toBeTruthy();
    });

    test("applies the icon-list root class", () => {
        const { container } = render(
            <Subject>
                <li>One</li>
            </Subject>
        );

        const ul: HTMLElement = container.querySelector("ul")!;
        expect(ul.className.includes("icon-list")).toBe(true);
    });

    test("sets the aria-label when provided", () => {
        render(
            <Subject label="Benefits">
                <li>One</li>
            </Subject>
        );

        const list: HTMLElement = screen.getByRole("list", { name: "Benefits" });
        expect(list.getAttribute("aria-label")).toBe("Benefits");
    });

    test("renders children", () => {
        render(
            <Subject>
                <li>One</li>
                <li>Two</li>
                <li>Three</li>
            </Subject>
        );

        const items: HTMLElement[] = screen.getAllByRole("listitem");
        expect(items.length).toBe(3);
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject id="my-icon-list">
                <li>One</li>
            </Subject>
        );

        const ul: HTMLElement = container.querySelector("ul")!;
        expect(ul.getAttribute("id")).toBe("my-icon-list");
    });
});
