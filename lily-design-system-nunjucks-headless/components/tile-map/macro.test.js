import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("tile-map", () => {
    it("renders a <div> with class tile-map", () => {
        const { document } = render(
            "tile-map",
            { label: "USA tile map" },
            "<button data-tile></button>",
        );
        expect(document.querySelector("div.tile-map")).toBeTruthy();
    });

    it("applies role=img with aria-label and aria-roledescription", () => {
        const { document } = render("tile-map", { label: "USA tile map" }, "x");
        const root = document.querySelector(".tile-map");
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("USA tile map");
        expect(root.getAttribute("aria-roledescription")).toBe("tile map");
    });

    it("renders caller content", () => {
        const { document } = render("tile-map", { label: "x" }, "<button data-tile>A</button>");
        expect(document.querySelector("[data-tile]").textContent).toBe("A");
    });
});

describe("tile-map keys", () => {
    it("moves between tiles, activates and leaves", () => {
        const { document } = render(
            "tile-map",
            { label: "Map" },
            "<button data-tile>A</button><button data-tile>B</button>",
        );
        autoInit(document);
        const [a, b] = document.querySelectorAll("[data-tile]");
        let activated = 0;
        b.addEventListener("tile-activate", () => activated++);
        on(a).press("ArrowRight");
        expect(document.activeElement).toBe(b);
        document.activeElement.dispatchEvent(
            new document.defaultView.KeyboardEvent("keydown", { key: " ", bubbles: true }),
        );
        expect(activated).toBe(1);
        on(b).press("Escape");
        expect(document.activeElement).not.toBe(b);
    });
});
