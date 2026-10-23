import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Slider";

describe("Slider", () => {
    test("renders a range input (slider role)", () => {
        render(<Subject label="Volume" />);
        expect(screen.getByRole("slider")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Brightness" />);
        expect(screen.getByLabelText("Brightness")).toBeTruthy();
    });

    test("sets min and max", () => {
        render(<Subject label="S" min={10} max={200} />);
        const input = screen.getByRole("slider") as HTMLInputElement;
        expect(input.min).toBe("10");
        expect(input.max).toBe("200");
    });

    test("sets step", () => {
        render(<Subject label="S" step={5} />);
        expect((screen.getByRole("slider") as HTMLInputElement).step).toBe("5");
    });

    test("supports disabled", () => {
        render(<Subject label="S" disabled />);
        expect((screen.getByRole("slider") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(<Subject label="S" data-testid="sl" />);
        expect(screen.getByTestId("sl")).toBeTruthy();
    });

    test("passes aria-valuetext through to the range input", () => {
        render(<Subject label="S" aria-valuetext="20 percent" />);
        expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe("20 percent");
    });
});
