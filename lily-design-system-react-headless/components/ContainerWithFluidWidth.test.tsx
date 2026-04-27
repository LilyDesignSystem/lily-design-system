import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ContainerWithFluidWidth";

describe("ContainerWithFluidWidth", () => {
    test("renders children content", () => {
        render(<Subject>Inner</Subject>);

        expect(screen.getByText("Inner")).toBeTruthy();
    });

    test("applies the container-with-fluid-width root class", () => {
        render(<Subject data-testid="cf">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.className.includes("container-with-fluid-width")).toBe(true);
    });

    test("defaults to 1rem padding-inline", () => {
        render(<Subject data-testid="cf">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("data-padding-inline")).toBe("1rem");
    });

    test("accepts custom paddingInline", () => {
        render(<Subject paddingInline="2rem" data-testid="cf">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("data-padding-inline")).toBe("2rem");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject id="page" data-testid="cf">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("id")).toBe("page");
    });
});
