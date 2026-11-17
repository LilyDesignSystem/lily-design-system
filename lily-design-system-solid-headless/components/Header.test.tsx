import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./Header";

describe("Header", () => {
    test("renders as banner landmark", () => {
        render(() => <Subject>Title</Subject>);
        expect(screen.getByRole("banner")).toBeTruthy();
    });

    test("supports aria-label", () => {
        render(() => <Subject label="Site header">T</Subject>);
        expect(screen.getByRole("banner").getAttribute("aria-label")).toBe("Site header");
    });

    test("renders children", () => {
        render(() => <Subject>My Title</Subject>);
        expect(screen.getByRole("banner").textContent).toContain("My Title");
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="hdr">T</Subject>);
        expect(screen.getByTestId("hdr")).toBeTruthy();
    });
});
