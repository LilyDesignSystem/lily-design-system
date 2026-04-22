import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Expander from "./Expander.svelte";

describe("Expander", () => {
    test("renders the component", () => {
        render(Expander, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
