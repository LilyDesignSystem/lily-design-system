import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TableData from "./TableData.svelte";

describe("TableData", () => {
    test("renders with content", () => {
        render(TableData, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("table-data");
    });
});
