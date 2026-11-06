import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ClampText.vue";

describe("ClampText", () => {
    test("renders children content", () => {
        render(Subject, { slots: { default: "Long text content" } });

        expect(screen.getByText("Long text content")).toBeTruthy();
    });

    test("has clamp-text class on root", () => {
        render(Subject, { props: { "data-testid": "ct" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.classList.contains("clamp-text")).toBe(true);
    });

    test("defaults to 2 lines", () => {
        render(Subject, { props: { "data-testid": "ct" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.getAttribute("data-lines")).toBe("2");
    });

    test("accepts custom lines prop", () => {
        render(Subject, { props: { lines: 4, "data-testid": "ct" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.getAttribute("data-lines")).toBe("4");
    });

    test("sets --clamp-text-lines inline style", () => {
        render(Subject, { props: { lines: 3, "data-testid": "ct" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.style.getPropertyValue("--clamp-text-lines")).toBe("3");
    });

    test("applies aria-label when provided", () => {
        render(Subject, {
            props: { label: "Article summary", "data-testid": "ct" },
            slots: { default: "Body" },
        });

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.getAttribute("aria-label")).toBe("Article summary");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { id: "summary", "data-testid": "ct" },
            slots: { default: "Hello" },
        });

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.getAttribute("id")).toBe("summary");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Subject, {
            props: { label: "Story" },
            slots: { default: "content" },
        });
        const root = container.querySelector(".clamp-text");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        expect(container.querySelector(".clamp-text")?.hasAttribute("role")).toBe(false);
    });
});
