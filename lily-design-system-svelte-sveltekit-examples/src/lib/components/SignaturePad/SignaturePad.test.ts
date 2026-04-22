import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SignaturePad from "./SignaturePad.svelte";

describe("SignaturePad", () => {
    test("renders the component", () => {
        render(SignaturePad, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
