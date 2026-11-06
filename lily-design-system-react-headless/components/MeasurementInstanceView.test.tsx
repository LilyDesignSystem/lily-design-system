import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementInstanceView";

describe("MeasurementInstanceView", () => {
    test("renders the measurement value", () => {
        render(<Subject value="72 kg" />);
        expect(screen.getByText("72 kg")).toBeTruthy();
    });

    test("renders as a span element", () => {
        render(
            <Subject
                value="98.6 F"
                data-testid="mv"
            />,
        );
        expect(screen.getByTestId("mv").tagName).toBe("SPAN");
    });

    test("supports aria-label", () => {
        render(
            <Subject
                value="120/80"
                label="Blood pressure"
            />,
        );
        expect(
            (document.querySelector(".measurement-instance-view") as HTMLElement).querySelector(
                ".screen-reader-span",
            )?.textContent,
        ).toBe(`${"Blood pressure"} `);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                value="42"
                data-testid="miv"
            />,
        );
        expect(screen.getByTestId("miv")).toBeTruthy();
    });
});
