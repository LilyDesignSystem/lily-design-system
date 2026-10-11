import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./LuxembourgMatriculeView.svelte";

describe("LuxembourgMatriculeView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Numéro d'Identification Nationale (Matricule)", value: "test-value" } });

        const el = screen.getByLabelText("Numéro d'Identification Nationale (Matricule)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("luxembourg-matricule-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Numéro d'Identification Nationale (Matricule)", value: "test-value" } });

        const el = screen.getByLabelText("Numéro d'Identification Nationale (Matricule)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Numéro d'Identification Nationale (Matricule)" } });

        const el = screen.getByLabelText("Numéro d'Identification Nationale (Matricule)");
        expect(el.getAttribute("aria-label")).toBe("Numéro d'Identification Nationale (Matricule)");
    });
});
