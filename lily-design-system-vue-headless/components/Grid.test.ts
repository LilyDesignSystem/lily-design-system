import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Grid.vue";


describe("Grid", () => {
    test("renders children content", () => {
        render(Subject, { slots: { default: "Hello" } });

        expect(screen.getByText("Hello")).toBeTruthy();
    });

    test("has grid class on root", () => {
        render(Subject, { props: { "data-testid": "g" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.classList.contains("grid")).toBe(true);
    });

    test("defaults to 12 equal columns", () => {
        render(Subject, { props: { "data-testid": "g" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.getAttribute("data-columns")).toBe("12");
        expect(el.style.gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
    });

    test("accepts numeric columns prop", () => {
        render(Subject, { props: { columns: 3,
            "data-testid": "g" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.getAttribute("data-columns")).toBe("3");
        expect(el.style.gridTemplateColumns).toBe("repeat(3, minmax(0, 1fr))");
    });

    test("accepts string columns template", () => {
        render(Subject, {
            props: { columns: "200px 1fr",
                "data-testid": "g" },
            slots: { default: "Hello" },
        });

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.style.gridTemplateColumns).toBe("200px 1fr");
    });

    test("applies default gap 1rem", () => {
        render(Subject, { props: { "data-testid": "g" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.style.gap).toBe("1rem");
    });

    test("accepts custom gap", () => {
        render(Subject, { props: { gap: "2rem",
            "data-testid": "g" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.style.gap).toBe("2rem");
    });

    test("uses display grid", () => {
        render(Subject, { props: { "data-testid": "g" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.style.display).toBe("grid");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { id: "main-grid",
            "data-testid": "g" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.getAttribute("id")).toBe("main-grid");
    });
});
