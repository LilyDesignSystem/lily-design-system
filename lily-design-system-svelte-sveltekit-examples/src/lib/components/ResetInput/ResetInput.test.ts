import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ResetInput from "./ResetInput.svelte";

describe("ResetInput", () => {
    test("renders the component", () => {
        render(ResetInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
