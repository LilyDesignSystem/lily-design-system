import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignBodyTemperatureAsCelciusInput.svelte";

describe("VitalSignBodyTemperatureAsCelciusInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Body temperature (°C)" } });
        expect((screen.getByLabelText("Body temperature (°C)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Body temperature (°C)" } });
        expect(screen.getByLabelText("Body temperature (°C)")).toBeTruthy();
    });

    test("has default min=30, max=45, step=0.1", () => {
        render(Subject, { props: { label: "Temp" } });
        const input = screen.getByLabelText("Temp") as HTMLInputElement;
        expect(input.min).toBe("30");
        expect(input.max).toBe("45");
        expect(input.step).toBe("0.1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Temp", disabled: true } });
        expect((screen.getByLabelText("Temp") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Temp", required: true } });
        expect((screen.getByLabelText("Temp") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Temp", "data-testid": "bt" } });
        expect(screen.getByTestId("bt")).toBeTruthy();
    });
});
