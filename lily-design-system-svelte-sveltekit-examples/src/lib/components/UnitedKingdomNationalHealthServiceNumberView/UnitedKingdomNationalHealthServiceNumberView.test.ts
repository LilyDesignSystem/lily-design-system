import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import UnitedKingdomNationalHealthServiceNumberView from "./UnitedKingdomNationalHealthServiceNumberView.svelte";

describe("UnitedKingdomNationalHealthServiceNumberView", () => {
    test("renders the component", () => {
        render(UnitedKingdomNationalHealthServiceNumberView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
