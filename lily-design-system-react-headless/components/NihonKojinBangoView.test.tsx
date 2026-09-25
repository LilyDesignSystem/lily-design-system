import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NihonKojinBangoView";

describe("NihonKojinBangoView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" value="test-value" />);

        const el = screen.getByLabelText("Individual Number / My Number (マイナンバー)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nihon-kojin-bango-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" value="test-value" />);

        const el = screen.getByLabelText("Individual Number / My Number (マイナンバー)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" />);

        const el = screen.getByLabelText("Individual Number / My Number (マイナンバー)");
        expect(el.getAttribute("aria-label")).toBe("Individual Number / My Number (マイナンバー)");
    });
});
