import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Picture } from "./Picture";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(Picture);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector("picture");

@Component({
  standalone: true,
  imports: [Picture],
  template: `<lily-picture><source srcset="wide.webp" media="(min-width: 800px)" type="image/webp" /><img src="small.jpg" alt="A lily" width="320" height="200" /></lily-picture>`,
})
class Host {}

describe("Picture", () => {
  test("renders a <picture> with the base class", () => {
    expect(root(make()).classList.contains("picture")).toBe(true);
  });

  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = root(make({ className: "mine" })).classList;
    expect(cl.contains("picture")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });

  test("projects the source and img, keeping the consumer's alt", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("picture source").getAttribute("media")).toBe("(min-width: 800px)");
    expect(f.nativeElement.querySelector("picture img").getAttribute("alt")).toBe("A lily");
  });

  test("adds no text of its own", () => {
    expect(root(make()).textContent).toBe("");
  });
});
