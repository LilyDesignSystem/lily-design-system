import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignBodyTemperatureAsCelciusView.svelte";

describe("VitalSignBodyTemperatureAsCelciusView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 37.0, label: "37.0 degrees Celsius" } });
        expect(screen.getByRole("img", { name: "37.0 degrees Celsius" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 37.0, label: "37.0 degrees Celsius" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("37.0 degrees Celsius");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 37.0, label: "37.0 degrees Celsius" } });
        expect(screen.getByRole("img").textContent).toBe("37");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 38.5, label: "38.5 degrees Celsius" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("38.5");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 37.0, label: "T", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
