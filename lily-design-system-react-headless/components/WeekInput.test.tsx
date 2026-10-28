import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./WeekInput";

describe("WeekInput", () => {
    test("renders a week input", () => {
        render(<Subject label="Select week" />);
        const input = screen.getByLabelText("Select week") as HTMLInputElement;
        expect(input.type).toBe("week");
    });

    test("has aria-label", () => {
        render(<Subject label="Project week" />);
        expect(screen.getByLabelText("Project week")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="Week"
                required
            />,
        );
        expect((screen.getByLabelText("Week") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Week"
                disabled
            />,
        );
        expect((screen.getByLabelText("Week") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Week"
                data-testid="wi"
            />,
        );
        expect(screen.getByTestId("wi")).toBeTruthy();
    });
});
