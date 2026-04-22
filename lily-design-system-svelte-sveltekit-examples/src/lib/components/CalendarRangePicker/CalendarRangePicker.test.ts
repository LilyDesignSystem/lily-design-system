import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarRangePicker from "./CalendarRangePicker.svelte";

describe("CalendarRangePicker", () => {
    test("renders the component", () => {
        render(CalendarRangePicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
