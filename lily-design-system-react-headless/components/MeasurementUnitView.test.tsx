import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementUnitView";

describe("MeasurementUnitView", () => {
    test("renders the measurement unit", () => {
        render(<Subject value="kg" />);
        expect(screen.getByText("kg")).toBeTruthy();
    });

    test("renders as a span element", () => {
        render(
            <Subject
                value="lb"
                data-testid="mu"
            />,
        );
        expect(screen.getByTestId("mu").tagName).toBe("SPAN");
    });

    test("supports aria-label", () => {
        render(
            <Subject
                value="cm"
                label="Centimeters"
            />,
        );
        expect(
            (document.querySelector(".measurement-unit-view") as HTMLElement).querySelector(
                ".screen-reader-span",
            )?.textContent,
        ).toBe(`${"Centimeters"} `);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                value="inch"
                data-testid="muv"
            />,
        );
        expect(screen.getByTestId("muv")).toBeTruthy();
    });
});
