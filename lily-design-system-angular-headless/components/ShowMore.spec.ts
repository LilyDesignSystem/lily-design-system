import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ShowMore } from "./ShowMore";

@Component({
  standalone: true,
  imports: [ShowMore],
  template: `<lily-show-more moreLabel="Show more" lessLabel="Show less" className="extra" [(expanded)]="open"><p id="body">Long text</p></lily-show-more>`,
})
class Host {
  open = false;
}

function make() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const q = <T extends HTMLElement>(s: string) => fixture.nativeElement.querySelector(s) as T;
  return { fixture, q };
}

describe("ShowMore", () => {
  test("root is a div with the show-more class first", () => {
    const { q } = make();
    const root = q(".show-more");
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("collapsed by default: moreLabel, aria-expanded=false, data-expanded=false", () => {
    const { q } = make();
    const button = q(".show-more-button");
    expect(button.textContent!.trim()).toBe("Show more");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(q(".show-more-content").getAttribute("data-expanded")).toBe("false");
  });

  test("content stays in the DOM and is not hidden while collapsed", () => {
    const { q } = make();
    expect(q("#body")).toBeTruthy();
    expect(q(".show-more-content").hasAttribute("hidden")).toBe(false);
    expect(q(".show-more-content").getAttribute("aria-hidden")).toBeNull();
  });

  test("clicking expands: lessLabel, aria-expanded=true, data-expanded=true", () => {
    const { fixture, q } = make();
    q(".show-more-button").click();
    fixture.detectChanges();
    expect(q(".show-more-button").textContent!.trim()).toBe("Show less");
    expect(q(".show-more-button").getAttribute("aria-expanded")).toBe("true");
    expect(q(".show-more-content").getAttribute("data-expanded")).toBe("true");
    expect(fixture.componentInstance.open).toBe(true);
  });

  test("clicking again collapses", () => {
    const { fixture, q } = make();
    q(".show-more-button").click();
    fixture.detectChanges();
    q(".show-more-button").click();
    fixture.detectChanges();
    expect(q(".show-more-button").getAttribute("aria-expanded")).toBe("false");
    expect(q(".show-more-button").textContent!.trim()).toBe("Show more");
  });

  test("aria-controls points at the content element id", () => {
    const { q } = make();
    const id = q(".show-more-button").getAttribute("aria-controls")!;
    expect(id).toBeTruthy();
    expect(q(".show-more-content").id).toBe(id);
  });

  test("content has no inline style", () => {
    const { q } = make();
    expect(q(".show-more-content").hasAttribute("style")).toBe(false);
  });

  test("button is a native type=button with the show-more-button class", () => {
    const { q } = make();
    const b = q(".show-more-button");
    expect(b.tagName).toBe("BUTTON");
    expect(b.getAttribute("type")).toBe("button");
  });
});
