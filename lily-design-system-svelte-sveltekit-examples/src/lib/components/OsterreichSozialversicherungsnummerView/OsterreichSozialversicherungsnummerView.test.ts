import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./OsterreichSozialversicherungsnummerView.svelte";

describe("OsterreichSozialversicherungsnummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)", value: "test-value" } });

        const el = screen.getByLabelText("Sozialversicherungsnummer (SVNR)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("osterreich-sozialversicherungsnummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)", value: "test-value" } });

        const el = screen.getByLabelText("Sozialversicherungsnummer (SVNR)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)" } });

        const el = screen.getByLabelText("Sozialversicherungsnummer (SVNR)");
        expect(el.getAttribute("aria-label")).toBe("Sozialversicherungsnummer (SVNR)");
    });
});
