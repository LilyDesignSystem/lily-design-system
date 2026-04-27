import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Statistic.vue";


describe("Statistic", () => {
    test("renders root with statistic class and group role", () => {
        const { container } = render(Subject, { props: { title: "Active users", value: "12,345" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("statistic")).toBe(true);
        expect(root.getAttribute("role")).toBe("group");
    });

    test("default aria-label combines title and value", () => {
        const { container } = render(Subject, { props: { title: "Active users", value: "12,345" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Active users: 12,345");
    });

    test("custom aria-label overrides default", () => {
        const { container } = render(Subject, {
            props: { title: "Active users", value: "12,345", label: "12,345 active users right now" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("12,345 active users right now");
    });

    test("renders title in statistic-title", () => {
        const { container } = render(Subject, { props: { title: "Revenue", value: "1,234" } });

        const titleEl: HTMLElement = container.querySelector(".statistic-title") as HTMLElement;
        expect(titleEl).toBeTruthy();
        expect(titleEl.textContent).toContain("Revenue");
    });

    test("renders value in statistic-value", () => {
        const { container } = render(Subject, { props: { title: "Revenue", value: "1,234" } });

        const valueEl: HTMLElement = container.querySelector(".statistic-value") as HTMLElement;
        expect(valueEl).toBeTruthy();
        expect(valueEl.textContent).toContain("1,234");
    });

    test("renders prefix slot when provided", () => {
        const { container } = render(Subject, {
            props: { title: "Revenue", value: "1,234" },
            slots: { prefix: "$" },
        });

        const prefix: HTMLElement = container.querySelector(".statistic-prefix") as HTMLElement;
        expect(prefix).toBeTruthy();
        expect(prefix.textContent).toContain("$");
    });

    test("does not render prefix when slot empty", () => {
        const { container } = render(Subject, { props: { title: "Revenue", value: "1,234" } });

        const prefix: HTMLElement | null = container.querySelector(".statistic-prefix");
        expect(prefix).toBeNull();
    });

    test("renders suffix slot when provided", () => {
        const { container } = render(Subject, {
            props: { title: "Conversion", value: "42" },
            slots: { suffix: "%" },
        });

        const suffix: HTMLElement = container.querySelector(".statistic-suffix") as HTMLElement;
        expect(suffix).toBeTruthy();
        expect(suffix.textContent).toContain("%");
    });

    test("does not render suffix when slot empty", () => {
        const { container } = render(Subject, { props: { title: "Conversion", value: "42" } });

        const suffix: HTMLElement | null = container.querySelector(".statistic-suffix");
        expect(suffix).toBeNull();
    });
});
