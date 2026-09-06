import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EireIndividualHealthIdentifierView";

describe("EireIndividualHealthIdentifierView", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(<Subject label="Demo" />);
        const el = container.querySelector(".eire-individual-health-identifier-view");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("span");
    });

    test("appends className prop to root", () => {
        const { container } = render(<Subject label="Demo" className="extra" />);
        const el = container.querySelector(".eire-individual-health-identifier-view");
        expect(el?.className).toContain("eire-individual-health-identifier-view");
        expect(el?.className).toContain("extra");
    });
});
