import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Badge.vue";

describe("Badge", () => {
    test("renders with status role", () => {
        render(Subject, { slots: { default: "New" } });

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge).toBeTruthy();
        expect(badge.textContent).toContain("New");
    });

    test("defaults to type default", () => {
        render(Subject, { slots: { default: "Badge" } });

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("data-type")).toBe("default");
    });

    test("applies custom type", () => {
        render(Subject, { props: { type: "error" }, slots: { default: "Error" } });

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("data-type")).toBe("error");
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, { props: { label: "3 unread messages" }, slots: { default: "3" } });

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("aria-label")).toBe("3 unread messages");
    });

    test("does not set aria-label when label prop is not provided", () => {
        render(Subject, { slots: { default: "Info" } });

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { "data-testid": "my-badge", id: "badge-1" },
            slots: { default: "Tag" },
        });

        const badge: HTMLElement = screen.getByTestId("my-badge");
        expect(badge.getAttribute("id")).toBe("badge-1");
    });
});
