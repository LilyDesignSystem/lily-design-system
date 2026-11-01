import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./IranKodEMelliView";

describe("IranKodEMelliView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="National Code (Kod-e Melli)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("National Code (Kod-e Melli)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("iran-kod-e-melli-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="National Code (Kod-e Melli)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("National Code (Kod-e Melli)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Code (Kod-e Melli)" />);

        const el = screen.getByLabelText("National Code (Kod-e Melli)");
        expect(el.getAttribute("aria-label")).toBe("National Code (Kod-e Melli)");
    });
});
