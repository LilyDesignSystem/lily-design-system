import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BodyText";

describe("BodyText", () => {
    test("renders a div with class body-text", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".body-text");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });
});
