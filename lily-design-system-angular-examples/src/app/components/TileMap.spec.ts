import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TileMap } from "./TileMap";

describe("TileMap", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(TileMap);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tile-map");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TileMap);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tile-map");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

describe("TileMap — image role and tile navigation", () => {
  function create() {
    const fixture = TestBed.createComponent(TileMap);
    fixture.componentRef.setInput("label", "Map");
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const root = fixture.nativeElement.querySelector("div.tile-map") as HTMLElement;
    root.innerHTML = [0, 1, 2, 3]
      .map((i) => `<button data-tile id="t${i}" tabindex="-1">${i}</button>`)
      .join("");
    const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
    // 2 x 2 grid geometry (jsdom has no layout).
    const rects = [
      [0, 0], [100, 0], [0, 100], [100, 100],
    ];
    tiles.forEach((t, i) => {
      t.getBoundingClientRect = () =>
        ({ left: rects[i][0], top: rects[i][1], width: 90, height: 90, right: 0, bottom: 0, x: 0, y: 0, toJSON() {} }) as DOMRect;
    });
    return { fixture, root, tiles };
  }

  test("is a labelled img with a tile map role description", () => {
    const { root, fixture } = create();
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("Map");
    expect(root.getAttribute("aria-roledescription")).toBe("tile map");
    fixture.nativeElement.remove();
  });

  test("ArrowRight/ArrowLeft move through tiles in order and clamp", () => {
    const { root, tiles, fixture } = create();
    tiles[0].focus();
    expect(key(root, "ArrowRight").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(tiles[1]);
    tiles[3].focus();
    key(root, "ArrowRight");
    expect(document.activeElement).toBe(tiles[3]);
    tiles[0].focus();
    key(root, "ArrowLeft");
    expect(document.activeElement).toBe(tiles[0]);
    fixture.nativeElement.remove();
  });

  test("ArrowDown/ArrowUp move to the nearest tile in the next/previous row", () => {
    const { root, tiles, fixture } = create();
    tiles[1].focus();
    key(root, "ArrowDown");
    expect(document.activeElement).toBe(tiles[3]);
    key(root, "ArrowUp");
    expect(document.activeElement).toBe(tiles[1]);
    fixture.nativeElement.remove();
  });

  test("Enter and Space fire a bubbling tile-activate event on the focused tile", () => {
    const { root, tiles, fixture } = create();
    const seen: string[] = [];
    root.addEventListener("tile-activate", (e) => seen.push((e.target as HTMLElement).id));
    tiles[2].focus();
    key(root, "Enter");
    key(root, " ");
    expect(seen).toEqual(["t2", "t2"]);
    fixture.nativeElement.remove();
  });

  test("Escape blurs the focused tile", () => {
    const { root, tiles, fixture } = create();
    tiles[1].focus();
    key(root, "Escape");
    expect(document.activeElement).not.toBe(tiles[1]);
    fixture.nativeElement.remove();
  });
});
