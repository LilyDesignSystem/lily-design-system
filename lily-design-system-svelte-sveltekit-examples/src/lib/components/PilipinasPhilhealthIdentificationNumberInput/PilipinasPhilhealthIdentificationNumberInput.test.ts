import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PilipinasPhilhealthIdentificationNumberInput from "./PilipinasPhilhealthIdentificationNumberInput.svelte";

describe("PilipinasPhilhealthIdentificationNumberInput", () => {
    test("renders with content", () => {
        render(PilipinasPhilhealthIdentificationNumberInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("pilipinas-philhealth-identification-number-input");
    });
});
