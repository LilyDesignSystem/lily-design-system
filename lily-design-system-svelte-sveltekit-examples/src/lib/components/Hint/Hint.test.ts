import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Hint from "./Hint.svelte";

describe("Hint", () => {
    test("renders the component", () => {
        render(Hint, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
