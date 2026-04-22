import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FranceNumeroDIdentificationAuRepertoireInput from "./FranceNumeroDIdentificationAuRepertoireInput.svelte";

describe("FranceNumeroDIdentificationAuRepertoireInput", () => {
    test("renders the component", () => {
        render(FranceNumeroDIdentificationAuRepertoireInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
