import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RadioInput from "./RadioInput.svelte";

describe("RadioInput", () => {
    test("renders the component", () => {
        render(RadioInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
