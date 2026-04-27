import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ContainerWithFixedWidth";

describe("ContainerWithFixedWidth", () => {
    test("renders children content", () => {
        render(<Subject>Inner</Subject>);

        expect(screen.getByText("Inner")).toBeTruthy();
    });

    test("applies the container-with-fixed-width root class", () => {
        render(<Subject data-testid="cf">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.className.includes("container-with-fixed-width")).toBe(true);
    });

    test("defaults to 1200px max width", () => {
        render(<Subject data-testid="cf">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("data-max-width")).toBe("1200px");
    });

    test("accepts custom maxWidth", () => {
        render(<Subject maxWidth="64rem" data-testid="cf">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("data-max-width")).toBe("64rem");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject id="page" data-testid="cf">Inner</Subject>);

        const el: HTMLElement = screen.getByTestId("cf");
        expect(el.getAttribute("id")).toBe("page");
    });
});
