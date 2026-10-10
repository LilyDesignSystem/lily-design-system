import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  LinkPicker,
  LinkPickerIcon,
  linkId,
  nextLinkPickerId,
  type LinkItem,
} from "./link-picker.component";

const LINKS: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

let fixtures: ComponentFixture<unknown>[] = [];

function mount(inputs: Record<string, unknown> = {}): ComponentFixture<LinkPicker> {
  const fixture = TestBed.createComponent(LinkPicker);
  fixture.componentRef.setInput("label", "Pages");
  fixture.componentRef.setInput("links", LINKS);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

const q = <T extends Element>(f: ComponentFixture<unknown>, sel: string) =>
  f.nativeElement.querySelector(sel) as T;
const trigger = (f: ComponentFixture<unknown>) => q<HTMLButtonElement>(f, ".link-picker-button");
const list = (f: ComponentFixture<unknown>) => q<HTMLUListElement>(f, ".link-picker-list");
const links = (f: ComponentFixture<unknown>) =>
  Array.from(f.nativeElement.querySelectorAll(".link-picker-link")) as HTMLAnchorElement[];

function press(f: ComponentFixture<unknown>, target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  f.detectChanges();
}

async function open(f: ComponentFixture<unknown>): Promise<void> {
  trigger(f).dispatchEvent(new MouseEvent("click", { bubbles: true }));
  f.detectChanges();
  await flush();
  f.detectChanges();
}

afterEach(() => {
  for (const f of fixtures) f.destroy();
  fixtures = [];
});

describe("LinkPicker", () => {
  test("7.1 renders the root, button, tooltip and a hidden list", () => {
    const f = mount();
    expect(q(f, "div.link-picker")).toBeTruthy();
    expect(trigger(f)).toBeTruthy();
    expect(q(f, ".link-picker-tooltip")).toBeTruthy();
    expect(list(f).hasAttribute("hidden")).toBe(true);
  });

  test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
    const f = mount();
    expect(trigger(f).getAttribute("aria-label")).toBe("Pages");
    expect(trigger(f).getAttribute("aria-expanded")).toBe("false");
    expect(trigger(f).getAttribute("aria-controls")).toBe(list(f).id);
  });

  test("7.3 the default icon is an aria-hidden svg; a projected template replaces it", () => {
    const f = mount();
    const svg = q<SVGElement>(f, "svg.link-picker-icon");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");

    @Component({
      standalone: true,
      imports: [LinkPicker, LinkPickerIcon],
      template: `<lily-link-picker label="Pages" [links]="links"><ng-template lilyLinkPickerIcon let-args><span class="mine">{{ args.open ? "-" : "+" }}</span></ng-template></lily-link-picker>`,
    })
    class Host {
      links = LINKS;
    }
    const hf = TestBed.createComponent(Host);
    hf.detectChanges();
    fixtures.push(hf);
    expect(hf.nativeElement.querySelector(".mine")).toBeTruthy();
    expect(hf.nativeElement.querySelector("svg.link-picker-icon")).toBeNull();
  });

  test("7.4 one real link per entry, in order", () => {
    expect(links(mount()).map((a) => [a.textContent?.trim(), a.getAttribute("href")])).toEqual([
      ["Home", "/"],
      ["About Us", "/about/"],
      ["Contact Us", "/contact/"],
      ["Privacy Policy", "/privacy/"],
    ]);
  });

  test("7.5 no links are invented", () => {
    expect(links(mount({ links: [] }))).toHaveLength(0);
  });

  test("7.6 the list is named with label", () => {
    expect(list(mount()).getAttribute("aria-label")).toBe("Pages");
  });

  test("7.7 click opens the list and focuses the first link", async () => {
    const f = mount();
    await open(f);
    expect(list(f).hasAttribute("hidden")).toBe(false);
    expect(trigger(f).getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(links(f)[0]);
  });

  test("7.8 a second click closes", async () => {
    const f = mount();
    await open(f);
    await open(f);
    expect(list(f).hasAttribute("hidden")).toBe(true);
  });

  test("7.9 ArrowDown opens at the first link, ArrowUp at the last", async () => {
    const a = mount();
    press(a, trigger(a), "ArrowDown");
    await flush();
    expect(document.activeElement).toBe(links(a)[0]);
    const b = mount();
    press(b, trigger(b), "ArrowUp");
    await flush();
    expect(document.activeElement).toBe(links(b)[3]);
  });

  test("7.10 arrows move and clamp; Home and End jump", async () => {
    const f = mount();
    await open(f);
    press(f, list(f), "ArrowUp");
    expect(document.activeElement).toBe(links(f)[0]);
    press(f, list(f), "ArrowDown");
    expect(document.activeElement).toBe(links(f)[1]);
    press(f, list(f), "End");
    expect(document.activeElement).toBe(links(f)[3]);
    press(f, list(f), "ArrowDown");
    expect(document.activeElement).toBe(links(f)[3]);
    press(f, list(f), "Home");
    expect(document.activeElement).toBe(links(f)[0]);
  });

  test("7.11 Escape closes and returns focus to the button", async () => {
    const f = mount();
    await open(f);
    press(f, list(f), "Escape");
    await flush();
    f.detectChanges();
    expect(list(f).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(trigger(f));
  });

  test("7.12 Tab closes without sending focus to the document top", async () => {
    const f = mount();
    await open(f);
    press(f, list(f), "Tab");
    await flush();
    expect(list(f).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(trigger(f));
  });

  test("7.13 clicking outside closes", async () => {
    const f = mount();
    await open(f);
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    f.detectChanges();
    expect(list(f).hasAttribute("hidden")).toBe(true);
  });

  test("7.14 current marks only that link aria-current=page", () => {
    const f = mount({ links: [LINKS[0], { ...LINKS[1], current: true }, LINKS[2]] });
    expect(links(f).map((a) => a.getAttribute("aria-current"))).toEqual([null, "page", null]);
  });

  test("7.15 newTab adds target and rel", () => {
    const f = mount({ links: [{ label: "Docs", href: "https://example.test/", newTab: true }, LINKS[0]] });
    expect(links(f)[0].getAttribute("target")).toBe("_blank");
    expect(links(f)[0].getAttribute("rel")).toBe("noopener noreferrer");
    expect(links(f)[1].hasAttribute("target")).toBe(false);
  });

  test("7.16 the navigated output reports the id, else the href", async () => {
    const f = mount({ links: [{ id: "about", label: "About Us", href: "/about/" }, LINKS[0]] });
    const seen: unknown[] = [];
    f.componentInstance.navigated.subscribe((e) => seen.push(e));
    await open(f);
    for (const a of links(f)) a.addEventListener("click", (e) => e.preventDefault());
    links(f)[0].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    f.detectChanges();
    await open(f);
    links(f)[1].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    expect(seen).toEqual([{ id: "about", href: "/about/" }, { id: "/", href: "/" }]);
    expect(linkId({ label: "x", href: "/y" })).toBe("/y");
  });

  test("7.17 navigate handles a plain left click only", async () => {
    const navigate = vi.fn();
    const f = mount({ navigate, links: [LINKS[1], { label: "Docs", href: "https://example.test/", newTab: true }] });
    await open(f);
    const plain = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    links(f)[0].dispatchEvent(plain);
    expect(navigate).toHaveBeenCalledWith("/about/");
    expect(plain.defaultPrevented).toBe(true);
    navigate.mockClear();
    f.detectChanges();
    await open(f);
    const ctrl = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ctrlKey: true });
    links(f)[0].dispatchEvent(ctrl);
    expect(navigate).not.toHaveBeenCalled();
    expect(ctrl.defaultPrevented).toBe(false);
    f.detectChanges();
    await open(f);
    const tab = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    links(f)[1].dispatchEvent(tab);
    expect(navigate).not.toHaveBeenCalled();
    expect(tab.defaultPrevented).toBe(false);
  });

  test("7.18 without navigate a click is left to the browser", async () => {
    const f = mount();
    await open(f);
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    links(f)[0].dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
  });

  test("7.19 the tooltip is a hidden role=tooltip holding the label", () => {
    const tip = q<HTMLElement>(mount(), ".link-picker-tooltip");
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.textContent).toBe("Pages");
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("7.20 the tooltip shows on hover, hides on Escape, and never shows while open", async () => {
    const f = mount();
    const tip = q<HTMLElement>(f, ".link-picker-tooltip");
    const host = q<HTMLElement>(f, "lily-icon-button");
    host.dispatchEvent(new MouseEvent("mouseenter"));
    f.detectChanges();
    expect(tip.hasAttribute("hidden")).toBe(false);
    await flush();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    f.detectChanges();
    expect(tip.hasAttribute("hidden")).toBe(true);
    host.dispatchEvent(new MouseEvent("mouseleave"));
    host.dispatchEvent(new MouseEvent("mouseenter"));
    f.detectChanges();
    expect(tip.hasAttribute("hidden")).toBe(false);
    await open(f);
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("7.21 the tooltip is not wired with aria-describedby", () => {
    expect(trigger(mount()).hasAttribute("aria-describedby")).toBe(false);
  });

  test("7.22 className is appended to the root", () => {
    expect(q(mount({ className: "extra" }), ".link-picker").classList.contains("extra")).toBe(true);
  });

  test("7.23 two instances get distinct ids", () => {
    expect(nextLinkPickerId()).not.toBe(nextLinkPickerId());
    expect(list(mount()).id).not.toBe(list(mount()).id);
  });

  test("7.24 the source ships no stylesheet, inline style, English default or route", () => {
    const src = readFileSync(resolve(__dirname, "link-picker.component.ts"), "utf8")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    expect(src).not.toMatch(/styles\s*:|<style|\sstyle=/);
    expect(src).not.toMatch(/(label|href):\s*["'`]/);
    expect(src).not.toMatch(/href="\//);
  });
});
