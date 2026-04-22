import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Sparkline from "./Sparkline.svelte";

describe("Sparkline", () => {
    test("renders the component", () => {
        render(Sparkline, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
