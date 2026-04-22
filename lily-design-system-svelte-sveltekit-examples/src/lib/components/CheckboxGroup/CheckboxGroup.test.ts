import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CheckboxGroup from "./CheckboxGroup.svelte";

describe("CheckboxGroup", () => {
    test("renders with content", () => {
        render(CheckboxGroup, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("checkbox-group");
    });
});
