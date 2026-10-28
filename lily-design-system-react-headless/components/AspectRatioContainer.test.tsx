import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AspectRatioContainer";

describe("AspectRatioContainer", () => {
    test("renders children content", () => {
        render(<Subject>Hello</Subject>);

        expect(screen.getByText("Hello")).toBeTruthy();
    });

    test("defaults to ratio 1", () => {
        render(<Subject data-testid="ar">Square</Subject>);

        const container: HTMLElement = screen.getByTestId("ar");
        expect(container.getAttribute("data-aspect-ratio-container")).toBe("1");
    });

    test("applies custom ratio", () => {
        const ratio = 16 / 9;
        render(
            <Subject
                ratio={ratio}
                data-testid="ar"
            >
                Widescreen
            </Subject>,
        );

        const container: HTMLElement = screen.getByTestId("ar");
        expect(container.getAttribute("data-aspect-ratio-container")).toBe(String(ratio));
    });

    test("sets aspect-ratio via data attribute", () => {
        const ratio = 4 / 3;
        render(
            <Subject
                ratio={ratio}
                data-testid="ar"
            >
                Content
            </Subject>,
        );

        const container: HTMLElement = screen.getByTestId("ar");
        expect(container.getAttribute("data-aspect-ratio-container")).toBe(String(ratio));
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                id="my-aspect"
                data-testid="ar"
            >
                Content
            </Subject>,
        );

        const container: HTMLElement = screen.getByTestId("ar");
        expect(container.getAttribute("id")).toBe("my-aspect");
    });
});
