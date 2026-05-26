import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CeskoCestovniPasView";

describe("CeskoCestovniPasView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Czech Passport" value="test-value" />);

        const el = screen.getByLabelText("Czech Passport");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("cesko-cestovni-pas-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Czech Passport" value="test-value" />);

        const el = screen.getByLabelText("Czech Passport");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Czech Passport" />);

        const el = screen.getByLabelText("Czech Passport");
        expect(el.getAttribute("aria-label")).toBe("Czech Passport");
    });
});
