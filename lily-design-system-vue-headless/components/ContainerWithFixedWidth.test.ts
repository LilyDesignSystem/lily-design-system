import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ContainerWithFixedWidth.vue";


describe("ContainerWithFixedWidth", () => {
    test("renders children content", () => {
        render(Subject, { slots: { default: "Hello" } });

        expect(screen.getByText("Hello")).toBeTruthy();
    });

    test("has container-with-fixed-width class on root", () => {
        render(Subject, { props: { "data-testid": "cw" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cw");
        expect(el.classList.contains("container-with-fixed-width")).toBe(true);
    });

    test("defaults to 1200px max-width", () => {
        render(Subject, { props: { "data-testid": "cw" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cw");
        expect(el.getAttribute("data-max-width")).toBe("1200px");
    });

    test("accepts custom maxWidth", () => {
        render(Subject, { props: { maxWidth: "960px",
            "data-testid": "cw" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cw");
        expect(el.getAttribute("data-max-width")).toBe("960px");
        expect(el.style.maxWidth).toBe("960px");
    });

    test("centers via inline margin-inline auto", () => {
        render(Subject, { props: { "data-testid": "cw" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cw");
        expect(el.style.marginInline).toBe("auto");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { id: "main",
            "data-testid": "cw" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cw");
        expect(el.getAttribute("id")).toBe("main");
    });
});
