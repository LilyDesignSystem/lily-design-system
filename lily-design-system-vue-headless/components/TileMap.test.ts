import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import Subject from "./TileMap.vue";

describe("TileMap", () => {
    test("renders a div with class tile-map", () => {
        const { container } = render(Subject, {
            props: { label: "USA tile map" },
            slots: { default: "x" },
        });
        const root = container.querySelector(".tile-map");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=img with aria-label and aria-roledescription", () => {
        render(Subject, { props: { label: "USA tile map" }, slots: { default: "x" } });
        const map = screen.getByRole("img", { name: "USA tile map" });
        expect(map.getAttribute("aria-roledescription")).toBe("tile map");
    });

    test("ArrowRight moves focus to the next tile", async () => {
        const { container } = render(Subject, {
            props: { label: "x" },
            slots: { default: "<button data-tile tabindex=\"0\">A</button><button data-tile tabindex=\"-1\">B</button><button data-tile tabindex=\"-1\">C</button>" },
        });
        const tiles = Array.from(container.querySelectorAll("[data-tile]")) as HTMLElement[];
        tiles[0].focus();
        await fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "ArrowRight" });
        expect(document.activeElement).toBe(tiles[1]);
    });

    test("Enter dispatches a tile-activate event on the focused tile", async () => {
        const { container } = render(Subject, {
            props: { label: "x" },
            slots: { default: "<button data-tile tabindex=\"0\">A</button>" },
        });
        const tile = container.querySelector("[data-tile]") as HTMLElement;
        const handler = vi.fn();
        tile.addEventListener("tile-activate", handler);
        tile.focus();
        await fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "Enter" });
        expect(handler).toHaveBeenCalledOnce();
    });

    test("Escape blurs the focused tile", async () => {
        const { container } = render(Subject, {
            props: { label: "x" },
            slots: { default: "<button data-tile tabindex=\"0\">A</button>" },
        });
        const tile = container.querySelector("[data-tile]") as HTMLElement;
        tile.focus();
        expect(document.activeElement).toBe(tile);
        await fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "Escape" });
        expect(document.activeElement).not.toBe(tile);
    });

    test("does not crash when there are no tiles", async () => {
        const { container } = render(Subject, {
            props: { label: "x" },
            slots: { default: "no tiles" },
        });
        // should not throw
        await fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "ArrowRight" });
        // assertion: still rendered
        expect(container.querySelector(".tile-map")).toBeTruthy();
    });
});
