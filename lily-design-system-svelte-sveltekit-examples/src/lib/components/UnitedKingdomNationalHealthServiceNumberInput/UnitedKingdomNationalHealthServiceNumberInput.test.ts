import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import UnitedKingdomNationalHealthServiceNumberInput from "./UnitedKingdomNationalHealthServiceNumberInput.svelte";

describe("UnitedKingdomNationalHealthServiceNumberInput", () => {
    test("renders the component", () => {
        render(UnitedKingdomNationalHealthServiceNumberInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
