import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AgeView";

describe("AgeView", () => {
    test("renders the consumer's words and the duration as data", () => {
        const { container } = render(
            <Subject
                label="Age"
                value="3 weeks 2 days"
                duration="P23D"
            />,
        );
        const root = container.querySelector(".age-view") as HTMLElement;
        expect(root.tagName).toBe("SPAN");
        expect(root.getAttribute("data-duration")).toBe("P23D");
        expect(root.textContent).toBe("Age 3 weeks 2 days");
        expect(root.hasAttribute("aria-label")).toBe(false);
    });
});
