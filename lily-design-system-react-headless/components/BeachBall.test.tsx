import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BeachBall";

describe("BeachBall", () => {
    test("renders with status role", () => {
        render(<Subject label="Loading" />);

        const indicator: HTMLElement = screen.getByRole("status");
        expect(indicator).toBeTruthy();
    });

    test("has accessible label", () => {
        render(<Subject label="Loading content" />);

        const indicator: HTMLElement = screen.getByRole("status", { name: "Loading content" });
        expect(indicator).toBeTruthy();
    });

    test("is aria-busy when active", () => {
        render(
            <Subject
                label="Loading"
                active
            />,
        );

        const indicator: HTMLElement = screen.getByRole("status");
        expect(indicator.getAttribute("aria-busy")).toBe("true");
    });

    test("is not aria-busy when inactive", () => {
        render(
            <Subject
                label="Loading"
                active={false}
            />,
        );

        const indicator: HTMLElement = screen.getByRole("status");
        expect(indicator.getAttribute("aria-busy")).toBe("false");
    });

    test("has aria-live polite", () => {
        render(<Subject label="Loading" />);

        const indicator: HTMLElement = screen.getByRole("status");
        expect(indicator.getAttribute("aria-live")).toBe("polite");
    });

    test("exposes data-active attribute", () => {
        render(
            <Subject
                label="Loading"
                active
            />,
        );

        const indicator: HTMLElement = screen.getByRole("status");
        expect(indicator.getAttribute("data-active")).toBe("true");
    });

    test("renders spinner span when active", () => {
        render(
            <Subject
                label="Loading"
                active
            />,
        );

        const indicator: HTMLElement = screen.getByRole("status");
        const spinner: HTMLElement | null = indicator.querySelector("span[aria-hidden]");
        expect(spinner).toBeTruthy();
    });

    test("hides spinner span when inactive", () => {
        render(
            <Subject
                label="Loading"
                active={false}
            />,
        );

        const indicator: HTMLElement = screen.getByRole("status");
        const spinner: HTMLElement | null = indicator.querySelector("span[aria-hidden]");
        expect(spinner).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Loading"
                data-testid="beach-ball"
            />,
        );

        const indicator: HTMLElement = screen.getByTestId("beach-ball");
        expect(indicator).toBeTruthy();
    });
});
