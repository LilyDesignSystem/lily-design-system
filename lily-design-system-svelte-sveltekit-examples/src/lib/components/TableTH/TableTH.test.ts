import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TableTD from "./TableTD.svelte";

describe("TableTD", () => {
    test("renders with content", () => {
        render(TableTD, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("table-th");
    });
});
