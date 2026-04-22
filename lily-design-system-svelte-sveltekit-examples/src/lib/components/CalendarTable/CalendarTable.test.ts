import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarTable from "./CalendarTable.svelte";

describe("CalendarTable", () => {
    test("renders the component", () => {
        render(CalendarTable, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
