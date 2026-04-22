import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EspanaTarjetaSanitariaIndividualView from "./EspanaTarjetaSanitariaIndividualView.svelte";

describe("EspanaTarjetaSanitariaIndividualView", () => {
    test("renders the component", () => {
        render(EspanaTarjetaSanitariaIndividualView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
