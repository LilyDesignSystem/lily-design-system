import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignCholesterolAsHdlMmolPerLitreView.svelte";

describe("VitalSignCholesterolAsHdlMmolPerLitreView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 1.5, label: "1.5 mmol/L HDL cholesterol" } });
        expect(screen.getByRole("img", { name: "1.5 mmol/L HDL cholesterol" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 1.5, label: "1.5 mmol/L HDL cholesterol" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("1.5 mmol/L HDL cholesterol");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 1.5, label: "1.5 mmol/L HDL cholesterol" } });
        expect(screen.getByRole("img").textContent).toBe("1.5");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 1.5, label: "1.5 mmol/L HDL cholesterol" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("1.5");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 1.5, label: "T", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
