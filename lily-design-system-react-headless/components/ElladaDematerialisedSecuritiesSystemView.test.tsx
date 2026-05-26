import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ElladaDematerialisedSecuritiesSystemView";

describe("ElladaDematerialisedSecuritiesSystemView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Dematerialised Securities System" value="test-value" />);

        const el = screen.getByLabelText("Dematerialised Securities System");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ellada-dematerialised-securities-system-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Dematerialised Securities System" value="test-value" />);

        const el = screen.getByLabelText("Dematerialised Securities System");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Dematerialised Securities System" />);

        const el = screen.getByLabelText("Dematerialised Securities System");
        expect(el.getAttribute("aria-label")).toBe("Dematerialised Securities System");
    });
});
