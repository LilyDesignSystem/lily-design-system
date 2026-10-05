import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./EmptyState.vue";

describe("EmptyState", () => {
    test("renders a <div> with the empty-state class", () => {
        const { container } = render(Subject, { slots: { default: "Nothing here" } });
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.getAttribute("class")).toContain("empty-state");
    });

    test("renders consumer children", () => {
        render(Subject, { slots: { default: "No messages yet" } });
        expect(screen.getByText("No messages yet")).toBeTruthy();
    });

    test("without label there is no role and no aria-label", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.getAttribute("aria-label")).toBeNull();
    });

    test("with label it is a labelled group", () => {
        render(Subject, { props: { label: "Inbox empty" }, slots: { default: "x" } });
        expect(screen.getByRole("group", { name: "Inbox empty" })).toBeTruthy();
    });

    test("is not a live region", () => {
        const { container } = render(Subject, { props: { label: "L" }, slots: { default: "x" } });
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-live")).toBeNull();
        expect(root.getAttribute("role")).not.toBe("status");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "es" }, slots: { default: "x" } });
        expect(screen.getByTestId("es")).toBeTruthy();
    });
});
