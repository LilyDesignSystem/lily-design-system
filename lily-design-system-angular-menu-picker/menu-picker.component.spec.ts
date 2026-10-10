import { Component, viewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  MenuPicker,
  MenuPickerIcon,
  nextMenuPickerId,
} from "./menu-picker.component";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

@Component({
  standalone: true,
  imports: [MenuPicker, MenuPickerIcon],
  template: `
    <lily-menu-picker #menu label="Menu" [closeOnSelect]="closeOnSelect" [(open)]="isOpen" className="{{ extra }}" [attr.data-x]="'1'">
      <a href="/a/">Alpha</a>
      <button type="button" class="b">Beta</button>
      <div data-menu-picker-keep-open><button type="button" class="keep">Keep</button></div>
      <button type="button" class="closer" (click)="$event.stopPropagation(); menu.close()">Closer</button>
    </lily-menu-picker>
  `,
})
class Host {
  closeOnSelect = true;
  isOpen = false;
  extra = "";
  picker = viewChild.required(MenuPicker);
}

@Component({
  standalone: true,
  imports: [MenuPicker, MenuPickerIcon],
  template: `<lily-menu-picker label="Menu"><ng-template lilyMenuPickerIcon let-args><span class="mine">{{ args.open ? "-" : "+" }}</span></ng-template></lily-menu-picker>`,
})
class IconHost {}

@Component({
  standalone: true,
  imports: [MenuPicker],
  template: `<lily-menu-picker label="Menu" />`,
})
class EmptyHost {}

let fixtures: ComponentFixture<unknown>[] = [];

function mount(patch: Partial<Host> = {}): ComponentFixture<Host> {
  const fixture = TestBed.createComponent(Host);
  Object.assign(fixture.componentInstance, patch);
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

const q = <T extends Element>(f: ComponentFixture<unknown>, sel: string) =>
  f.nativeElement.querySelector(sel) as T;
const trigger = (f: ComponentFixture<unknown>) => q<HTMLButtonElement>(f, ".menu-picker-button");
const panel = (f: ComponentFixture<unknown>) => q<HTMLDivElement>(f, ".menu-picker-panel");

async function press(f: ComponentFixture<unknown>, target: HTMLElement, key: string): Promise<void> {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  f.detectChanges();
  await flush();
  f.detectChanges();
}

async function click(f: ComponentFixture<unknown>, target: HTMLElement): Promise<void> {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
  f.detectChanges();
  await flush();
  f.detectChanges();
}

afterEach(() => {
  for (const f of fixtures) f.destroy();
  fixtures = [];
});

describe("MenuPicker", () => {
  test("7.1 renders the root, button, tooltip and a hidden panel", () => {
    const f = mount();
    expect(q(f, "div.menu-picker")).toBeTruthy();
    expect(trigger(f)).toBeTruthy();
    expect(q(f, ".menu-picker-tooltip")).toBeTruthy();
    expect(panel(f).hasAttribute("hidden")).toBe(true);
  });

  test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
    const f = mount();
    expect(trigger(f).getAttribute("aria-label")).toBe("Menu");
    expect(trigger(f).getAttribute("aria-expanded")).toBe("false");
    expect(trigger(f).getAttribute("aria-controls")).toBe(panel(f).id);
  });

  test("7.3 the default icon is an aria-hidden svg; a projected template replaces it", () => {
    const f = mount();
    const svg = q<SVGElement>(f, "svg.menu-picker-icon");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    const hf = TestBed.createComponent(IconHost);
    hf.detectChanges();
    fixtures.push(hf);
    expect(hf.nativeElement.querySelector(".mine")).toBeTruthy();
    expect(hf.nativeElement.querySelector("svg.menu-picker-icon")).toBeNull();
  });

  test("7.4 the panel is a role=group named with label", () => {
    const f = mount();
    expect(panel(f).getAttribute("role")).toBe("group");
    expect(panel(f).getAttribute("aria-label")).toBe("Menu");
  });

  test("7.5 the app's content renders inside; with none the panel is empty", () => {
    const f = mount();
    expect(panel(f).querySelector("a")?.textContent).toBe("Alpha");
    const ef = TestBed.createComponent(EmptyHost);
    ef.detectChanges();
    fixtures.push(ef);
    expect(q<HTMLElement>(ef, ".menu-picker-panel").textContent?.trim()).toBe("");
  });

  test("7.6 click opens and leaves focus on the button", async () => {
    const f = mount();
    trigger(f).focus();
    await click(f, trigger(f));
    expect(panel(f).hasAttribute("hidden")).toBe(false);
    expect(trigger(f).getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(trigger(f));
  });

  test("7.7 a second click closes", async () => {
    const f = mount();
    await click(f, trigger(f));
    await click(f, trigger(f));
    expect(panel(f).hasAttribute("hidden")).toBe(true);
  });

  test("7.8 ArrowDown opens at the first focusable, ArrowUp at the last", async () => {
    const f = mount();
    await press(f, trigger(f), "ArrowDown");
    expect(panel(f).hasAttribute("hidden")).toBe(false);
    expect(document.activeElement).toBe(panel(f).querySelector("a"));
    const g = mount();
    await press(g, trigger(g), "ArrowUp");
    expect(document.activeElement).toBe(panel(g).querySelector(".closer"));
  });

  test("7.9 Escape closes and returns focus to the button", async () => {
    const f = mount();
    await press(f, trigger(f), "ArrowDown");
    await press(f, panel(f), "Escape");
    expect(panel(f).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(trigger(f));
  });

  test("7.10 Tab closes without sending focus to the document top", async () => {
    const f = mount();
    await press(f, trigger(f), "ArrowDown");
    await press(f, panel(f), "Tab");
    expect(panel(f).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(trigger(f));
  });

  test("7.11 clicking outside closes", async () => {
    const f = mount();
    await click(f, trigger(f));
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    f.detectChanges();
    await flush();
    f.detectChanges();
    expect(panel(f).hasAttribute("hidden")).toBe(true);
  });

  test("7.12 focus leaving the picker closes", async () => {
    const f = mount();
    await click(f, trigger(f));
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    q(f, "div.menu-picker").dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }));
    f.detectChanges();
    expect(panel(f).hasAttribute("hidden")).toBe(true);
    outside.remove();
  });

  test("7.13 activating a link or button closes; keep-open and closeOnSelect=false do not", async () => {
    const f = mount();
    await click(f, trigger(f));
    panel(f).querySelector("a")!.addEventListener("click", (e) => e.preventDefault());
    await click(f, panel(f).querySelector("a")!);
    expect(panel(f).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(trigger(f));
    await click(f, trigger(f));
    await click(f, panel(f).querySelector(".b")!);
    expect(panel(f).hasAttribute("hidden")).toBe(true);
    await click(f, trigger(f));
    await click(f, panel(f).querySelector(".keep")!);
    expect(panel(f).hasAttribute("hidden")).toBe(false);
    const g = mount({ closeOnSelect: false });
    await click(g, trigger(g));
    await click(g, panel(g).querySelector(".b")!);
    expect(panel(g).hasAttribute("hidden")).toBe(false);
  });

  test("7.14 the content can call close()", async () => {
    const f = mount({ closeOnSelect: false });
    await click(f, trigger(f));
    await click(f, panel(f).querySelector(".closer")!);
    expect(panel(f).hasAttribute("hidden")).toBe(true);
  });

  test("7.15 [(open)] updates once per actual change", async () => {
    const f = mount();
    await click(f, trigger(f));
    expect(f.componentInstance.isOpen).toBe(true);
    await click(f, trigger(f));
    expect(f.componentInstance.isOpen).toBe(false);
    const g = mount({ isOpen: true });
    expect(panel(g).hasAttribute("hidden")).toBe(false);
  });

  test("7.16 the tooltip is a hidden role=tooltip holding the label", () => {
    const f = mount();
    const tip = q<HTMLElement>(f, ".menu-picker-tooltip");
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.textContent).toBe("Menu");
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("7.17 the tooltip shows on hover, hides on Escape, and never shows while open", async () => {
    const f = mount();
    const tip = q<HTMLElement>(f, ".menu-picker-tooltip");
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
    await click(f, trigger(f));
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("7.18 the tooltip is not wired with aria-describedby", () => {
    const f = mount();
    expect(trigger(f).hasAttribute("aria-describedby")).toBe(false);
  });

  test("7.19 className is appended to the root", () => {
    const f = mount({ extra: "extra" });
    expect(q(f, "div.menu-picker").classList.contains("extra")).toBe(true);
  });

  test("7.20 two instances get distinct ids", () => {
    expect(nextMenuPickerId()).not.toBe(nextMenuPickerId());
    const a = mount();
    const b = mount();
    expect(panel(a).id).not.toBe(panel(b).id);
  });

  test("7.21 the source ships no stylesheet, inline style or English default", () => {
    const src = readFileSync(resolve(__dirname, "menu-picker.component.ts"), "utf8")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    expect(src).not.toMatch(/styles:|\sstyle=/);
    expect(src).not.toMatch(/(label|href):\s*["'`]/);
  });
});
