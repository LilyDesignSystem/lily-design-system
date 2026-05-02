import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Framer";

describe("Framer", () => {
    test("renders a div with class framer", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".framer");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });
});
