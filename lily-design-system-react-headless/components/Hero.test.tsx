import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Hero";

describe("Hero", () => {
    test("renders a section element with class hero", () => {
        const { container } = render(<Subject label="Test">content</Subject>);
        const root = container.querySelector(".hero");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("SECTION");
    });

    test("renders children content", () => {
        const { container } = render(<Subject label="Test">content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(<Subject label="Hello">content</Subject>);
        const root = container.querySelector(".hero");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject label="x" data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });
});
