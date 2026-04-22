import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import IrelandIndividualHealthIdentifierView from "./IrelandIndividualHealthIdentifierView.svelte";

describe("IrelandIndividualHealthIdentifierView", () => {
    test("renders the component", () => {
        render(IrelandIndividualHealthIdentifierView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
