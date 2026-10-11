import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SchweizAhvNummerView.svelte";

describe("SchweizAhvNummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "AHV-Nummer / Numéro AVS", value: "test-value" } });

        const el = screen.getByLabelText("AHV-Nummer / Numéro AVS");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("schweiz-ahv-nummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "AHV-Nummer / Numéro AVS", value: "test-value" } });

        const el = screen.getByLabelText("AHV-Nummer / Numéro AVS");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "AHV-Nummer / Numéro AVS" } });

        const el = screen.getByLabelText("AHV-Nummer / Numéro AVS");
        expect(el.getAttribute("aria-label")).toBe("AHV-Nummer / Numéro AVS");
    });
});
