import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarTableFoot from "./CalendarTableFoot.svelte";

describe("CalendarTableFoot", () => {
    test("renders the component", () => {
        render(CalendarTableFoot, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
