import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBodyTemperatureAsCelciusView from "./VitalSignBodyTemperatureAsCelciusView.svelte";

describe("VitalSignBodyTemperatureAsCelciusView", () => {
    test("renders with content", () => {
        render(VitalSignBodyTemperatureAsCelciusView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-body-temperature-as-celcius-view");
    });
});
