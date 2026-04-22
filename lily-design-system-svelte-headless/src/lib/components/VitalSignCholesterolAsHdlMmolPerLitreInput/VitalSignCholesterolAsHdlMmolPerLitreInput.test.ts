import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignCholesterolAsHdlMmolPerLitreInput.svelte";

describe("VitalSignCholesterolAsHdlMmolPerLitreInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "HDL cholesterol (mmol/L)" } });
        expect((screen.getByLabelText("HDL cholesterol (mmol/L)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "HDL cholesterol (mmol/L)" } });
        expect(screen.getByLabelText("HDL cholesterol (mmol/L)")).toBeTruthy();
    });

    test("has default min=0, max=10, step=0.1", () => {
        render(Subject, { props: { label: "HDL" } });
        const input = screen.getByLabelText("HDL") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("10");
        expect(input.step).toBe("0.1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "HDL", disabled: true } });
        expect((screen.getByLabelText("HDL") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "HDL", required: true } });
        expect((screen.getByLabelText("HDL") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "HDL", "data-testid": "hdl" } });
        expect(screen.getByTestId("hdl")).toBeTruthy();
    });
});
