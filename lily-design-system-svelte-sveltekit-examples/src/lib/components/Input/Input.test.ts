import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Input from "./Input.svelte";

describe("Input", () => {
    test("renders the component", () => {
        render(Input, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
