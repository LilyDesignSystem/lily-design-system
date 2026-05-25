import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./IrelandIndividualHealthIdentifierInput";

describe("IrelandIndividualHealthIdentifierInput", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(<Subject label="Demo" />);
        const el = container.querySelector(".ireland-individual-health-identifier-input");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("input");
    });

    test("appends className prop to root", () => {
        const { container } = render(<Subject label="Demo" className="extra" />);
        const el = container.querySelector(".ireland-individual-health-identifier-input");
        expect(el?.className).toContain("ireland-individual-health-identifier-input");
        expect(el?.className).toContain("extra");
    });
});
