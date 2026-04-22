import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Footnote from "./Footnote.svelte";

describe("Footnote", () => {
    test("renders the component", () => {
        render(Footnote, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
