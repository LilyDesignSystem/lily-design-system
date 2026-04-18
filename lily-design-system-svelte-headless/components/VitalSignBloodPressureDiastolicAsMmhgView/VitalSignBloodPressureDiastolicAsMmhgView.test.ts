import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignBloodPressureDiastolicAsMmhgView.svelte";

describe("VitalSignBloodPressureDiastolicAsMmhgView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 80, label: "80 mmHg diastolic" } });
        expect(screen.getByRole("img", { name: "80 mmHg diastolic" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 80, label: "80 mmHg diastolic" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("80 mmHg diastolic");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 80, label: "80 mmHg diastolic" } });
        expect(screen.getByRole("img").textContent).toBe("80");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 95, label: "95 mmHg diastolic" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("95");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 80, label: "D", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
