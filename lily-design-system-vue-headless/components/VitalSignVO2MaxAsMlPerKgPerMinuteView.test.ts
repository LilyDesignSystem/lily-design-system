import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignVo2MaxAsMlPerKgPerMinuteView.vue";

describe("VitalSignVo2MaxAsMlPerKgPerMinuteView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 42, label: "42 ml/kg/min VO2 max" } });
        expect(screen.getByRole("img", { name: "42 ml/kg/min VO2 max" })).toBeTruthy();
    });

    test("aria-label from label prop", () => {
        render(Subject, { props: { value: 60, label: "60 ml/kg/min VO2 max" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("60 ml/kg/min VO2 max");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 42, label: "42 ml/kg/min VO2 max" } });
        expect(screen.getByRole("img").textContent).toBe("42");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 80, label: "80 ml/kg/min VO2 max" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("80");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 42, label: "42 ml/kg/min VO2 max", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
