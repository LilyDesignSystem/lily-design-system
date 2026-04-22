import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import IrelandIndividualHealthIdentifierInput from "./IrelandIndividualHealthIdentifierInput.svelte";

describe("IrelandIndividualHealthIdentifierInput", () => {
    test("renders the component", () => {
        render(IrelandIndividualHealthIdentifierInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
