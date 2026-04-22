import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FranceNumeroDIdentificationAuRepertoireView from "./FranceNumeroDIdentificationAuRepertoireView.svelte";

describe("FranceNumeroDIdentificationAuRepertoireView", () => {
    test("renders the component", () => {
        render(FranceNumeroDIdentificationAuRepertoireView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
