import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MonthInput from "./MonthInput.svelte";

describe("MonthInput", () => {
    test("renders the component", () => {
        render(MonthInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
