import { Component, signal } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MultiSelectWithExtras } from "./MultiSelectWithExtras";
import { Option } from "./Option";

@Component({
  standalone: true,
  imports: [MultiSelectWithExtras, Option],
  template: `<lily-multi-select-with-extras
    label="Pick"
    className="extra"
    [size]="size()"
    [required]="required()"
    [disabled]="disabled()"
    [(value)]="value"
  >
    <span before data-testid="before">Before</span>
    <option lily-option value="a">Option A</option>
    <option lily-option value="b">Option B</option>
    <option lily-option value="c">Option C</option>
    <span after data-testid="after">After</span>
  </lily-multi-select-with-extras>`,
})
class Host {
  value = signal<string[]>([]);
  size = signal<number | undefined>(undefined);
  required = signal(false);
  disabled = signal(false);
}

function make(init: Partial<{ value: string[]; size: number; required: boolean; disabled: boolean }> = {}) {
  const fixture = TestBed.createComponent(Host);
  if (init.value) fixture.componentInstance.value.set(init.value);
  if (init.size) fixture.componentInstance.size.set(init.size);
  if (init.required) fixture.componentInstance.required.set(true);
  if (init.disabled) fixture.componentInstance.disabled.set(true);
  fixture.detectChanges();
  const root = fixture.nativeElement.querySelector(".multi-select-with-extras") as HTMLElement;
  const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
  return { fixture, root, select, host: fixture.componentInstance };
}

describe("MultiSelectWithExtras", () => {
  test("wrapper div carries the base class; select is multiple", () => {
    const { root, select } = make();
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("extra")).toBe(true);
    expect(select.multiple).toBe(true);
    expect(select.parentElement).toBe(root);
  });

  test("aria-label is on the select, not the wrapper", () => {
    const { root, select } = make();
    expect(select.getAttribute("aria-label")).toBe("Pick");
    expect(root.hasAttribute("aria-label")).toBe(false);
  });

  test("renders before and after content around the select in order", () => {
    const { root } = make();
    const kids = Array.from(root.children).map((c) => c.tagName === "SELECT" ? "select" : c.textContent!.trim());
    expect(kids).toEqual(["Before", "select", "After"]);
  });

  test("initial array value selects options", () => {
    const { select } = make({ value: ["b"] });
    expect(Array.from(select.selectedOptions).map((o) => o.value)).toEqual(["b"]);
  });

  test("multiple options can be selected and update the bound value", () => {
    const { fixture, select, host } = make();
    select.options[0].selected = true;
    select.options[2].selected = true;
    select.dispatchEvent(new Event("change"));
    fixture.detectChanges();
    expect(host.value()).toEqual(["a", "c"]);
  });

  test("size, required and disabled reach the select", () => {
    const { select } = make({ size: 3, required: true, disabled: true });
    expect(select.getAttribute("size")).toBe("3");
    expect(select.required).toBe(true);
    expect(select.disabled).toBe(true);
  });
});
