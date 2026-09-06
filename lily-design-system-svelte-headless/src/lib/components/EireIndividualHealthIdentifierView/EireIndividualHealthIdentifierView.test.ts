import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EireIndividualHealthIdentifierView from "./EireIndividualHealthIdentifierView.svelte";

describe("EireIndividualHealthIdentifierView", () => {
    test("renders with content", () => {
        render(EireIndividualHealthIdentifierView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("eire-individual-health-identifier-view");
    });
});
