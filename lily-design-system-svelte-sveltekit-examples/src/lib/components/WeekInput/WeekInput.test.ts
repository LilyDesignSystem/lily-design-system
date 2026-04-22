import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import WeekInput from "./WeekInput.svelte";

describe("WeekInput", () => {
    test("renders the component", () => {
        render(WeekInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
