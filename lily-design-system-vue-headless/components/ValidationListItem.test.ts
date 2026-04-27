import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ValidationListItem.vue";


describe("ValidationListItem", () => {
    test("renders as an li element", () => {
        const { container } = render(Subject, { slots: { default: "8+ chars" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li).toBeTruthy();
    });

    test("has validation-list-item class on root", () => {
        const { container } = render(Subject, { slots: { default: "8+ chars" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.classList.contains("validation-list-item")).toBe(true);
    });

    test("defaults data-status to pending", () => {
        const { container } = render(Subject, { slots: { default: "8+ chars" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.getAttribute("data-status")).toBe("pending");
    });

    test("applies passed status to data-status", () => {
        const { container } = render(Subject, {
            props: { status: "passed" },
            slots: { default: "8+ chars" },
        });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.getAttribute("data-status")).toBe("passed");
    });

    test("applies failed status to data-status", () => {
        const { container } = render(Subject, {
            props: { status: "failed" },
            slots: { default: "8+ chars" },
        });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.getAttribute("data-status")).toBe("failed");
    });

    test("renders default slot content", () => {
        render(Subject, { slots: { default: "At least 8 characters" } });

        expect(screen.getByText("At least 8 characters")).toBeTruthy();
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, {
            props: { label: "Length rule passed" },
            slots: { default: "8+ chars" },
        });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.getAttribute("aria-label")).toBe("Length rule passed");
    });

    test("omits aria-label when not provided", () => {
        const { container } = render(Subject, { slots: { default: "8+ chars" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.getAttribute("aria-label")).toBeNull();
    });
});
