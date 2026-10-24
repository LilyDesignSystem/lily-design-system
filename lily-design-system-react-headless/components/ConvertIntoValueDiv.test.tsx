import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ConvertIntoValueDiv";

describe("ConvertIntoValueDiv", () => {
    test("renders a div with the base class", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.querySelector("div.convert-into-value-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        const { container } = render(<Subject className="mine">content</Subject>);
        expect(container.querySelector(".convert-into-value-div")?.getAttribute("class")).toBe("convert-into-value-div mine");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });

    test("has no role and no aria-label", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".convert-into-value-div");
        expect(root?.getAttribute("role")).toBeNull();
        expect(root?.getAttribute("aria-label")).toBeNull();
    });
});
