import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ButtonInput from "./ButtonInput.svelte";

describe("ButtonInput", () => {
    test("renders the component", () => {
        render(ButtonInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
