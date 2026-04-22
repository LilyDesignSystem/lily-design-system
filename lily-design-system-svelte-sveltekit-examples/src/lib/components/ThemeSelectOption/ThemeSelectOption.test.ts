import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ThemeSelectOption from "./ThemeSelectOption.svelte";

describe("ThemeSelectOption", () => {
    test("renders the component", () => {
        render(ThemeSelectOption, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
