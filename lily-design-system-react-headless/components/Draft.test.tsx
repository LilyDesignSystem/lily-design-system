import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Draft";

describe("Draft", () => {
    test("renders a div element with class draft", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".draft");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(<Subject label="Draft article">content</Subject>);
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("aria-label")).toBe("Draft article");
    });

    test("does not set data-status when status is omitted", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("data-status")).toBeNull();
    });

    test("applies data-status when status prop is provided", () => {
        const { container } = render(<Subject status="in-progress">content</Subject>);
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("data-status")).toBe("in-progress");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });
});
