import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CalendarTableBody from "./CalendarTableBody.svelte";

describe("CalendarTableBody", () => {
    test("renders the component", () => {
        render(CalendarTableBody, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
