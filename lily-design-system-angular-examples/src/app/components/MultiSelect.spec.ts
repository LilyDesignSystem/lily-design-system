import { Component, signal } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MultiSelect } from "./MultiSelect";
import { Option } from "./Option";

@Component({
  standalone: true,
  imports: [MultiSelect, Option],
  template: `<lily-multi-select
    label="Pick"
    className="extra"
    [size]="size()"
    [required]="required()"
    [disabled]="disabled()"
    [(value)]="value"
  >
    <option lily-option value="a">Option A</option>
    <option lily-option value="b">Option B</option>
    <option lily-option value="c">Option C</option>
  </lily-multi-select>`,
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
  const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
  return { fixture, select, host: fixture.componentInstance };
}

describe("MultiSelect", () => {
  test("renders a native <select multiple> with the base class", () => {
    const { select } = make();
    expect(select.tagName).toBe("SELECT");
    expect(select.multiple).toBe(true);
    expect(select.classList.contains("multi-select")).toBe(true);
    expect(select.classList.contains("extra")).toBe(true);
    expect(select.getAttribute("aria-label")).toBe("Pick");
  });

  test("renders option children", () => {
    expect(make().select.options).toHaveLength(3);
  });

  test("initial value array selects the matching options", () => {
    const { select } = make({ value: ["a", "c"] });
    expect(Array.from(select.selectedOptions).map((o) => o.value)).toEqual(["a", "c"]);
  });

  test("selecting several options updates the bound value", () => {
    const { fixture, select, host } = make();
    select.options[0].selected = true;
    select.options[1].selected = true;
    select.dispatchEvent(new Event("change"));
    fixture.detectChanges();
    expect(host.value()).toEqual(["a", "b"]);
  });

  test("changing the bound value updates the selection", () => {
    const { fixture, select, host } = make({ value: ["a"] });
    host.value.set(["b", "c"]);
    fixture.detectChanges();
    expect(Array.from(select.selectedOptions).map((o) => o.value)).toEqual(["b", "c"]);
  });

  test("size sets the visible rows", () => {
    expect(make({ size: 4 }).select.getAttribute("size")).toBe("4");
  });

  test("supports required and disabled", () => {
    const { select } = make({ required: true, disabled: true });
    expect(select.required).toBe(true);
    expect(select.disabled).toBe(true);
  });
});
