import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Progress";

describe("Progress", () => {
    test("renders a progress element", () => {
        render(<Subject label="Loading" />);
        expect(screen.getByRole("progressbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Upload progress" />);
        expect(screen.getByLabelText("Upload progress")).toBeTruthy();
    });

    test("sets value and max", () => {
        render(
            <Subject
                label="Progress"
                value={50}
                max={100}
                data-testid="pb"
            />,
        );
        const el = screen.getByTestId("pb") as HTMLProgressElement;
        expect(el.value).toBe(50);
        expect(el.max).toBe(100);
    });

    test("supports indeterminate state", () => {
        render(
            <Subject
                label="Loading"
                data-testid="pb"
            />,
        );
        const el = screen.getByTestId("pb") as HTMLProgressElement;
        expect(el.position).toBe(-1);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="P"
                data-testid="pb"
            />,
        );
        expect(screen.getByTestId("pb")).toBeTruthy();
    });
});
