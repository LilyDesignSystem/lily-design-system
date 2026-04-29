import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarTableTD from "./CalendarTableTD.svelte";

describe("CalendarTableTD", () => {
    test("renders the component", () => {
        render(CalendarTableTD, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
