import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBodyTemperatureAsCelciusInput from "./VitalSignBodyTemperatureAsCelciusInput.svelte";

describe("VitalSignBodyTemperatureAsCelciusInput", () => {
    test("renders with content", () => {
        render(VitalSignBodyTemperatureAsCelciusInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-body-temperature-as-celcius-input");
    });
});
