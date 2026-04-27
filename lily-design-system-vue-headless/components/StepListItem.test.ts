import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./StepListItem.vue";


describe("StepListItem", () => {
    test("renders as an li with step-list-item class", () => {
        const { container } = render(Subject, { slots: { default: "Cart" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.classList.contains("step-list-item")).toBe(true);
    });

    test("default status is waiting", () => {
        const { container } = render(Subject, { slots: { default: "Cart" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("waiting");
    });

    test("emits status as data-status attribute", () => {
        const { container } = render(Subject, {
            props: { status: "in-progress" },
            slots: { default: "Cart" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("in-progress");
    });

    test("supports finished status", () => {
        const { container } = render(Subject, {
            props: { status: "finished" },
            slots: { default: "Cart" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("finished");
    });

    test("supports error status", () => {
        const { container } = render(Subject, {
            props: { status: "error" },
            slots: { default: "Cart" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("error");
    });

    test("aria-current step when current=true", () => {
        const { container } = render(Subject, {
            props: { current: true },
            slots: { default: "Cart" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-current")).toBe("step");
    });

    test("no aria-current when current=false", () => {
        const { container } = render(Subject, { slots: { default: "Cart" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-current")).toBeNull();
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, {
            props: { label: "Step 2 of 3" },
            slots: { default: "Cart" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Step 2 of 3");
    });

    test("renders default slot content", () => {
        const { container } = render(Subject, { slots: { default: "Cart" } });

        expect(container.textContent).toContain("Cart");
    });
});
