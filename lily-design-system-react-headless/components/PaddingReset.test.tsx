import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PaddingReset";

describe("PaddingReset", () => {
    test("renders a div with class padding-reset", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".padding-reset");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });
});
