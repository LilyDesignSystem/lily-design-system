import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MagyarorszagTajSzamView.svelte";

describe("MagyarorszagTajSzamView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Társadalombiztosítási Azonosító Jel (TAJ)", value: "test-value" } });

        const el = screen.getByLabelText("Társadalombiztosítási Azonosító Jel (TAJ)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("magyarorszag-taj-szam-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Társadalombiztosítási Azonosító Jel (TAJ)", value: "test-value" } });

        const el = screen.getByLabelText("Társadalombiztosítási Azonosító Jel (TAJ)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Társadalombiztosítási Azonosító Jel (TAJ)" } });

        const el = screen.getByLabelText("Társadalombiztosítási Azonosító Jel (TAJ)");
        expect(el.getAttribute("aria-label")).toBe("Társadalombiztosítási Azonosító Jel (TAJ)");
    });
});
