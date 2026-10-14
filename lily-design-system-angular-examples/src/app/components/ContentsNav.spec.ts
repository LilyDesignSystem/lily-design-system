import { Component, signal } from "@angular/core";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ContentsNav, activeSectionIndex } from "./ContentsNav";

describe("ContentsNav", () => {
  test("renders the nav root with the base class", () => {
    const fixture = TestBed.createComponent(ContentsNav);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("nav.contents-nav");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ContentsNav);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("nav.contents-nav");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

// =====================================================================
// Scrollspy (spy)
// =====================================================================

@Component({
  standalone: true,
  imports: [ContentsNav],
  template: `
    <lily-contents-nav
      label="Contents"
      [spy]="spy()"
      [offset]="offset()"
      [current]="current()"
      (activeChange)="changes.push($event)"
    >
      <ol>
        @for (id of ids(); track id) {
          <li><a [href]="'#' + id">{{ id }}</a></li>
        }
      </ol>
    </lily-contents-nav>
  `,
})
class Host {
  readonly spy = signal(true);
  readonly offset = signal(0);
  readonly current = signal("true");
  readonly ids = signal(["intro", "usage", "api"]);
  readonly changes: string[] = [];
}

/** Sections whose tops the test controls; jsdom has no layout. */
function sections(ids: string[]): Record<string, number> {
  const tops: Record<string, number> = {};
  // A tall page, so the viewport is not "at the bottom" unless a test says so.
  Object.defineProperty(document.documentElement, "scrollHeight", { value: 5000, configurable: true });
  for (const id of ids) {
    const el = document.createElement("section");
    el.id = id;
    tops[id] = 0;
    el.getBoundingClientRect = () =>
      ({ top: tops[id], bottom: tops[id] + 100, left: 0, right: 0, width: 0, height: 100, x: 0, y: tops[id], toJSON() {} }) as DOMRect;
    document.body.appendChild(el);
  }
  return tops;
}

let fixtures: ComponentFixture<unknown>[] = [];
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const settle = async () => {
  for (const f of fixtures) f.detectChanges();
  await frame();
  await frame();
  for (const f of fixtures) f.detectChanges();
};
const scroll = async (type = "scroll") => {
  window.dispatchEvent(new Event(type));
  await settle();
};
const activeLink = () => document.querySelector("a[aria-current]");

function mountHost(configure?: (h: Host) => void): ComponentFixture<Host> {
  const fixture = TestBed.createComponent(Host);
  configure?.(fixture.componentInstance);
  document.body.appendChild(fixture.nativeElement);
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

const IDS = ["intro", "usage", "api"];

describe("ContentsNav — activeSectionIndex (pure)", () => {
  test("the last section whose top has passed the line is current", () => {
    expect(activeSectionIndex([-300, -10, 400], 0, false)).toBe(1);
    expect(activeSectionIndex([-300, -10, 400], 500, false)).toBe(2);
  });
  test("before the first section, the first is current", () => {
    expect(activeSectionIndex([200, 600, 900], 0, false)).toBe(0);
  });
  test("at the bottom of the scroll range the last section is current", () => {
    expect(activeSectionIndex([-300, -10, 400], 0, true)).toBe(2);
  });
  test("no sections gives -1", () => {
    expect(activeSectionIndex([], 0, false)).toBe(-1);
  });
});

describe("ContentsNav — scrollspy", () => {
  afterEach(() => {
    for (const f of fixtures) f.destroy();
    fixtures = [];
    document.body.innerHTML = "";
    window.location.hash = "";
  });

  test("spy off: no link is marked", async () => {
    sections(IDS);
    mountHost((h) => h.spy.set(false));
    await settle();
    expect(activeLink()).toBeNull();
  });

  test("marks the link of the section in view with aria-current and data-active", async () => {
    const tops = sections(IDS);
    tops["intro"] = -400; tops["usage"] = -20; tops["api"] = 500;
    mountHost();
    await settle();
    expect(activeLink()!.textContent).toBe("usage");
    expect(activeLink()!.getAttribute("aria-current")).toBe("true");
    expect(activeLink()!.hasAttribute("data-active")).toBe(true);
    expect(document.querySelectorAll("a[aria-current]")).toHaveLength(1);
  });

  test("moves the mark when the reader scrolls, and back again", async () => {
    const tops = sections(IDS);
    tops["intro"] = 0; tops["usage"] = 300; tops["api"] = 600;
    mountHost();
    await settle();
    expect(activeLink()!.textContent).toBe("intro");
    tops["intro"] = -400; tops["usage"] = -100; tops["api"] = 200;
    await scroll();
    expect(activeLink()!.textContent).toBe("usage");
    tops["intro"] = 0; tops["usage"] = 300; tops["api"] = 600;
    await scroll();
    expect(activeLink()!.textContent).toBe("intro");
  });

  test("offset moves the activation line", async () => {
    const tops = sections(IDS);
    tops["intro"] = -400; tops["usage"] = 60; tops["api"] = 500;
    mountHost((h) => h.offset.set(80));
    await settle();
    expect(activeLink()!.textContent).toBe("usage");
  });

  test("current sets the aria-current token", async () => {
    sections(IDS);
    mountHost((h) => h.current.set("location"));
    await settle();
    expect(activeLink()!.getAttribute("aria-current")).toBe("location");
  });

  test("a click makes its link current at once and holds it while the scroll settles", async () => {
    const tops = sections(IDS);
    tops["intro"] = 0; tops["usage"] = 300; tops["api"] = 600;
    mountHost();
    await settle();
    (document.querySelector('a[href="#api"]') as HTMLElement).click();
    expect(activeLink()!.textContent).toBe("api");
    tops["intro"] = -100; tops["usage"] = 0; tops["api"] = 300;
    await scroll();
    expect(activeLink()!.textContent).toBe("api");
    await scroll("scrollend");
    expect(activeLink()!.textContent).toBe("usage");
  });

  test("activeChange fires once per change, with the section id", async () => {
    const tops = sections(IDS);
    tops["intro"] = 0; tops["usage"] = 300; tops["api"] = 600;
    const fixture = mountHost();
    await settle();
    await scroll();
    expect(fixture.componentInstance.changes).toEqual(["intro"]);
    tops["intro"] = -400; tops["usage"] = -100; tops["api"] = 200;
    await scroll();
    expect(fixture.componentInstance.changes).toEqual(["intro", "usage"]);
  });

  test("at the bottom of the page the last section is current even if it never reaches the line", async () => {
    const tops = sections(IDS);
    tops["intro"] = -900; tops["usage"] = -500; tops["api"] = 400;
    Object.defineProperty(document.documentElement, "scrollHeight", { value: window.innerHeight + 10, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 10, configurable: true });
    mountHost();
    await settle();
    expect(activeLink()!.textContent).toBe("api");
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  test("the URL hash wins on load", async () => {
    const tops = sections(IDS);
    tops["intro"] = 0; tops["usage"] = 300; tops["api"] = 600;
    window.location.hash = "#api";
    mountHost();
    await settle();
    expect(activeLink()!.textContent).toBe("api");
  });

  test("links with no matching element are ignored", async () => {
    const tops = sections(["intro"]);
    tops["intro"] = 0;
    mountHost((h) => h.ids.set(["intro", "missing"]));
    await settle();
    expect(activeLink()!.textContent).toBe("intro");
  });
});
