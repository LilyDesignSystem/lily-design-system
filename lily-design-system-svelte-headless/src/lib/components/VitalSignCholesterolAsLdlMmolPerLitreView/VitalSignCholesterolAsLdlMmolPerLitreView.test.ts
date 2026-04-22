import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignCholesterolAsLdlMmolPerLitreView.svelte";

describe("VitalSignCholesterolAsLdlMmolPerLitreView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 2.5, label: "2.5 mmol/L LDL cholesterol" } });
        expect(screen.getByRole("img", { name: "2.5 mmol/L LDL cholesterol" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 2.5, label: "2.5 mmol/L LDL cholesterol" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("2.5 mmol/L LDL cholesterol");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 2.5, label: "2.5 mmol/L LDL cholesterol" } });
        expect(screen.getByRole("img").textContent).toBe("2.5");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 2.5, label: "2.5 mmol/L LDL cholesterol" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("2.5");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 2.5, label: "T", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
