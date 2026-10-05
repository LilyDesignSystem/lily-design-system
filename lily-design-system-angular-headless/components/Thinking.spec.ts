import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Thinking } from "./Thinking";

@Component({
  standalone: true,
  imports: [Thinking],
  template: `<lily-thinking label="Reasoning" className="extra" [streaming]="streaming" [(open)]="open"><p id="body">Step one</p></lily-thinking>`,
})
class Host {
  open = false;
  streaming = false;
}

function make(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host);
  Object.assign(fixture.componentInstance, init);
  fixture.detectChanges();
  const root = fixture.nativeElement.querySelector(".thinking") as HTMLDetailsElement;
  return { fixture, root };
}

describe("Thinking", () => {
  test("root is native <details> with the thinking class first", () => {
    const { root } = make();
    expect(root.tagName).toBe("DETAILS");
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("summary carries label and class", () => {
    const { root } = make();
    const s = root.querySelector("summary")!;
    expect(s.textContent).toBe("Reasoning");
    expect(s.classList.contains("thinking-summary")).toBe(true);
  });

  test("closed by default", () => {
    expect(make().root.open).toBe(false);
  });

  test("open input opens it", () => {
    expect(make({ open: true }).root.open).toBe(true);
  });

  test("children render inside .thinking-content", () => {
    const { root } = make();
    expect(root.querySelector(".thinking-content #body")).toBeTruthy();
  });

  test("toggling the details updates the bound open value", () => {
    const { fixture, root } = make();
    root.open = true;
    root.dispatchEvent(new Event("toggle"));
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(true);
  });

  test("streaming sets data-streaming and aria-busy", () => {
    const { root } = make({ streaming: true });
    expect(root.getAttribute("data-streaming")).toBe("true");
    expect(root.getAttribute("aria-busy")).toBe("true");
  });

  test("not streaming omits data-streaming and aria-busy", () => {
    const { root } = make();
    expect(root.hasAttribute("data-streaming")).toBe(false);
    expect(root.hasAttribute("aria-busy")).toBe(false);
  });
});
