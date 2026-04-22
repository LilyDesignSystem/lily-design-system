import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SubmitInput from "./SubmitInput.svelte";

describe("SubmitInput", () => {
    test("renders the component", () => {
        render(SubmitInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
