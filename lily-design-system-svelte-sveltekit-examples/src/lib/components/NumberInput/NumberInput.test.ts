import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NumberInput from "./NumberInput.svelte";

describe("NumberInput", () => {
    test("renders the component", () => {
        render(NumberInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
