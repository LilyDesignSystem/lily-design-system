import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./DateTimeNowInput";

describe("DateTimeNowInput", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(<Subject label="Demo" />);
        const el = container.querySelector(".date-time-now-input");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends className prop to root", () => {
        const { container } = render(<Subject label="Demo" className="extra" />);
        const el = container.querySelector(".date-time-now-input");
        expect(el?.className).toContain("date-time-now-input");
        expect(el?.className).toContain("extra");
    });
});
