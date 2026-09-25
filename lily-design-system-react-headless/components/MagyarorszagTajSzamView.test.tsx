import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MagyarorszagTajSzamView";

describe("MagyarorszagTajSzamView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Társadalombiztosítási Azonosító Jel (TAJ)" value="test-value" />);

        const el = screen.getByLabelText("Társadalombiztosítási Azonosító Jel (TAJ)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("magyarorszag-taj-szam-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Társadalombiztosítási Azonosító Jel (TAJ)" value="test-value" />);

        const el = screen.getByLabelText("Társadalombiztosítási Azonosító Jel (TAJ)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Társadalombiztosítási Azonosító Jel (TAJ)" />);

        const el = screen.getByLabelText("Társadalombiztosítási Azonosító Jel (TAJ)");
        expect(el.getAttribute("aria-label")).toBe("Társadalombiztosítási Azonosító Jel (TAJ)");
    });
});
