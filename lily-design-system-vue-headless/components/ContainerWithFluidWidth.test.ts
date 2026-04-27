import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ContainerWithFluidWidth.vue";


describe("ContainerWithFluidWidth", () => {
    test("renders children content", () => {
        render(Subject, { slots: { default: "Hello" } });

        expect(screen.getByText("Hello")).toBeTruthy();
    });

    test("has container-with-fluid-width class on root", () => {
        render(Subject, { props: { "data-testid": "cf" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.classList.contains("container-with-fluid-width")).toBe(true);
    });

    test("defaults to 1rem padding-inline", () => {
        render(Subject, { props: { "data-testid": "cf" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("data-padding-inline")).toBe("1rem");
    });

    test("accepts custom paddingInline", () => {
        render(Subject, { props: { paddingInline: "2rem",
            "data-testid": "cf" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("data-padding-inline")).toBe("2rem");
        expect(el.style.paddingInline).toBe("2rem");
    });

    test("sets width 100% inline", () => {
        render(Subject, { props: { "data-testid": "cf" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.style.width).toBe("100%");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { id: "fluid",
            "data-testid": "cf" }, slots: { default: "Hello" } });

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("id")).toBe("fluid");
    });
});
