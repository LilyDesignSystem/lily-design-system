import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ThemeView from "./ThemeView.svelte";

describe("ThemeView", () => {
    test("renders the component", () => {
        render(ThemeView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
