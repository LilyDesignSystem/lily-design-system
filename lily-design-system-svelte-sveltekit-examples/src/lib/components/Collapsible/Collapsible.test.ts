import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Collapsible from "./Collapsible.svelte";

describe("Collapsible", () => {
    test("renders the component", () => {
        render(Collapsible, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
