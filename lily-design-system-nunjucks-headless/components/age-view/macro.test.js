import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("age-view", () => {
    it("renders the consumer's words and the duration as data", () => {
        const { document } = render("age-view", {
            label: "Age",
            value: "3 weeks 2 days",
            duration: "P23D",
        });
        const root = document.querySelector("span.age-view");
        expect(root.getAttribute("data-duration")).toBe("P23D");
        expect(root.textContent).toBe("Age 3 weeks 2 days");
        expect(root.hasAttribute("aria-label")).toBe(false);
    });
});
