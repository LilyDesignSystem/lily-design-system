import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DateRange from "./DateRange.svelte";

describe("DateRange", () => {
    test("renders the component", () => {
        render(DateRange, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
