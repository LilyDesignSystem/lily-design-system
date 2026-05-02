import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TileMap";

describe("TileMap", () => {
    test("renders a div with class tile-map", () => {
        const { container } = render(<Subject label="USA tile map">x</Subject>);
        const root = container.querySelector(".tile-map");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=img with aria-label and aria-roledescription", () => {
        render(<Subject label="USA tile map">x</Subject>);
        const map = screen.getByRole("img", { name: "USA tile map" });
        expect(map.getAttribute("aria-roledescription")).toBe("tile map");
    });

    test("renders children content", () => {
        const { container } = render(<Subject label="x"><span>tiles</span></Subject>);
        expect(container.textContent).toBe("tiles");
    });

    test("ArrowRight moves focus to the next tile", () => {
        const { container } = render(
            <Subject label="x">
                <button data-tile tabIndex={0}>A</button>
                <button data-tile tabIndex={-1}>B</button>
                <button data-tile tabIndex={-1}>C</button>
            </Subject>
        );
        const tiles = Array.from(container.querySelectorAll("[data-tile]")) as HTMLElement[];
        tiles[0].focus();
        fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "ArrowRight" });
        expect(document.activeElement).toBe(tiles[1]);
    });

    test("ArrowLeft moves focus to the previous tile", () => {
        const { container } = render(
            <Subject label="x">
                <button data-tile tabIndex={-1}>A</button>
                <button data-tile tabIndex={0}>B</button>
            </Subject>
        );
        const tiles = Array.from(container.querySelectorAll("[data-tile]")) as HTMLElement[];
        tiles[1].focus();
        fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "ArrowLeft" });
        expect(document.activeElement).toBe(tiles[0]);
    });

    test("Enter dispatches a tile-activate event on the focused tile", () => {
        const { container } = render(
            <Subject label="x">
                <button data-tile tabIndex={0}>A</button>
            </Subject>
        );
        const tile = container.querySelector("[data-tile]") as HTMLElement;
        const handler = vi.fn();
        tile.addEventListener("tile-activate", handler);
        tile.focus();
        fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "Enter" });
        expect(handler).toHaveBeenCalledOnce();
    });

    test("Escape blurs the focused tile", () => {
        const { container } = render(
            <Subject label="x">
                <button data-tile tabIndex={0}>A</button>
            </Subject>
        );
        const tile = container.querySelector("[data-tile]") as HTMLElement;
        tile.focus();
        expect(document.activeElement).toBe(tile);
        fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "Escape" });
        expect(document.activeElement).not.toBe(tile);
    });

    test("does not crash when there are no tiles", () => {
        const { container } = render(<Subject label="x">no tiles</Subject>);
        // should not throw
        expect(() =>
            fireEvent.keyDown(container.querySelector(".tile-map")!, { key: "ArrowRight" })
        ).not.toThrow();
    });
});
