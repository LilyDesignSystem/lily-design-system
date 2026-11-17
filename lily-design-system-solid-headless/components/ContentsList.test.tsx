import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./ContentsList";

describe("ContentsList", () => {
    test("renders as an ordered list", () => {
        render(() => <Subject>Items</Subject>);
        expect(screen.getByRole("list")).toBeTruthy();
        expect(screen.getByRole("list").tagName).toBe("OL");
    });

    test("renders children", () => {
        render(() => <Subject>Section 1</Subject>);
        expect(screen.getByRole("list").textContent).toContain("Section 1");
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="cl">Items</Subject>);
        expect(screen.getByTestId("cl")).toBeTruthy();
    });

    test("passes through aria-label", () => {
        render(() => <Subject aria-label="Sections">Items</Subject>);
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Sections");
    });
});
