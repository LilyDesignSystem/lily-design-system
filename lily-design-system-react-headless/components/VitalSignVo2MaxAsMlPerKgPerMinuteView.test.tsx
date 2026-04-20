import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignVo2MaxAsMlPerKgPerMinuteView";

describe("VitalSignVo2MaxAsMlPerKgPerMinuteView", () => {
    test("renders span with img role", () => {
        render(<Subject value={42} label="42 ml/kg/min VO2 max" />);
        expect(screen.getByRole("img")).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(<Subject value={42} label="42 ml/kg/min VO2 max" />);
        expect(screen.getByRole("img", { name: "42 ml/kg/min VO2 max" })).toBeTruthy();
    });

    test("displays value as text content", () => {
        render(<Subject value={42} label="42 ml/kg/min VO2 max" />);
        expect(screen.getByRole("img").textContent).toBe("42");
    });

    test("has data-value attribute", () => {
        render(<Subject value={42} label="42 ml/kg/min VO2 max" />);
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("42");
    });

    test("passes through attributes", () => {
        render(<Subject value={42} label="R" data-testid="rv" />);
        expect(screen.getByTestId("rv")).toBeTruthy();
    });
});
