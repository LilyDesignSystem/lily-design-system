import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MeasurementUnitInput from "./MeasurementUnitInput.svelte";

describe("MeasurementUnitInput", () => {
    test("renders the component", () => {
        render(MeasurementUnitInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
