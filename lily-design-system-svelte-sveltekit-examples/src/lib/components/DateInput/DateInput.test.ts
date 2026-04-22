import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DateInput from "./DateInput.svelte";

describe("DateInput", () => {
    test("renders the component", () => {
        render(DateInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
