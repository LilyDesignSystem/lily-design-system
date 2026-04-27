import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CollectionList.vue";


describe("CollectionList", () => {
    test("renders a ul element", () => {
        const { container } = render(Subject, { slots: { default: "<li>One</li>" } });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul).toBeTruthy();
    });

    test("has collection-list class on root", () => {
        const { container } = render(Subject, { slots: { default: "<li>One</li>" } });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.classList.contains("collection-list")).toBe(true);
    });

    test("renders children from slot", () => {
        render(Subject, { slots: { default: "<li>One</li><li>Two</li>" } });

        expect(screen.getByText("One")).toBeTruthy();
        expect(screen.getByText("Two")).toBeTruthy();
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, {
            props: { label: "Recent articles" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("aria-label")).toBe("Recent articles");
    });

    test("omits aria-label when not provided", () => {
        const { container } = render(Subject, { slots: { default: "<li>One</li>" } });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(Subject, {
            props: { id: "list-1" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("id")).toBe("list-1");
    });
});
