import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RomaniaPasaportView";

describe("RomaniaPasaportView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Romanian Passport" value="test-value" />);

        const el = screen.getByLabelText("Romanian Passport");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("romania-pasaport-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Romanian Passport" value="test-value" />);

        const el = screen.getByLabelText("Romanian Passport");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Romanian Passport" />);

        const el = screen.getByLabelText("Romanian Passport");
        expect(el.getAttribute("aria-label")).toBe("Romanian Passport");
    });
});
