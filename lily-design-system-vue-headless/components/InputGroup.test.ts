import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./InputGroup.vue";


describe("InputGroup", () => {
    test("renders default slot content", () => {
        render(Subject, { slots: { default: "<input data-testid=\"in\" />" } });

        expect(screen.getByTestId("in")).toBeTruthy();
    });

    test("has input-group class on root", () => {
        render(Subject, {
            props: { "data-testid": "ig" },
            slots: { default: "<input />" },
        });

        const el: HTMLElement = screen.getByTestId("ig");
        expect(el.classList.contains("input-group")).toBe(true);
    });

    test("renders with role group", () => {
        render(Subject, {
            props: { label: "Amount" },
            slots: { default: "<input />" },
        });

        const el: HTMLElement = screen.getByRole("group", { name: "Amount" });
        expect(el).toBeTruthy();
    });

    test("applies aria-label when provided", () => {
        render(Subject, {
            props: { label: "Price", "data-testid": "ig" },
            slots: { default: "<input />" },
        });

        const el: HTMLElement = screen.getByTestId("ig");
        expect(el.getAttribute("aria-label")).toBe("Price");
    });

    test("renders prefix slot when provided", () => {
        const { container } = render(Subject, {
            slots: { prefix: "$", default: "<input />" },
        });

        const prefix = container.querySelector(".input-group-prefix");
        expect(prefix).toBeTruthy();
        expect(prefix?.textContent).toContain("$");
    });

    test("does not render prefix span when no prefix slot", () => {
        const { container } = render(Subject, {
            slots: { default: "<input />" },
        });

        expect(container.querySelector(".input-group-prefix")).toBeNull();
    });

    test("renders suffix slot when provided", () => {
        const { container } = render(Subject, {
            slots: { suffix: "USD", default: "<input />" },
        });

        const suffix = container.querySelector(".input-group-suffix");
        expect(suffix).toBeTruthy();
        expect(suffix?.textContent).toContain("USD");
    });

    test("does not render suffix span when no suffix slot", () => {
        const { container } = render(Subject, {
            slots: { default: "<input />" },
        });

        expect(container.querySelector(".input-group-suffix")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { id: "ig-1", "data-testid": "ig" },
            slots: { default: "<input />" },
        });

        const el: HTMLElement = screen.getByTestId("ig");
        expect(el.getAttribute("id")).toBe("ig-1");
    });
});
