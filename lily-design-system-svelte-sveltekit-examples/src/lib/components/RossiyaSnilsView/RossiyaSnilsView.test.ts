import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./RossiyaSnilsView.svelte";

describe("RossiyaSnilsView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)", value: "test-value" } });

        const el = screen.getByLabelText("СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("rossiya-snils-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)", value: "test-value" } });

        const el = screen.getByLabelText("СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)" } });

        const el = screen.getByLabelText("СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)");
        expect(el.getAttribute("aria-label")).toBe("СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)");
    });
});
