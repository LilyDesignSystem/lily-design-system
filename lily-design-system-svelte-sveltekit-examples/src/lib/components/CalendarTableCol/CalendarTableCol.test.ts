import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarTableCol from "./CalendarTableCol.svelte";

describe("CalendarTableCol", () => {
    test("renders the component", () => {
        render(CalendarTableCol, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
