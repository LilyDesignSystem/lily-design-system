import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Fieldset from "./Fieldset.svelte";

describe("Fieldset", () => {
    test("renders the component", () => {
        render(Fieldset, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
