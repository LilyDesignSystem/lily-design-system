import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./FiveFaceRatingView";

describe("FiveFaceRatingView", () => {
    test("renders with img role", () => {
        render(<Subject value={3} label="Okay" />);
        expect(screen.getByRole("img", { name: "Okay" })).toBeTruthy();
    });

    test("without labels the face text is the number, not an English word", () => {
        render(<Subject value={4} label="R" />);
        expect(screen.getByRole("img").textContent?.trim()).toBe("4");
    });

    test("has data-value", () => {
        render(<Subject value={2} label="R" />);
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("2");
    });

    test("supports custom labels", () => {
        render(<Subject value={1} label="R" labels={["Awful", "Poor", "Fine", "Nice", "Great"]} />);
        expect(screen.getByRole("img").textContent).toContain("Awful");
    });

    test("passes through attributes", () => {
        render(<Subject value={1} label="R" data-testid="fv" />);
        expect(screen.getByTestId("fv")).toBeTruthy();
    });
});
