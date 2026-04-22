import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TableFoot from "./TableFoot.svelte";

describe("TableFoot", () => {
    test("renders with content", () => {
        render(TableFoot, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("table-foot");
    });
});
