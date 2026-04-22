import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EspanaTarjetaSanitariaIndividualInput from "./EspanaTarjetaSanitariaIndividualInput.svelte";

describe("EspanaTarjetaSanitariaIndividualInput", () => {
    test("renders the component", () => {
        render(EspanaTarjetaSanitariaIndividualInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
