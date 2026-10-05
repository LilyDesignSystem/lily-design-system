import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import Subject from "./EmptyState";

describe("EmptyState", () => {
    test("renders a <div> with the empty-state class", () => {
        const { container } = render(<Subject>Nothing here</Subject>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.getAttribute("class")).toContain("empty-state");
    });

    test("renders consumer children", () => {
        render(<Subject>No messages yet</Subject>);
        expect(screen.getByText("No messages yet")).toBeTruthy();
    });

    test("without label there is no role and no aria-label", () => {
        const { container } = render(<Subject>x</Subject>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.getAttribute("aria-label")).toBeNull();
    });

    test("with label it is a labelled group", () => {
        render(<Subject label="Inbox empty">x</Subject>);
        expect(screen.getByRole("group", { name: "Inbox empty" })).toBeTruthy();
    });

    test("is not a live region", () => {
        const { container } = render(<Subject label="L">x</Subject>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-live")).toBeNull();
        expect(root.getAttribute("role")).not.toBe("status");
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="es">x</Subject>);
        expect(screen.getByTestId("es")).toBeTruthy();
    });
});
