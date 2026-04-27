import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Grid";

describe("Grid", () => {
    test("renders children content", () => {
        render(<Subject>Inner</Subject>);

        expect(screen.getByText("Inner")).toBeTruthy();
    });

    test("applies the grid root class", () => {
        render(<Subject data-testid="g">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.className.includes("grid")).toBe(true);
    });

    test("defaults to 12 columns using repeat()", () => {
        render(<Subject data-testid="g">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.getAttribute("data-columns")).toBe("12");
        expect(el.style.gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
    });

    test("accepts numeric columns", () => {
        render(<Subject columns={3} data-testid="g">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.getAttribute("data-columns")).toBe("3");
        expect(el.style.gridTemplateColumns).toBe("repeat(3, minmax(0, 1fr))");
    });

    test("accepts a custom grid-template-columns string", () => {
        render(
            <Subject columns="200px 1fr 200px" data-testid="g">
                Inner
            </Subject>,
        );

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.getAttribute("data-columns")).toBe("200px 1fr 200px");
        expect(el.style.gridTemplateColumns).toBe("200px 1fr 200px");
    });

    test("applies custom gap", () => {
        render(<Subject gap="2rem" data-testid="g">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.style.gap).toBe("2rem");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject id="layout" data-testid="g">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("g");
        expect(el.getAttribute("id")).toBe("layout");
    });
});
