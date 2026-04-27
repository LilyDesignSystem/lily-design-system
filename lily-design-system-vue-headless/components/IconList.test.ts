import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./IconList.vue";


describe("IconList", () => {
    test("renders a ul element", () => {
        const { container } = render(Subject, { slots: { default: "<li>One</li>" } });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul).toBeTruthy();
    });

    test("has icon-list class on root", () => {
        const { container } = render(Subject, { slots: { default: "<li>One</li>" } });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.classList.contains("icon-list")).toBe(true);
    });

    test("renders children from slot", () => {
        render(Subject, { slots: { default: "<li>One</li><li>Two</li>" } });

        expect(screen.getByText("One")).toBeTruthy();
        expect(screen.getByText("Two")).toBeTruthy();
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, {
            props: { label: "Highlights" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("aria-label")).toBe("Highlights");
    });

    test("omits aria-label when not provided", () => {
        const { container } = render(Subject, { slots: { default: "<li>One</li>" } });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(Subject, {
            props: { id: "icons" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("id")).toBe("icons");
    });
});
