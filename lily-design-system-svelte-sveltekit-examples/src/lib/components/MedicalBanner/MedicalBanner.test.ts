import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBanner from "./MedicalBanner.svelte";

describe("MedicalBanner", () => {
    test("renders the component", () => {
        render(MedicalBanner, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
