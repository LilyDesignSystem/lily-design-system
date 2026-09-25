import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PilipinasPhilhealthIdentificationNumberView from "./PilipinasPhilhealthIdentificationNumberView.svelte";

describe("PilipinasPhilhealthIdentificationNumberView", () => {
    test("renders with content", () => {
        render(PilipinasPhilhealthIdentificationNumberView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("pilipinas-philhealth-identification-number-view");
    });
});
