import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EspanaTarjetaSanitariaIndividualInput";

describe("EspanaTarjetaSanitariaIndividualInput", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(<Subject label="Demo" />);
        const el = container.querySelector(".espana-tarjeta-sanitaria-individual-input");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("input");
    });

    test("appends className prop to root", () => {
        const { container } = render(<Subject label="Demo" className="extra" />);
        const el = container.querySelector(".espana-tarjeta-sanitaria-individual-input");
        expect(el?.className).toContain("espana-tarjeta-sanitaria-individual-input");
        expect(el?.className).toContain("extra");
    });
});
