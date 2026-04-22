import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PostalCodeInput from "./PostalCodeInput.svelte";

describe("PostalCodeInput", () => {
    test("renders the component", () => {
        render(PostalCodeInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
