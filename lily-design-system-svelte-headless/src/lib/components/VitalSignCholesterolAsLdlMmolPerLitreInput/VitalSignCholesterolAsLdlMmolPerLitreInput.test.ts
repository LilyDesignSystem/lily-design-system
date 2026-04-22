import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignCholesterolAsLdlMmolPerLitreInput.svelte";

describe("VitalSignCholesterolAsLdlMmolPerLitreInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "LDL cholesterol (mmol/L)" } });
        expect((screen.getByLabelText("LDL cholesterol (mmol/L)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "LDL cholesterol (mmol/L)" } });
        expect(screen.getByLabelText("LDL cholesterol (mmol/L)")).toBeTruthy();
    });

    test("has default min=0, max=10, step=0.1", () => {
        render(Subject, { props: { label: "LDL" } });
        const input = screen.getByLabelText("LDL") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("10");
        expect(input.step).toBe("0.1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "LDL", disabled: true } });
        expect((screen.getByLabelText("LDL") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "LDL", required: true } });
        expect((screen.getByLabelText("LDL") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "LDL", "data-testid": "ldl" } });
        expect(screen.getByTestId("ldl")).toBeTruthy();
    });
});
