import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TableHead from "./TableHead.svelte";

describe("TableHead", () => {
    test("renders with content", () => {
        render(TableHead, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("table-head");
    });
});
