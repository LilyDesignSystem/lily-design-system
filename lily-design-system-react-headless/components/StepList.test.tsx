import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./StepList";

describe("StepList", () => {
    test("renders an <ol> with the step-list root class", () => {
        const { container } = render(
            <Subject>
                <li>a</li>
            </Subject>
        );

        const ol: HTMLElement = container.querySelector(".step-list") as HTMLElement;
        expect(ol).toBeTruthy();
        expect(ol.tagName).toBe("OL");
    });

    test("uses the list role with provided aria-label", () => {
        render(
            <Subject label="Sign up steps">
                <li>a</li>
            </Subject>
        );

        const list: HTMLElement = screen.getByRole("list", { name: "Sign up steps" });
        expect(list).toBeTruthy();
    });

    test("does not set aria-label when none provided", () => {
        const { container } = render(
            <Subject>
                <li>a</li>
            </Subject>
        );

        const ol: HTMLElement = container.querySelector(".step-list") as HTMLElement;
        expect(ol.getAttribute("aria-label")).toBeNull();
    });

    test("exposes current as data-current", () => {
        const { container } = render(
            <Subject current={2}>
                <li>a</li>
            </Subject>
        );

        const ol: HTMLElement = container.querySelector(".step-list") as HTMLElement;
        expect(ol.getAttribute("data-current")).toBe("2");
    });

    test("does not set data-current when not provided", () => {
        const { container } = render(
            <Subject>
                <li>a</li>
            </Subject>
        );

        const ol: HTMLElement = container.querySelector(".step-list") as HTMLElement;
        expect(ol.getAttribute("data-current")).toBeNull();
    });

    test("renders children", () => {
        render(
            <Subject>
                <li>step one</li>
                <li>step two</li>
            </Subject>
        );

        expect(screen.getByText("step one")).toBeTruthy();
        expect(screen.getByText("step two")).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject id="steps">
                <li>a</li>
            </Subject>
        );

        const ol: HTMLElement = container.querySelector(".step-list") as HTMLElement;
        expect(ol.getAttribute("id")).toBe("steps");
    });
});
