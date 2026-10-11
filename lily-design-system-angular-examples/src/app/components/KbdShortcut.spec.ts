import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { KbdShortcut } from "./KbdShortcut";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(KbdShortcut);
  fixture.componentRef.setInput("keys", ["Ctrl", "K"]);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  const root = fixture.nativeElement.querySelector(".kbd-shortcut") as HTMLElement;
  return { fixture, root };
}

describe("KbdShortcut", () => {
  test("root is a <kbd> with the kbd-shortcut class first", () => {
    const { root } = make({ className: "extra" });
    expect(root.tagName).toBe("KBD");
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("renders one inner <kbd class=kbd-shortcut-key> per key, in order", () => {
    const { root } = make({ keys: ["Ctrl", "Shift", "P"] });
    const keys = Array.from(root.querySelectorAll("kbd.kbd-shortcut-key")).map((k) => k.textContent);
    expect(keys).toEqual(["Ctrl", "Shift", "P"]);
  });

  test("separators go between keys only, default +", () => {
    const { root } = make({ keys: ["Ctrl", "Shift", "P"] });
    const seps = root.querySelectorAll(".kbd-shortcut-separator");
    expect(seps).toHaveLength(2);
    expect(seps[0].textContent).toBe("+");
    expect(root.firstElementChild!.classList.contains("kbd-shortcut-key")).toBe(true);
    expect(root.lastElementChild!.classList.contains("kbd-shortcut-key")).toBe(true);
  });

  test("separator is configurable", () => {
    const { root } = make({ separator: "then" });
    expect(root.querySelector(".kbd-shortcut-separator")!.textContent).toBe("then");
  });

  test("separators are aria-hidden", () => {
    const { root } = make();
    expect(root.querySelector(".kbd-shortcut-separator")!.getAttribute("aria-hidden")).toBe("true");
  });

  test("single key renders no separator", () => {
    const { root } = make({ keys: ["Esc"] });
    expect(root.querySelectorAll(".kbd-shortcut-separator")).toHaveLength(0);
  });

  test("label becomes aria-label; absent otherwise", () => {
    expect(make({ label: "Control plus K" }).root.getAttribute("aria-label")).toBe("Control plus K");
    expect(make().root.hasAttribute("aria-label")).toBe(false);
  });
});
