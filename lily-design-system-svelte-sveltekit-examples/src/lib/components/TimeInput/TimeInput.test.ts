import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TimeInput from "./TimeInput.svelte";

describe("TimeInput", () => {
    test("renders the component", () => {
        render(TimeInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
