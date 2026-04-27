import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Masonry.vue";


describe("Masonry", () => {
    test("renders children content", () => {
        render(Subject, { slots: { default: "Hello" } });

        expect(screen.getByText("Hello")).toBeTruthy();
    });

    test("has masonry class on root", () => {
        render(Subject, { props: { "data-testid": "m" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.classList.contains("masonry")).toBe(true);
    });

    test("defaults to 3 columns", () => {
        render(Subject, { props: { "data-testid": "m" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.getAttribute("data-columns")).toBe("3");
        expect(el.style.columnCount).toBe("3");
    });

    test("accepts custom columns", () => {
        render(Subject, { props: { columns: 4,
            "data-testid": "m" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.getAttribute("data-columns")).toBe("4");
        expect(el.style.columnCount).toBe("4");
    });

    test("applies default 1rem column-gap", () => {
        render(Subject, { props: { "data-testid": "m" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.style.columnGap).toBe("1rem");
    });

    test("accepts custom gap", () => {
        render(Subject, { props: { gap: "0.5rem",
            "data-testid": "m" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.style.columnGap).toBe("0.5rem");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { id: "gallery",
            "data-testid": "m" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.getAttribute("id")).toBe("gallery");
    });
});
