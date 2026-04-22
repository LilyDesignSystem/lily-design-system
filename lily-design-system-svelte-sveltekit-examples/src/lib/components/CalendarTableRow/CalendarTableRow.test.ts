import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarTableRow from "./CalendarTableRow.svelte";

describe("CalendarTableRow", () => {
    test("renders the component", () => {
        render(CalendarTableRow, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
