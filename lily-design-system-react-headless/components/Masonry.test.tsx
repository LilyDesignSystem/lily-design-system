import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Masonry";

describe("Masonry", () => {
    test("renders children content", () => {
        render(<Subject>Inner</Subject>);

        expect(screen.getByText("Inner")).toBeTruthy();
    });

    test("applies the masonry root class", () => {
        render(<Subject data-testid="m">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.className.includes("masonry")).toBe(true);
    });

    test("defaults to 3 columns", () => {
        render(<Subject data-testid="m">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.getAttribute("data-columns")).toBe("3");
        expect(el.style.columnCount).toBe("3");
    });

    test("accepts custom columns and gap", () => {
        render(
            <Subject columns={5} gap="2rem" data-testid="m">
                Inner
            </Subject>,
        );

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.getAttribute("data-columns")).toBe("5");
        expect(el.style.columnCount).toBe("5");
        expect(el.style.columnGap).toBe("2rem");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject id="gallery" data-testid="m">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("m");
        expect(el.getAttribute("id")).toBe("gallery");
    });
});
