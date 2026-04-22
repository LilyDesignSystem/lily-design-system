import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TableBody from "./TableBody.svelte";

describe("TableBody", () => {
    test("renders with content", () => {
        render(TableBody, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("table-body");
    });
});
