import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  TextSizeSelect,
  TextSizeSelectIcon,
  LATIN_CAPITAL_LETTER_A,
  nextTextSizeSelectId,
  sizeName,
} from "./text-size-select.component";

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
  document.documentElement.removeAttribute("data-text-size");
}

/** Fixtures created by a test, destroyed after it so listeners unwind. */
let fixtures: ComponentFixture<unknown>[] = [];

/** Create + render a TextSizeSelect with the supplied inputs. */
function mount(inputs: Record<string, unknown> = {}): ComponentFixture<TextSizeSelect> {
  const fixture = TestBed.createComponent(TextSizeSelect);
  fixture.componentRef.setInput("label", "Text size");
  fixture.componentRef.setInput("sizes", SIZES);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

/** Mount, let the initial-value effect settle, and re-render. */
async function mountSettled(
  inputs: Record<string, unknown> = {},
): Promise<ComponentFixture<TextSizeSelect>> {
  const fixture = mount(inputs);
  await flush();
  fixture.detectChanges();
  return fixture;
}

function q<T extends Element>(fixture: ComponentFixture<unknown>, sel: string): T {
  return fixture.nativeElement.querySelector(sel) as T;
}

function button(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return q<HTMLButtonElement>(fixture, ".text-size-select-button");
}

function list(fixture: ComponentFixture<unknown>): HTMLUListElement {
  return q<HTMLUListElement>(fixture, ".text-size-select-list");
}

function options(fixture: ComponentFixture<unknown>): HTMLLIElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".text-size-select-option"),
  ) as HTMLLIElement[];
}

/** Dispatch a bubbling keydown and re-render. */
function press(
  fixture: ComponentFixture<unknown>,
  target: HTMLElement,
  key: string,
): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  fixture.detectChanges();
}

/** Click an element and re-render. */
function click(fixture: ComponentFixture<unknown>, target: HTMLElement): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  fixture.detectChanges();
}

/** Open the listbox and click the option for `slug`. */
async function pick(
  fixture: ComponentFixture<unknown>,
  slug: string,
  sizes: string[] = SIZES,
): Promise<void> {
  click(fixture, button(fixture));
  click(fixture, options(fixture)[sizes.indexOf(slug)]);
  await flush();
  fixture.detectChanges();
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
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
  resetRoot();
});

describe("TextSizeSelect — markup contract (§4.2, §7.1–§7.5)", () => {
  test("§7.1 renders a button that controls a listbox", () => {
    const fixture = mount();
    const btn = button(fixture);
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    const listId = btn.getAttribute("aria-controls");
    expect(listId).toBeTruthy();
    expect(list(fixture).id).toBe(listId);
    expect(list(fixture).getAttribute("role")).toBe("listbox");
  });

  test("§7.1 the root is a div carrying the class hook", () => {
    const fixture = mount({ className: "extra" });
    const root = q<HTMLElement>(fixture, ".text-size-select");
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("text-size-select")).toBe(true);
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("§7.1 the button renders 'A', hidden from assistive tech", () => {
    const fixture = mount();
    const icon = q<HTMLElement>(fixture, ".text-size-select-icon");
    // U+0041 LATIN CAPITAL LETTER A — an in-font letter, not a
    // pictograph, so it never falls back to a bitmap glyph.
    expect(icon.textContent).toBe("A");
    expect(LATIN_CAPITAL_LETTER_A).toBe("A");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("§7.2 aria-label names the button and the listbox", () => {
    const fixture = mount({ label: "Choose text size" });
    expect(button(fixture).getAttribute("aria-label")).toBe("Choose text size");
    expect(list(fixture).getAttribute("aria-label")).toBe("Choose text size");
  });

  test("§7.3 one option per size; the hidden input carries the supplied name", async () => {
    const fixture = await mountSettled({ name: "scale" });
    expect(options(fixture).length).toBe(SIZES.length);
    const hidden = q<HTMLInputElement>(fixture, 'input[type="hidden"]');
    expect(hidden.name).toBe("scale");
    expect(hidden.value).toBe("medium");
  });

  test("§7.3 name defaults to text-size", async () => {
    const fixture = await mountSettled();
    expect(q<HTMLInputElement>(fixture, 'input[type="hidden"]').name).toBe("text-size");
  });

  test("§7.3 option ids are unique per instance", () => {
    const a = mount();
    const b = mount();
    const idsA = options(a).map((o) => o.id);
    const idsB = options(b).map((o) => o.id);
    expect(new Set([...idsA, ...idsB]).size).toBe(idsA.length + idsB.length);
    expect(idsA.every((id) => id.length > 0)).toBe(true);
  });

  test("§7.3 nextTextSizeSelectId is a monotonic counter, not random", () => {
    const first = nextTextSizeSelectId();
    const second = nextTextSizeSelectId();
    expect(first).toMatch(/^text-size-select-\d+$/);
    expect(second).not.toBe(first);
  });

  test("§7.4 the listbox is hidden until the button is activated", () => {
    const fixture = mount();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    click(fixture, button(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    expect(button(fixture).getAttribute("aria-expanded")).toBe("true");
  });

  test("§7.4 clicking the button again closes the listbox", () => {
    const fixture = mount();
    click(fixture, button(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    click(fixture, button(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.4 the active size is the aria-selected option", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture));
    const selected = fixture.nativeElement.querySelectorAll(
      '[role="option"][aria-selected="true"]',
    ) as NodeListOf<HTMLElement>;
    expect(selected.length).toBe(1);
    expect(selected[0].textContent?.trim()).toBe("Medium");
  });

  test("§7.4 the active option carries data-active while open", () => {
    const fixture = mount();
    click(fixture, button(fixture));
    const active = fixture.nativeElement.querySelectorAll(
      ".text-size-select-option[data-active]",
    ) as NodeListOf<HTMLElement>;
    expect(active.length).toBe(1);
  });

  test("§7.4 aria-activedescendant is absent while the listbox is closed", () => {
    const fixture = mount();
    expect(list(fixture).hasAttribute("aria-activedescendant")).toBe(false);
  });

  test("§7.5 default labels title-case the slug", () => {
    const fixture = mount({ sizes: ["small", "x-large"] });
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Small/);
    expect(text).toMatch(/X Large/);
  });

  test("§7.5 sizeLabels override the default title-case label", () => {
    const fixture = mount({
      sizes: ["small", "large"],
      sizeLabels: { small: "Compact", large: "Comfortable" },
    });
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Compact/);
    expect(text).toMatch(/Comfortable/);
  });
});

describe("TextSizeSelect — keyboard contract (APG listbox, §7.14–§7.18)", () => {
  async function openWith(key: string): Promise<ComponentFixture<TextSizeSelect>> {
    const fixture = await mountSettled();
    press(fixture, button(fixture), key);
    await flush();
    fixture.detectChanges();
    return fixture;
  }

  test("§7.14 ArrowDown, Enter and Space all open the listbox", async () => {
    for (const key of ["ArrowDown", "Enter", " "]) {
      const fixture = await openWith(key);
      expect(list(fixture).hasAttribute("hidden")).toBe(false);
      expect(button(fixture).getAttribute("aria-expanded")).toBe("true");
    }
  });

  test("§7.14 opening puts the active descendant on the selected size", async () => {
    const fixture = await openWith("ArrowDown");
    // "medium" resolves as the initial size, so it is index 1.
    expect(list(fixture).getAttribute("aria-activedescendant")).toBe(
      list(fixture).children[1].id,
    );
  });

  test("§7.14 ArrowUp opens with the last option active", async () => {
    const fixture = await openWith("ArrowUp");
    expect(list(fixture).getAttribute("aria-activedescendant")).toBe(
      list(fixture).children[SIZES.length - 1].id,
    );
  });

  test("§7.14 opening moves focus to the listbox", async () => {
    const fixture = await openWith("ArrowDown");
    expect(document.activeElement).toBe(list(fixture));
  });

  test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
    press(fixture, ul, "ArrowDown");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
    // Clamps at the top rather than wrapping.
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
  });

  test("§7.15 ArrowDown clamps at the last option", async () => {
    const fixture = await openWith("ArrowUp");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    expect(ul.getAttribute("aria-activedescendant")).toBe(
      ul.children[SIZES.length - 1].id,
    );
  });

  test("§7.15 Home and End jump to the first and last option", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    expect(ul.getAttribute("aria-activedescendant")).toBe(
      ul.children[SIZES.length - 1].id,
    );
    press(fixture, ul, "Home");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
  });

  test("§7.16 Enter selects the active option, applies it, and closes", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    press(fixture, ul, "Enter");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(button(fixture).getAttribute("aria-expanded")).toBe("false");
    expect(document.documentElement.dataset["textSize"]).toBe("large");
  });

  test("§7.16 Enter returns focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    press(fixture, list(fixture), "Enter");
    await flush();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.16 Space selects the active option and closes", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    press(fixture, ul, " ");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset["textSize"]).toBe("x-large");
  });

  test("§7.17 Escape closes without changing the size", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    press(fixture, ul, "Escape");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset["textSize"]).toBe("medium");
  });

  test("§7.17 Escape returns focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    press(fixture, list(fixture), "Escape");
    await flush();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.17 Tab closes without stealing focus back to the button", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "Tab");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    // Focus is left where it was for the browser's own Tab handling to
    // move it on; the component must not pull it back to the button.
    expect(document.activeElement).not.toBe(button(fixture));
    expect(document.activeElement).toBe(ul);
  });

  test("§7.18 typeahead moves the active descendant by label prefix", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "l");
    // "Large" is index 2 in SIZES.
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
  });

  test("§7.18 typeahead matches the rendered label, not the slug", async () => {
    const fixture = await mountSettled({
      sizeLabels: { "x-large": "Huge" },
    });
    press(fixture, button(fixture), "ArrowDown");
    await flush();
    fixture.detectChanges();
    const ul = list(fixture);
    press(fixture, ul, "h");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[3].id);
  });

  test("§7.18 the typeahead buffer resets after the 500 ms pause", async () => {
    vi.useFakeTimers();
    try {
      const fixture = mount();
      press(fixture, button(fixture), "ArrowDown");
      const ul = list(fixture);
      press(fixture, ul, "l");
      expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
      // Without a reset, "l" + "x" would match nothing; after the pause
      // the buffer is empty so "x" alone matches "X Large".
      vi.advanceTimersByTime(600);
      press(fixture, ul, "x");
      expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[3].id);
    } finally {
      vi.useRealTimers();
    }
  });

  test("§7.18 clicking an option selects and applies it", async () => {
    const fixture = await mountSettled();
    await pick(fixture, "x-large");
    expect(document.documentElement.dataset["textSize"]).toBe("x-large");
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.18 clicking outside the root closes the listbox", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });
});

describe("TextSizeSelect — size application (§5, §7.6–§7.11)", () => {
  test("§7.6 default initial value is 'medium' when present in sizes", async () => {
    await mountSettled();
    expect(document.documentElement.dataset["textSize"]).toBe("medium");
  });

  test("§7.6 default initial value falls back to sizes[0] when 'medium' is absent", async () => {
    await mountSettled({ sizes: ["small", "large", "x-large"] });
    expect(document.documentElement.dataset["textSize"]).toBe("small");
  });

  test("§7.7 sets data-text-size on documentElement", async () => {
    await mountSettled({ defaultValue: "large" });
    expect(document.documentElement.getAttribute("data-text-size")).toBe("large");
  });

  test("§7.8 selecting an option updates data-text-size and emits sizeChange", async () => {
    const fixture = await mountSettled();
    const onChange = vi.fn();
    fixture.componentInstance.sizeChange.subscribe(onChange);
    await pick(fixture, "x-large");
    expect(document.documentElement.dataset["textSize"]).toBe("x-large");
    expect(onChange).toHaveBeenCalledWith("x-large");
  });

  test("§7.8 the hidden input tracks the selected value", async () => {
    const fixture = await mountSettled();
    await pick(fixture, "large");
    expect(q<HTMLInputElement>(fixture, 'input[type="hidden"]').value).toBe("large");
  });

  test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
    const fixture = await mountSettled({ storageKey: "lily-text-size" });
    await pick(fixture, "large");
    expect(localStorage.getItem("lily-text-size")).toBe("large");
    fixture.destroy();
    resetRoot();

    await mountSettled({ storageKey: "lily-text-size" });
    expect(document.documentElement.dataset["textSize"]).toBe("large");
  });

  test("§7.10 a supplied value input wins over storage and defaults", async () => {
    localStorage.setItem("lily-text-size", "small");
    await mountSettled({
      value: "large",
      storageKey: "lily-text-size",
      defaultValue: "x-large",
    });
    expect(document.documentElement.dataset["textSize"]).toBe("large");
  });

  test("§7.10 defaultValue wins over the 'medium' fallback", async () => {
    await mountSettled({ defaultValue: "x-large" });
    expect(document.documentElement.dataset["textSize"]).toBe("x-large");
  });

  test("§7.11 a custom target receives data-text-size", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    await mountSettled({ target, defaultValue: "large" });
    expect(target.getAttribute("data-text-size")).toBe("large");
    expect(document.documentElement.hasAttribute("data-text-size")).toBe(false);
    target.remove();
  });
});

@Component({
  standalone: true,
  imports: [TextSizeSelect, TextSizeSelectIcon],
  template: `
    <lily-text-size-select label="Text size" [sizes]="sizes" [value]="'large'">
      <ng-template lilyTextSizeSelectIcon let-args>
        <span
          data-testid="custom"
          [attr.data-open]="args.open"
          [attr.data-value]="args.value"
          [attr.data-label-x-large]="args.labelFor('x-large')"
          >custom glyph</span
        >
      </ng-template>
    </lily-text-size-select>
  `,
})
class IconTemplateHost {
  readonly sizes = SIZES;
}

describe("TextSizeSelect — custom icon template (§7.12–§7.13)", () => {
  test("§7.12 className is appended to the root div", () => {
    const fixture = mount({ className: "extra" });
    expect(
      q<HTMLElement>(fixture, ".text-size-select").classList.contains("extra"),
    ).toBe(true);
  });

  test("§7.13 a projected ng-template replaces the glyph and receives ChildArgs", async () => {
    const fixture = TestBed.createComponent(IconTemplateHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    await flush();
    fixture.detectChanges();

    const custom = q<HTMLElement>(fixture, '[data-testid="custom"]');
    expect(custom).toBeTruthy();
    // The custom glyph replaces the default "A" inside the button.
    expect(custom.closest("button")?.className).toContain("text-size-select-button");
    expect(fixture.nativeElement.querySelector(".text-size-select-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-value")).toBe("large");
    expect(custom.getAttribute("data-label-x-large")).toBe("X Large");
  });
});

describe("TextSizeSelect — sizeName (§7.19)", () => {
  test("sizeName title-cases each hyphen-separated word", () => {
    expect(sizeName("small")).toBe("Small");
    expect(sizeName("x-large")).toBe("X Large");
  });

  test("sizeName handles a long multi-word slug", () => {
    expect(sizeName("extra-extra-large-print")).toBe("Extra Extra Large Print");
  });

  test("labelFor delegates to sizeName so there is one implementation", async () => {
    const fixture = await mountSettled();
    expect(fixture.componentInstance.labelFor("x-large")).toBe(sizeName("x-large"));
  });

  test("sizeLabels still override sizeName", async () => {
    const fixture = await mountSettled({ sizeLabels: { large: "Comfortable" } });
    expect(fixture.componentInstance.labelFor("large")).toBe("Comfortable");
  });
});
