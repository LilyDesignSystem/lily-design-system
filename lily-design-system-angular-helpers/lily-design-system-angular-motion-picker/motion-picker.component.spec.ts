import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  MotionPicker,
  MotionPickerIcon,
  motionName,
  nextMotionPickerId,
  prefersReducedMotion,
} from "./motion-picker.component";

const MOTIONS = ["no-preference", "reduce"];

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
  document.documentElement.removeAttribute("data-motion");
}

/** Set (or clear) window.matchMedia's answer to (prefers-reduced-motion: reduce). */
function mockReducedMotion(matches: boolean): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

/** Fixtures created by a test, destroyed after it so listeners unwind. */
let fixtures: ComponentFixture<unknown>[] = [];

/** Create + render a MotionPicker with the supplied inputs. */
function mount(
  inputs: Record<string, unknown> = {},
): ComponentFixture<MotionPicker> {
  const fixture = TestBed.createComponent(MotionPicker);
  fixture.componentRef.setInput("label", "Motion");
  fixture.componentRef.setInput("motions", MOTIONS);
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
): Promise<ComponentFixture<MotionPicker>> {
  const fixture = mount(inputs);
  await flush();
  fixture.detectChanges();
  return fixture;
}

function q<T extends Element>(
  fixture: ComponentFixture<unknown>,
  sel: string,
): T {
  return fixture.nativeElement.querySelector(sel) as T;
}

function button(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return q<HTMLButtonElement>(fixture, ".motion-picker-button");
}

function list(fixture: ComponentFixture<unknown>): HTMLUListElement {
  return q<HTMLUListElement>(fixture, ".motion-picker-list");
}

function options(fixture: ComponentFixture<unknown>): HTMLLIElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".motion-picker-option"),
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
  motions: string[] = MOTIONS,
): Promise<void> {
  click(fixture, button(fixture));
  click(fixture, options(fixture)[motions.indexOf(slug)]);
  await flush();
  fixture.detectChanges();
}

beforeEach(() => {
  resetRoot();
  mockReducedMotion(false);
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
  vi.restoreAllMocks();
});

describe("MotionPicker — markup contract (§4.2, §7.1–§7.5)", () => {
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
    const root = q<HTMLElement>(fixture, ".motion-picker");
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("motion-picker")).toBe(true);
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("§7.1 the button renders the pause glyph, hidden from assistive tech", () => {
    const fixture = mount();
    const icon = q<HTMLElement>(fixture, ".motion-picker-icon");
    // U+23F8 PAUSE SIGN + U+FE0E (text presentation).
    expect(icon.textContent).toBe("⏸︎");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("§7.2 aria-label names the button and the listbox", () => {
    const fixture = mount({ label: "Choose motion" });
    expect(button(fixture).getAttribute("aria-label")).toBe("Choose motion");
    expect(list(fixture).getAttribute("aria-label")).toBe("Choose motion");
  });

  test("§7.3 one option per motion; the hidden input carries the supplied name", async () => {
    const fixture = await mountSettled({ name: "reduced-motion" });
    expect(options(fixture).length).toBe(MOTIONS.length);
    const hidden = q<HTMLInputElement>(fixture, 'input[type="hidden"]');
    expect(hidden.name).toBe("reduced-motion");
    expect(hidden.value).toBe("no-preference");
  });

  test("§7.3 name defaults to motion", async () => {
    const fixture = await mountSettled();
    expect(q<HTMLInputElement>(fixture, 'input[type="hidden"]').name).toBe(
      "motion",
    );
  });

  test("§7.3 option ids are unique per instance", () => {
    const a = mount();
    const b = mount();
    const idsA = options(a).map((o) => o.id);
    const idsB = options(b).map((o) => o.id);
    expect(new Set([...idsA, ...idsB]).size).toBe(idsA.length + idsB.length);
    expect(idsA.every((id) => id.length > 0)).toBe(true);
  });

  test("§7.3 nextMotionPickerId is a monotonic counter, not random", () => {
    const first = nextMotionPickerId();
    const second = nextMotionPickerId();
    expect(first).toMatch(/^motion-picker-\d+$/);
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

  test("§7.4 the active motion is the aria-selected option", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture));
    const selected = fixture.nativeElement.querySelectorAll(
      '[role="option"][aria-selected="true"]',
    ) as NodeListOf<HTMLElement>;
    expect(selected.length).toBe(1);
    expect(selected[0].textContent?.trim()).toBe("No Preference");
  });

  test("§7.4 the active option carries data-active while open", () => {
    const fixture = mount();
    click(fixture, button(fixture));
    const active = fixture.nativeElement.querySelectorAll(
      ".motion-picker-option[data-active]",
    ) as NodeListOf<HTMLElement>;
    expect(active.length).toBe(1);
  });

  test("§7.4 aria-activedescendant is absent while the listbox is closed", () => {
    const fixture = mount();
    expect(list(fixture).hasAttribute("aria-activedescendant")).toBe(false);
  });

  test("§7.5 default labels title-case the slug", () => {
    const fixture = mount({ motions: ["no-preference", "reduce"] });
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/No Preference/);
    expect(text).toMatch(/Reduce/);
  });

  test("§7.5 motionLabels override the default title-case label", () => {
    const fixture = mount({
      motions: ["no-preference", "reduce"],
      motionLabels: { "no-preference": "Full motion", reduce: "Reduced motion" },
    });
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Full motion/);
    expect(text).toMatch(/Reduced motion/);
  });
});

describe("MotionPicker — keyboard contract (APG listbox, §7.18–§7.22)", () => {
  async function openWith(
    key: string,
  ): Promise<ComponentFixture<MotionPicker>> {
    const fixture = await mountSettled();
    press(fixture, button(fixture), key);
    await flush();
    fixture.detectChanges();
    return fixture;
  }

  test("§7.18 ArrowDown, Enter and Space all open the listbox", async () => {
    for (const key of ["ArrowDown", "Enter", " "]) {
      const fixture = await openWith(key);
      expect(list(fixture).hasAttribute("hidden")).toBe(false);
      expect(button(fixture).getAttribute("aria-expanded")).toBe("true");
    }
  });

  test("§7.18 opening puts the active descendant on the selected motion", async () => {
    const fixture = await openWith("ArrowDown");
    // "no-preference" resolves as the initial motion, so it is index 0.
    expect(list(fixture).getAttribute("aria-activedescendant")).toBe(
      list(fixture).children[0].id,
    );
  });

  test("§7.18 ArrowUp opens with the last option active", async () => {
    const fixture = await openWith("ArrowUp");
    expect(list(fixture).getAttribute("aria-activedescendant")).toBe(
      list(fixture).children[MOTIONS.length - 1].id,
    );
  });

  test("§7.18 opening moves focus to the listbox", async () => {
    const fixture = await openWith("ArrowDown");
    expect(document.activeElement).toBe(list(fixture));
  });

  test("§7.19 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
    press(fixture, ul, "ArrowDown");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
    // Clamps at the top rather than wrapping.
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
  });

  test("§7.19 ArrowDown clamps at the last option", async () => {
    const fixture = await openWith("ArrowUp");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    expect(ul.getAttribute("aria-activedescendant")).toBe(
      ul.children[MOTIONS.length - 1].id,
    );
  });

  test("§7.19 Home and End jump to the first and last option", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    expect(ul.getAttribute("aria-activedescendant")).toBe(
      ul.children[MOTIONS.length - 1].id,
    );
    press(fixture, ul, "Home");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
  });

  test("§7.20 Enter selects the active option, applies it, and closes", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    press(fixture, ul, "Enter");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(button(fixture).getAttribute("aria-expanded")).toBe("false");
    expect(document.documentElement.dataset["motion"]).toBe("reduce");
  });

  test("§7.20 Enter returns focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    press(fixture, list(fixture), "Enter");
    await flush();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.20 Space selects the active option and closes", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    press(fixture, ul, " ");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset["motion"]).toBe("reduce");
  });

  test("§7.21 Escape closes without changing the motion", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    press(fixture, ul, "Escape");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset["motion"]).toBe("no-preference");
  });

  test("§7.21 Escape returns focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    press(fixture, list(fixture), "Escape");
    await flush();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.21 Tab closes after handing focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "Tab");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.22 typeahead moves the active descendant by label prefix", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "r");
    // "Reduce" is index 1 in MOTIONS.
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
  });

  test("§7.22 typeahead matches the rendered label, not the slug", async () => {
    const fixture = await mountSettled({
      motionLabels: { reduce: "Less" },
    });
    press(fixture, button(fixture), "ArrowDown");
    await flush();
    fixture.detectChanges();
    const ul = list(fixture);
    press(fixture, ul, "l");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
  });

  test("§7.22 the typeahead buffer resets after the 500 ms pause", async () => {
    vi.useFakeTimers();
    try {
      const fixture = mount({
        motions: ["no-preference", "reduce", "less"],
      });
      press(fixture, button(fixture), "ArrowDown");
      const ul = list(fixture);
      press(fixture, ul, "l");
      expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
      // Without a reset, "l" + "n" would match nothing; after the pause
      // the buffer is empty so "n" alone matches "No Preference".
      vi.advanceTimersByTime(600);
      press(fixture, ul, "n");
      expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
    } finally {
      vi.useRealTimers();
    }
  });

  test("§7.22 clicking an option selects it, applies it, and closes the listbox", async () => {
    const fixture = await mountSettled();
    await pick(fixture, "reduce");
    expect(document.documentElement.dataset["motion"]).toBe("reduce");
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    expect(button(fixture).getAttribute("aria-expanded")).toBe("false");
  });

  test("§7.22 clicking outside the root closes the listbox", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });
});

describe("MotionPicker — motion application (§5, §7.6–§7.11)", () => {
  test("§7.6 default initial value is 'no-preference' when the OS reports no preference", async () => {
    mockReducedMotion(false);
    await mountSettled();
    expect(document.documentElement.dataset["motion"]).toBe("no-preference");
  });

  test("§7.6 default initial value is 'reduce' when the OS reports prefers-reduced-motion", async () => {
    mockReducedMotion(true);
    await mountSettled();
    expect(document.documentElement.dataset["motion"]).toBe("reduce");
  });

  test("§7.6 falls back to motions[0] when neither OS slug is offered", async () => {
    mockReducedMotion(true);
    await mountSettled({ motions: ["standard", "minimal"] });
    expect(document.documentElement.dataset["motion"]).toBe("standard");
  });

  test("§7.7 sets data-motion on documentElement", async () => {
    await mountSettled({ defaultValue: "reduce" });
    expect(document.documentElement.getAttribute("data-motion")).toBe(
      "reduce",
    );
  });

  test("§7.8 selecting an option updates data-motion and emits motionChange", async () => {
    const fixture = await mountSettled();
    const onChange = vi.fn();
    fixture.componentInstance.motionChange.subscribe(onChange);
    await pick(fixture, "reduce");
    expect(document.documentElement.dataset["motion"]).toBe("reduce");
    expect(onChange).toHaveBeenCalledWith("reduce");
  });

  test("§7.8 the hidden input tracks the selected value", async () => {
    const fixture = await mountSettled();
    await pick(fixture, "reduce");
    expect(q<HTMLInputElement>(fixture, 'input[type="hidden"]').value).toBe(
      "reduce",
    );
  });

  test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
    const fixture = await mountSettled({ storageKey: "lily-motion" });
    await pick(fixture, "reduce");
    expect(localStorage.getItem("lily-motion")).toBe("reduce");
    fixture.destroy();
    resetRoot();

    await mountSettled({ storageKey: "lily-motion" });
    expect(document.documentElement.dataset["motion"]).toBe("reduce");
  });

  test("§7.10 a supplied value input wins over storage, OS preference, and defaults", async () => {
    mockReducedMotion(true);
    localStorage.setItem("lily-motion", "reduce");
    await mountSettled({
      value: "no-preference",
      storageKey: "lily-motion",
    });
    expect(document.documentElement.dataset["motion"]).toBe("no-preference");
  });

  test("§7.10 defaultValue wins over the OS-preference fallback", async () => {
    mockReducedMotion(true);
    await mountSettled({ defaultValue: "no-preference" });
    expect(document.documentElement.dataset["motion"]).toBe("no-preference");
  });

  test("§7.11 a custom target receives data-motion", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    await mountSettled({ target, defaultValue: "reduce" });
    expect(target.getAttribute("data-motion")).toBe("reduce");
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
    target.remove();
  });
});

@Component({
  standalone: true,
  imports: [MotionPicker, MotionPickerIcon],
  template: `
    <lily-motion-picker label="Motion" [motions]="motions" [value]="'reduce'">
      <ng-template lilyMotionPickerIcon let-args>
        <span
          data-testid="custom"
          [attr.data-open]="args.open"
          [attr.data-value]="args.value"
          [attr.data-label-reduce]="args.labelFor('reduce')"
          >custom glyph</span
        >
      </ng-template>
    </lily-motion-picker>
  `,
})
class IconTemplateHost {
  readonly motions = MOTIONS;
}

describe("MotionPicker — custom icon template (§7.12–§7.13)", () => {
  test("§7.12 className is appended to the root div", () => {
    const fixture = mount({ className: "extra" });
    expect(
      q<HTMLElement>(fixture, ".motion-picker").classList.contains("extra"),
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
    expect(custom.closest("button")?.className).toContain(
      "motion-picker-button",
    );
    expect(
      fixture.nativeElement.querySelector(".motion-picker-icon"),
    ).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-value")).toBe("reduce");
    expect(custom.getAttribute("data-label-reduce")).toBe("Reduce");
  });
});

describe("MotionPicker — accessibility hardening (§7.14–§7.17)", () => {
  async function openPicker(
    motions: string[] = MOTIONS,
    extra: Record<string, unknown> = {},
  ): Promise<ComponentFixture<MotionPicker>> {
    const fixture = await mountSettled({ motions, ...extra });
    click(fixture, button(fixture));
    await flush();
    fixture.detectChanges();
    return fixture;
  }

  const active = (fixture: ComponentFixture<unknown>) =>
    (
      fixture.nativeElement.querySelector("[data-active]") as HTMLElement | null
    )?.textContent?.trim();

  test("§7.14 Tab from the open list puts focus on the button before closing", async () => {
    const fixture = await openPicker();
    const ul = list(fixture);
    expect(document.activeElement).toBe(ul);
    press(fixture, ul, "Tab");
    expect(document.activeElement).toBe(button(fixture));
    expect(ul.hasAttribute("hidden")).toBe(true);
  });

  test("§7.15 a repeated typeahead character cycles through its matches", async () => {
    const fixture = await openPicker(["r1", "r2", "r3", "m"], {
      motionLabels: { r1: "Reduce a lot", r2: "Reduce more", r3: "Reduce most", m: "Minimal" },
      defaultValue: "m",
    });
    const ul = list(fixture);
    press(fixture, ul, "r");
    expect(active(fixture)).toBe("Reduce a lot");
    press(fixture, ul, "r");
    expect(active(fixture)).toBe("Reduce more");
    press(fixture, ul, "r");
    expect(active(fixture)).toBe("Reduce most");
  });

  test("§7.15 a multi-character buffer refines the match from the active option", async () => {
    const fixture = await openPicker(["r1", "r2", "r3", "m"], {
      motionLabels: { r1: "Reduce a lot", r2: "Reduce more", r3: "Reduce most", m: "Minimal" },
      defaultValue: "m",
    });
    const ul = list(fixture);
    press(fixture, ul, "r");
    press(fixture, ul, "e");
    expect(active(fixture)).toBe("Reduce a lot");
  });

  test("§7.16 PageUp and PageDown move the cursor by ten, clamped", async () => {
    const many = Array.from(
      { length: 25 },
      (_, i) => `s${String(i).padStart(2, "0")}`,
    );
    const fixture = await openPicker(many);
    const ul = list(fixture);
    press(fixture, ul, "PageDown");
    expect(active(fixture)).toBe("S10");
    press(fixture, ul, "PageDown");
    expect(active(fixture)).toBe("S20");
    press(fixture, ul, "PageDown");
    expect(active(fixture)).toBe("S24");
    press(fixture, ul, "PageUp");
    expect(active(fixture)).toBe("S14");
  });

  test("§7.17 an empty list opens without aria-activedescendant", async () => {
    const fixture = await openPicker([]);
    const ul = list(fixture);
    expect(ul.hasAttribute("hidden")).toBe(false);
    expect(ul.getAttribute("aria-activedescendant")).toBeNull();
  });
});

describe("MotionPicker — motionName / prefersReducedMotion (§7.23)", () => {
  test("motionName title-cases each hyphen-separated word", () => {
    expect(motionName("no-preference")).toBe("No Preference");
    expect(motionName("reduce")).toBe("Reduce");
  });

  test("motionName handles a long multi-word slug", () => {
    expect(motionName("extra-reduced-motion-mode")).toBe("Extra Reduced Motion Mode");
  });

  test("labelFor delegates to motionName so there is one implementation", async () => {
    const fixture = await mountSettled();
    expect(fixture.componentInstance.labelFor("reduce")).toBe(
      motionName("reduce"),
    );
  });

  test("motionLabels still override motionName", async () => {
    const fixture = await mountSettled({
      motionLabels: { reduce: "Calmer" },
    });
    expect(fixture.componentInstance.labelFor("reduce")).toBe("Calmer");
  });

  test("prefersReducedMotion reads (prefers-reduced-motion: reduce)", () => {
    mockReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);
    mockReducedMotion(false);
    expect(prefersReducedMotion()).toBe(false);
  });
});
