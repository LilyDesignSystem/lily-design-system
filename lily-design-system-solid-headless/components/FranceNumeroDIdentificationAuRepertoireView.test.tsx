import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./FranceNumeroDIdentificationAuRepertoireView";

describe("FranceNumeroDIdentificationAuRepertoireView", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(() => <Subject label="Demo" />);
        const el = container.querySelector(".france-numero-d-identification-au-repertoire-view");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("span");
    });

    test("appends className prop to root", () => {
        const { container } = render(() => (
            <Subject
                label="Demo"
                class="extra"
            />
        ));
        const el = container.querySelector(".france-numero-d-identification-au-repertoire-view");
        expect(el?.className).toContain("france-numero-d-identification-au-repertoire-view");
        expect(el?.className).toContain("extra");
    });
});
