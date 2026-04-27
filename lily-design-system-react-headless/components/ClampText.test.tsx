import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ClampText";

describe("ClampText", () => {
    test("renders children content", () => {
        render(<Subject>Hello world</Subject>);

        expect(screen.getByText("Hello world")).toBeTruthy();
    });

    test("applies the clamp-text root class", () => {
        render(<Subject data-testid="ct">Text</Subject>);

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.className.includes("clamp-text")).toBe(true);
    });

    test("defaults to 2 lines", () => {
        render(<Subject data-testid="ct">Text</Subject>);

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.getAttribute("data-lines")).toBe("2");
    });

    test("accepts custom lines value", () => {
        render(<Subject lines={5} data-testid="ct">Text</Subject>);

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.getAttribute("data-lines")).toBe("5");
    });

    test("applies aria-label when label provided", () => {
        render(<Subject label="Bio text" data-testid="ct">Text</Subject>);

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.getAttribute("aria-label")).toBe("Bio text");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject id="bio" data-testid="ct">Text</Subject>);

        const el: HTMLElement = screen.getByTestId("ct");
        expect(el.getAttribute("id")).toBe("bio");
    });
});
