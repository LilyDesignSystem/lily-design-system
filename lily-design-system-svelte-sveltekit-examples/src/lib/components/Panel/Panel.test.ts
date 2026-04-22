import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Panel from "./Panel.svelte";

describe("Panel", () => {
    test("renders the component", () => {
        render(Panel, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
