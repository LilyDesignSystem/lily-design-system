import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NumberInput";

describe("NumberInput", () => {
    test("renders a number input", () => {
        render(<Subject label="Qty" />);
        expect((screen.getByLabelText("Qty") as HTMLInputElement).type).toBe("number");
    });

    test("supports min/max", () => {
        render(
            <Subject
                label="Qty"
                min={0}
                max={99}
            />,
        );
        const input = screen.getByLabelText("Qty") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("99");
    });

    test("supports step", () => {
        render(
            <Subject
                label="Qty"
                step={5}
            />,
        );
        expect((screen.getByLabelText("Qty") as HTMLInputElement).step).toBe("5");
    });

    test("supports required", () => {
        render(
            <Subject
                label="Qty"
                required
            />,
        );
        expect((screen.getByLabelText("Qty") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="N"
                data-testid="ni"
            />,
        );
        expect(screen.getByTestId("ni")).toBeTruthy();
    });
});
