import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PostalCodeView from "./PostalCodeView.svelte";

describe("PostalCodeView", () => {
    test("renders the component", () => {
        render(PostalCodeView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
