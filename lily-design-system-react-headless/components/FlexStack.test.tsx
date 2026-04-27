import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./FlexStack";

describe("FlexStack", () => {
    test("renders children content", () => {
        render(<Subject>Inner</Subject>);

        expect(screen.getByText("Inner")).toBeTruthy();
    });

    test("applies the flex-stack root class", () => {
        render(<Subject data-testid="fs">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.className.includes("flex-stack")).toBe(true);
    });

    test("defaults to column direction", () => {
        render(<Subject data-testid="fs">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.getAttribute("data-direction")).toBe("column");
        expect(el.style.flexDirection).toBe("column");
    });

    test("accepts row direction", () => {
        render(<Subject direction="row" data-testid="fs">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.getAttribute("data-direction")).toBe("row");
        expect(el.style.flexDirection).toBe("row");
    });

    test("applies custom gap, align, and justify", () => {
        render(
            <Subject
                gap="0.5rem"
                align="center"
                justify="space-between"
                data-testid="fs"
            >
                Inner
            </Subject>,
        );

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.style.gap).toBe("0.5rem");
        expect(el.style.alignItems).toBe("center");
        expect(el.style.justifyContent).toBe("space-between");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject id="row1" data-testid="fs">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("fs");
        expect(el.getAttribute("id")).toBe("row1");
    });
});
