import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NorthernIrelandHealthAndCareNumberView";

describe("NorthernIrelandHealthAndCareNumberView", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(<Subject label="Demo" />);
        const el = container.querySelector(".northern-ireland-health-and-care-number-view");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("span");
    });

    test("appends className prop to root", () => {
        const { container } = render(<Subject label="Demo" className="extra" />);
        const el = container.querySelector(".northern-ireland-health-and-care-number-view");
        expect(el?.className).toContain("northern-ireland-health-and-care-number-view");
        expect(el?.className).toContain("extra");
    });
});
