import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ThemeSelect from "./ThemeSelect.svelte";

describe("ThemeSelect", () => {
    test("renders the component", () => {
        render(ThemeSelect, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
