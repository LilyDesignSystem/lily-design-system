import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./StepList.vue";


describe("StepList", () => {
    test("renders as an ordered list with step-list class", () => {
        const { container } = render(Subject, { slots: { default: "<li>Step</li>" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("OL");
        expect(root.classList.contains("step-list")).toBe(true);
    });

    test("renders default slot children", () => {
        const { container } = render(Subject, {
            slots: { default: "<li>One</li><li>Two</li>" },
        });

        expect(container.textContent).toContain("One");
        expect(container.textContent).toContain("Two");
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, {
            props: { label: "Checkout" },
            slots: { default: "<li>x</li>" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Checkout");
    });

    test("omits aria-label when not provided", () => {
        const { container } = render(Subject, { slots: { default: "<li>x</li>" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-label")).toBeNull();
    });

    test("emits current as data-current attribute", () => {
        const { container } = render(Subject, {
            props: { current: 1 },
            slots: { default: "<li>x</li>" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-current")).toBe("1");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(Subject, {
            props: { id: "checkout-steps" },
            slots: { default: "<li>x</li>" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("id")).toBe("checkout-steps");
    });
});
