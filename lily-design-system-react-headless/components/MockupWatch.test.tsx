import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MockupWatch";

describe("MockupWatch", () => {
    test("renders a div with class mockup-watch", () => {
        const { container } = render(<Subject>screen</Subject>);
        const root = container.querySelector(".mockup-watch");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>my screenshot</Subject>);
        expect(container.textContent).toBe("my screenshot");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject data-testid="frame">x</Subject>);
        expect(container.querySelector("[data-testid='frame']")).toBeTruthy();
    });
});
