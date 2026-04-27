import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./FlexStack.vue";


describe("FlexStack", () => {
    test("renders children content", () => {
        render(Subject, { slots: { default: "Hello" } });

        expect(screen.getByText("Hello")).toBeTruthy();
    });

    test("has flex-stack class on root", () => {
        render(Subject, { props: { "data-testid": "fs" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.classList.contains("flex-stack")).toBe(true);
    });

    test("defaults to column direction", () => {
        render(Subject, { props: { "data-testid": "fs" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.getAttribute("data-direction")).toBe("column");
        expect(el.style.flexDirection).toBe("column");
    });

    test("accepts row direction", () => {
        render(Subject, { props: { direction: "row",
            "data-testid": "fs" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.getAttribute("data-direction")).toBe("row");
        expect(el.style.flexDirection).toBe("row");
    });

    test("applies default 1rem gap", () => {
        render(Subject, { props: { "data-testid": "fs" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.style.gap).toBe("1rem");
    });

    test("accepts custom gap", () => {
        render(Subject, { props: { gap: "0.5rem",
            "data-testid": "fs" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.style.gap).toBe("0.5rem");
    });

    test("applies align and justify", () => {
        render(Subject, { props: { align: "center", justify: "space-between",
            "data-testid": "fs" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.style.alignItems).toBe("center");
        expect(el.style.justifyContent).toBe("space-between");
    });

    test("uses display flex", () => {
        render(Subject, { props: { "data-testid": "fs" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.style.display).toBe("flex");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { id: "stack",
            "data-testid": "fs" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.getAttribute("id")).toBe("stack");
    });
});
