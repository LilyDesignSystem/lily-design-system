import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarTableHead from "./CalendarTableHead.svelte";

describe("CalendarTableHead", () => {
    test("renders the component", () => {
        render(CalendarTableHead, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
