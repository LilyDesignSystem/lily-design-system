import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import HiddenInput from "./HiddenInput.svelte";

describe("HiddenInput", () => {
    test("renders the component", () => {
        render(HiddenInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
