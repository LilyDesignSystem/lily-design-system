import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarTableData from "./CalendarTableData.svelte";

describe("CalendarTableData", () => {
    test("renders the component", () => {
        render(CalendarTableData, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
