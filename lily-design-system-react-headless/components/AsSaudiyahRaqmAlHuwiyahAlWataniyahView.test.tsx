import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahView";

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="National Identification Number"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("National Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="National Identification Number"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("National Identification Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Identification Number" />);

        const el = screen.getByLabelText("National Identification Number");
        expect(el.getAttribute("aria-label")).toBe("National Identification Number");
    });
});
