import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ThemePicker from "./ThemePicker.svelte";

describe("ThemePicker", () => {
    test("renders the component", () => {
        render(ThemePicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
