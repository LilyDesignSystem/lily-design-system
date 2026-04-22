import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TelInput from "./TelInput.svelte";

describe("TelInput", () => {
    test("renders the component", () => {
        render(TelInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
