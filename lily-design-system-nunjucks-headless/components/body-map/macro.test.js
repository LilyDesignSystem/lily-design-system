import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

const regions = [
    { id: "head", label: "Head" },
    { id: "left-arm", label: "Left arm" },
];

describe("body-map", () => {
    it("is a fieldset with a legend, a hidden drawing and a checkbox per region", () => {
        const { document } = render(
            "body-map",
            { label: "Where is the pain?", name: "sites", regions, selected: ["head"] },
            '<svg viewBox="0 0 10 10"><circle data-region="head" r="2"></circle></svg>',
        );
        const root = document.querySelector("fieldset.body-map");
        expect(root.querySelector("legend").textContent).toBe("Where is the pain?");
        expect(root.querySelector(".body-map-figure").getAttribute("aria-hidden")).toBe("true");
        const boxes = root.querySelectorAll('input[type="checkbox"]');
        expect([...boxes].map((b) => [b.value, b.name, b.checked])).toEqual([
            ["head", "sites", true],
            ["left-arm", "sites", false],
        ]);
    });
});
