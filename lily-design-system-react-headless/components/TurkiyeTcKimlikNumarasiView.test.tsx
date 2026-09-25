import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TurkiyeTcKimlikNumarasiView";

describe("TurkiyeTcKimlikNumarasiView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="T.C. Kimlik Numarası" value="test-value" />);

        const el = screen.getByLabelText("T.C. Kimlik Numarası");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("turkiye-tc-kimlik-numarasi-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="T.C. Kimlik Numarası" value="test-value" />);

        const el = screen.getByLabelText("T.C. Kimlik Numarası");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="T.C. Kimlik Numarası" />);

        const el = screen.getByLabelText("T.C. Kimlik Numarası");
        expect(el.getAttribute("aria-label")).toBe("T.C. Kimlik Numarası");
    });
});
