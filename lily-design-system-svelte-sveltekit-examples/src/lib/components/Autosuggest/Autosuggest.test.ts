import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Autosuggest from "./Autosuggest.svelte";

describe("Autosuggest", () => {
    test("renders the component", () => {
        render(Autosuggest, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
