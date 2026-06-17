import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TextSizeSelect } from "./text-size-select.component";

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
  document.documentElement.removeAttribute("data-text-size");
}

function selectOption(select: HTMLSelectElement, value: string): void {
  select.value = value;
  select.dispatchEvent(new Event("change"));
}

beforeEach(() => {
  resetRoot();
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  resetRoot();
});

describe("TextSizeSelect — markup contract (§7.1)", () => {
  test("§7.1 renders a native <select> root", () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.text-size-select");
    expect(el).toBeTruthy();
    expect(el.tagName).toBe("SELECT");
  });

  test("§7.2 aria-label is the supplied label", () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Choose text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.text-size-select");
    expect(el.getAttribute("aria-label")).toBe("Choose text size");
  });

  test("§7.3 one option per size; the select carries the supplied name", () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.componentRef.setInput("name", "size");
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      "option",
    ) as NodeListOf<HTMLOptionElement>;
    expect(options.length).toBe(SIZES.length);
    const select = fixture.nativeElement.querySelector(
      "select.text-size-select",
    ) as HTMLSelectElement;
    expect(select.name).toBe("size");
  });

  test("§7.3 name defaults to text-size", () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector(
      "select.text-size-select",
    ) as HTMLSelectElement;
    expect(select.name).toBe("text-size");
  });

  test("§7.4 each option carries the size slug as its value", () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      "option",
    ) as NodeListOf<HTMLOptionElement>;
    expect(Array.from(options).map((o) => o.value)).toEqual(SIZES);
  });

  test("§7.5 default labels title-case the slug per hyphen-word", () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", ["small", "x-large"]);
    fixture.detectChanges();
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Small/);
    expect(text).toMatch(/X Large/);
  });

  test("§7.5 sizeLabels override the default labels", () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", ["small", "large"]);
    fixture.componentRef.setInput("sizeLabels", {
      small: "Compact",
      large: "Comfortable",
    });
    fixture.detectChanges();
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Compact/);
    expect(text).toMatch(/Comfortable/);
  });
});

describe("TextSizeSelect — initial value (§7.2)", () => {
  test("§7.6 initial value defaults to medium when present", async () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.getAttribute("data-text-size")).toBe(
      "medium",
    );
  });

  test("§7.6 initial value falls back to sizes[0] when medium absent", async () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", ["small", "large", "x-large"]);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.getAttribute("data-text-size")).toBe(
      "small",
    );
  });

  test("§7.7 applies data-text-size to document.documentElement", async () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.componentRef.setInput("defaultValue", "large");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.getAttribute("data-text-size")).toBe(
      "large",
    );
  });
});

describe("TextSizeSelect — size application (§7.3)", () => {
  test("§7.8 selecting an option updates data-text-size and emits sizeChange", async () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    const onChange = vi.fn();
    fixture.componentInstance.sizeChange.subscribe(onChange);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      "select.text-size-select",
    ) as HTMLSelectElement;
    selectOption(select, "x-large");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.getAttribute("data-text-size")).toBe(
      "x-large",
    );
    expect(onChange).toHaveBeenLastCalledWith("x-large");
  });

  test("§7.9 a custom target receives data-text-size", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.componentRef.setInput("defaultValue", "large");
    fixture.componentRef.setInput("target", target);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(target.getAttribute("data-text-size")).toBe("large");
    expect(document.documentElement.hasAttribute("data-text-size")).toBe(false);
    target.remove();
  });
});

describe("TextSizeSelect — initial-value resolution (§7.4)", () => {
  test("§7.10 persists to localStorage and reads back on a fresh mount", async () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.componentRef.setInput("storageKey", "lily-text-size");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      "select.text-size-select",
    ) as HTMLSelectElement;
    selectOption(select, "large");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(localStorage.getItem("lily-text-size")).toBe("large");
    fixture.destroy();
    resetRoot();

    const f2 = TestBed.createComponent(TextSizeSelect);
    f2.componentRef.setInput("label", "Text size");
    f2.componentRef.setInput("sizes", SIZES);
    f2.componentRef.setInput("storageKey", "lily-text-size");
    f2.detectChanges();
    await flush();
    f2.detectChanges();
    expect(document.documentElement.getAttribute("data-text-size")).toBe(
      "large",
    );
  });

  test("§7.11 a supplied non-empty value input wins over storage and defaults", async () => {
    localStorage.setItem("lily-text-size", "small");
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.componentRef.setInput("value", "large");
    fixture.componentRef.setInput("storageKey", "lily-text-size");
    fixture.componentRef.setInput("defaultValue", "x-large");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.getAttribute("data-text-size")).toBe(
      "large",
    );
  });
});

describe("TextSizeSelect — class hook (§7.5)", () => {
  test("§7.12 className is appended to the root select", () => {
    const fixture = TestBed.createComponent(TextSizeSelect);
    fixture.componentRef.setInput("label", "Text size");
    fixture.componentRef.setInput("sizes", SIZES);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.text-size-select");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
