import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  RETURN_SYMBOL,
  SearchPicker,
  SearchPickerIcon,
  searchHref,
  type SearchEvent,
} from "./search-picker.component";

const LABELS = {
  label: "Search this site",
  inputLabel: "Search terms",
  submitLabel: "Search",
};

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

/** Fixtures created by a test, destroyed after it so listeners unwind. */
let fixtures: ComponentFixture<unknown>[] = [];

/** Create + render a SearchPicker with the three labels plus `inputs`. */
function mount(
  inputs: Record<string, unknown> = {},
): ComponentFixture<SearchPicker> {
  const fixture = TestBed.createComponent(SearchPicker);
  for (const [key, value] of Object.entries({ ...LABELS, ...inputs })) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

function q<T extends Element>(
  fixture: ComponentFixture<unknown>,
  sel: string,
): T {
  return fixture.nativeElement.querySelector(sel) as T;
}

const trigger = (f: ComponentFixture<unknown>) =>
  q<HTMLButtonElement>(f, ".search-picker-button");
const panel = (f: ComponentFixture<unknown>) =>
  q<HTMLDivElement>(f, ".search-picker-panel");
const form = (f: ComponentFixture<unknown>) =>
  q<HTMLFormElement>(f, ".search-picker-form");
const field = (f: ComponentFixture<unknown>) =>
  q<HTMLInputElement>(f, ".search-picker-input");
const submit = (f: ComponentFixture<unknown>) =>
  q<HTMLButtonElement>(f, ".search-picker-submit");

/** Click an element and re-render. */
function click(fixture: ComponentFixture<unknown>, target: Element): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  fixture.detectChanges();
}

/** Type into the field (fires `input`, which the value model listens to). */
function type(fixture: ComponentFixture<unknown>, text: string): void {
  const el = field(fixture);
  el.value = text;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  fixture.detectChanges();
}

/** Submit the form; returns false when the submission was cancelled. */
function submitForm(fixture: ComponentFixture<unknown>): boolean {
  const ok = form(fixture).dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true }),
  );
  fixture.detectChanges();
  return ok;
}

/** Mount with a spy `navigate`, open the panel, and return both. */
async function openPanel(inputs: Record<string, unknown> = {}) {
  const navigate = vi.fn();
  const fixture = mount({ navigate, ...inputs });
  click(fixture, trigger(fixture));
  await flush();
  fixture.detectChanges();
  return { fixture, navigate };
}

afterEach(() => {
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("SearchPicker — structure (§7.1–§7.6)", () => {
  test("§7.1 renders a named disclosure button controlling the panel", () => {
    const fixture = mount();
    const btn = trigger(fixture);
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-label")).toBe(LABELS.label);
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(btn.getAttribute("aria-controls")).toBe(panel(fixture).id);
    expect(panel(fixture).id).toMatch(/^search-picker-\d+-panel$/);
  });

  test("§7.2 the panel is hidden until the button is activated, and toggles", () => {
    const fixture = mount();
    expect(panel(fixture).hasAttribute("hidden")).toBe(true);
    click(fixture, trigger(fixture));
    expect(panel(fixture).hasAttribute("hidden")).toBe(false);
    expect(trigger(fixture).getAttribute("aria-expanded")).toBe("true");
    click(fixture, trigger(fixture));
    expect(panel(fixture).hasAttribute("hidden")).toBe(true);
    expect(trigger(fixture).getAttribute("aria-expanded")).toBe("false");
  });

  test("§7.3 the default icon is an aria-hidden magnifying-glass SVG", () => {
    const fixture = mount();
    const icon = q<SVGElement>(fixture, ".search-picker-icon");
    expect(icon.tagName.toLowerCase()).toBe("svg");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.closest("button")?.className).toContain("search-picker-button");
    expect(icon.querySelector("circle")).not.toBeNull();
    expect(icon.querySelector("path")).not.toBeNull();
  });

  test("§7.4 a projected ng-template replaces the icon and receives ChildArgs", async () => {
    const fixture = TestBed.createComponent(IconTemplateHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    await flush();
    fixture.detectChanges();
    const custom = q<HTMLElement>(fixture, '[data-testid="custom"]');
    expect(custom.closest("button")?.className).toContain("search-picker-button");
    expect(q(fixture, ".search-picker-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-query")).toBe("foo");
    click(fixture, trigger(fixture));
    expect(custom.getAttribute("data-open")).toBe("true");
  });

  test("§7.5 the panel holds a named search form, field, and submit button after the field", async () => {
    const { fixture } = await openPanel();
    const f = form(fixture);
    expect(f.getAttribute("role")).toBe("search");
    expect(f.getAttribute("aria-label")).toBe(LABELS.label);
    expect(f.getAttribute("method")).toBe("get");
    expect(f.getAttribute("action")).toBe("/");
    expect(field(fixture).getAttribute("type")).toBe("search");
    expect(field(fixture).getAttribute("aria-label")).toBe(LABELS.inputLabel);
    expect(field(fixture).getAttribute("enterkeyhint")).toBe("search");
    expect(submit(fixture).getAttribute("type")).toBe("submit");
    expect(submit(fixture).getAttribute("aria-label")).toBe(LABELS.submitLabel);
    expect(
      field(fixture).compareDocumentPosition(submit(fixture)) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("§7.6 the submit button shows ⏎ in an aria-hidden span", async () => {
    const { fixture } = await openPanel();
    const symbol = submit(fixture).querySelector(".search-picker-submit-symbol")!;
    expect(symbol.textContent).toBe("⏎");
    expect(symbol.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("SearchPicker — searching (§7.7–§7.15)", () => {
  test("§7.7 opening focuses the search field with preventScroll", async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    const { fixture } = await openPanel();
    expect(document.activeElement).toBe(field(fixture));
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  test("§7.8 Return in the field (form submit) navigates to /?<query>, cancelling the native submission", async () => {
    const { fixture, navigate } = await openPanel();
    type(fixture, "foo");
    // dispatchEvent returns false when cancelled: the native GET (which
    // would send /?name=value) must never run.
    expect(submitForm(fixture)).toBe(false);
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });

  test("§7.9 clicking the submit button navigates the same way", async () => {
    const { fixture, navigate } = await openPanel();
    type(fixture, "foo");
    click(fixture, submit(fixture));
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });

  test("§7.10 the query is trimmed and URI-encoded", async () => {
    const { fixture, navigate } = await openPanel();
    type(fixture, "  foo bar ");
    submitForm(fixture);
    expect(navigate).toHaveBeenLastCalledWith("/?foo%20bar");
    click(fixture, trigger(fixture));
    type(fixture, "a&b");
    submitForm(fixture);
    expect(navigate).toHaveBeenLastCalledWith("/?a%26b");
  });

  test("§7.11 an empty or whitespace-only query does nothing and stays open", async () => {
    const { fixture, navigate } = await openPanel();
    const searched = vi.fn();
    fixture.componentInstance.searched.subscribe(searched);
    expect(submitForm(fixture)).toBe(false);
    type(fixture, "   ");
    expect(submitForm(fixture)).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(searched).not.toHaveBeenCalled();
    expect(panel(fixture).hasAttribute("hidden")).toBe(false);
  });

  test("§7.12 action changes the path", async () => {
    const { fixture, navigate } = await openPanel({ action: "/search" });
    expect(form(fixture).getAttribute("action")).toBe("/search");
    type(fixture, "foo");
    submitForm(fixture);
    expect(navigate).toHaveBeenCalledWith("/search?foo");
  });

  test("§7.13 searched emits the trimmed query and href before navigate", async () => {
    const calls: string[] = [];
    const navigate = vi.fn((h: string) => calls.push(`navigate:${h}`));
    const { fixture } = await openPanel({ navigate });
    fixture.componentInstance.searched.subscribe((e: SearchEvent) =>
      calls.push(`search:${e.query}:${e.href}`),
    );
    type(fixture, " foo ");
    submitForm(fixture);
    expect(calls).toEqual(["search:foo:/?foo", "navigate:/?foo"]);
  });

  test("§7.14 without navigate, the default calls location.assign", async () => {
    // This harness's jsdom window exposes `location` (and its `assign`)
    // as non-configurable, so neither `vi.stubGlobal` nor `vi.spyOn` can
    // replace them. Instead, observe a REAL `location.assign`: jsdom
    // implements fragment-only navigation, so with `action="#"` the
    // default navigation lands on `#?foo` and is visible in
    // `location.hash`. Same code path as `/?foo`, different href.
    location.hash = "";
    const fixture = mount({ action: "#" });
    click(fixture, trigger(fixture));
    type(fixture, "foo");
    submitForm(fixture);
    expect(location.hash).toBe("#?foo");
    location.hash = "";
  });

  test("§7.15 a search closes the panel", async () => {
    const { fixture } = await openPanel();
    type(fixture, "foo");
    submitForm(fixture);
    expect(panel(fixture).hasAttribute("hidden")).toBe(true);
    expect(trigger(fixture).getAttribute("aria-expanded")).toBe("false");
  });
});

describe("SearchPicker — closing (§7.16–§7.18)", () => {
  test("§7.16 Escape closes and returns focus to the button with preventScroll", async () => {
    const { fixture } = await openPanel();
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    field(fixture).dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    fixture.detectChanges();
    await flush();
    expect(panel(fixture).hasAttribute("hidden")).toBe(true);
    expect(trigger(fixture).getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger(fixture));
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  test("§7.17 clicking outside closes the panel", async () => {
    const { fixture } = await openPanel();
    click(fixture, document.body);
    expect(panel(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.18 focus moving to an element outside the root closes the panel", async () => {
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    const { fixture } = await openPanel();
    field(fixture).dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
    );
    fixture.detectChanges();
    expect(panel(fixture).hasAttribute("hidden")).toBe(true);
    outside.remove();
  });
});

describe("SearchPicker — Safari-safe focusout (§7.24)", () => {
  test("§7.24 a focusout with no relatedTarget leaves the panel open, so the ⏎ click still lands", async () => {
    const { fixture, navigate } = await openPanel();
    type(fixture, "foo");
    // Safari: clicking ⏎ blurs the field without focusing the button.
    field(fixture).dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: null }),
    );
    fixture.detectChanges();
    expect(panel(fixture).hasAttribute("hidden")).toBe(false);
    click(fixture, submit(fixture));
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });
});

describe("SearchPicker — value, exports, root (§7.19–§7.23)", () => {
  test("§7.19 an initial value pre-fills the field, and typing updates the value model", async () => {
    const fixture = TestBed.createComponent(ValueHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    const navigate = fixture.componentInstance.navigate;
    click(fixture, trigger(fixture));
    expect(field(fixture).value).toBe("preset");
    type(fixture, "typed");
    // Two-way binding: the parent's signal follows the field.
    expect(fixture.componentInstance.query()).toBe("typed");
    submitForm(fixture);
    expect(navigate).toHaveBeenCalledWith("/?typed");
  });

  test("§7.20 searchHref builds the destination the component uses", () => {
    expect(searchHref("foo")).toBe("/?foo");
    expect(searchHref(" foo bar ")).toBe("/?foo%20bar");
    expect(searchHref("a&b")).toBe("/?a%26b");
    expect(searchHref("foo", "/search")).toBe("/search?foo");
  });

  test("§7.21 RETURN_SYMBOL is the bare ⏎ (U+23CE)", () => {
    expect(RETURN_SYMBOL).toBe("⏎");
    expect(RETURN_SYMBOL.codePointAt(0)).toBe(0x23ce);
    expect(RETURN_SYMBOL.length).toBe(1);
  });

  test("§7.22 className is appended to search-picker; host attributes land on the host", () => {
    const fixture = TestBed.createComponent(HostAttrHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    const root = q<HTMLElement>(fixture, ".search-picker");
    expect(root.tagName).toBe("DIV");
    expect(root.className.trim()).toBe("search-picker site-search");
    const host = q<HTMLElement>(fixture, "lily-search-picker");
    expect(host.getAttribute("data-testid")).toBe("root");
  });

  test("§7.23 no user-facing text of its own beyond the hidden ⏎ and the tooltip's label", async () => {
    const { fixture } = await openPanel();
    expect(field(fixture).hasAttribute("placeholder")).toBe(false);
    const root = q<HTMLElement>(fixture, ".search-picker");
    q<HTMLElement>(fixture, ".search-picker-tooltip").remove();
    const texts: string[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const t = walker.currentNode.textContent!.trim();
      if (t) texts.push(t);
    }
    expect(texts).toEqual(["⏎"]);
  });
});

@Component({
  standalone: true,
  imports: [SearchPicker, SearchPickerIcon],
  template: `
    <lily-search-picker
      label="Search this site"
      inputLabel="Search terms"
      submitLabel="Search"
      value="foo"
    >
      <ng-template lilySearchPickerIcon let-args>
        <span
          data-testid="custom"
          [attr.data-open]="args.open"
          [attr.data-query]="args.query"
        ></span>
      </ng-template>
    </lily-search-picker>
  `,
})
class IconTemplateHost {}

@Component({
  standalone: true,
  imports: [SearchPicker],
  template: `
    <lily-search-picker
      label="Search this site"
      inputLabel="Search terms"
      submitLabel="Search"
      [(value)]="query"
      [navigate]="navigate"
    />
  `,
})
class ValueHost {
  readonly query = signal("preset");
  readonly navigate = vi.fn();
}

@Component({
  standalone: true,
  imports: [SearchPicker],
  template: `
    <lily-search-picker
      label="Search this site"
      inputLabel="Search terms"
      submitLabel="Search"
      className="site-search"
      data-testid="root"
    />
  `,
})
class HostAttrHost {}

describe("search-picker — tooltip (§7.25–§7.30)", () => {
  function setup() {
    const fixture = mount();
    const button = q<HTMLButtonElement>(fixture, ".search-picker-button");
    const tip = q<HTMLElement>(fixture, ".search-picker-tooltip");
    const hover = (el: Element, type: "mouseenter" | "mouseleave") => {
      el.dispatchEvent(new MouseEvent(type, { bubbles: true }));
      fixture.detectChanges();
    };
    const hidden = () => tip.hasAttribute("hidden");
    return { fixture, button, tip, hover, hidden };
  }

  test("§7.25 renders a role=tooltip element holding the label, hidden at rest, not aria-describedby-linked", () => {
    const { button, tip, hidden } = setup();
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.textContent).toBe("Search this site");
    expect(hidden()).toBe(true);
    expect(tip.id).toBeTruthy();
    expect(button.hasAttribute("aria-describedby")).toBe(false);
    expect(tip.previousElementSibling).toBe(button.closest("lily-icon-button"));
  });

  test("§7.26 pointer over the button shows it; leaving hides it", () => {
    const { button, hover, hidden } = setup();
    hover(button, "mouseenter");
    expect(hidden()).toBe(false);
    hover(button, "mouseleave");
    expect(hidden()).toBe(true);
  });

  test("§7.27 it stays visible while the pointer is over the tooltip itself", () => {
    const { button, tip, hover, hidden } = setup();
    hover(button, "mouseenter");
    hover(button, "mouseleave");
    hover(tip, "mouseenter");
    expect(hidden()).toBe(false);
    hover(tip, "mouseleave");
    expect(hidden()).toBe(true);
  });

  test("§7.28 keyboard focus shows it; blur hides it", async () => {
    const { fixture, button, hidden } = setup();
    // jsdom has no input-modality tracking; stand in for the keyboard.
    vi.spyOn(button, "matches").mockImplementation((s) => s === ":focus-visible");
    button.focus();
    fixture.detectChanges();
    expect(hidden()).toBe(false);
    button.blur();
    fixture.detectChanges();
    expect(hidden()).toBe(true);
  });

  test("§7.28 mouse-induced focus (not :focus-visible) does not show it", async () => {
    const { fixture, button, hidden } = setup();
    vi.spyOn(button, "matches").mockReturnValue(false);
    button.focus();
    fixture.detectChanges();
    expect(hidden()).toBe(true);
  });

  test("§7.29 Escape dismisses it without moving focus; re-entering shows it again", () => {
    const { fixture, button, hover, hidden } = setup();
    button.focus();
    hover(button, "mouseenter");
    expect(hidden()).toBe(false);
    const ev = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    button.dispatchEvent(ev);
    fixture.detectChanges();
    expect(hidden()).toBe(true);
    expect(document.activeElement).toBe(button);
    hover(button, "mouseleave");
    hover(button, "mouseenter");
    expect(hidden()).toBe(false);
  });

  test("§7.30 it is never shown while the popup is open", async () => {
    const { fixture, button, hover, hidden } = setup();
    hover(button, "mouseenter");
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flush();
    fixture.detectChanges();
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(hidden()).toBe(true);
    hover(button, "mouseenter");
    expect(hidden()).toBe(true);
  });

  test("§7.31 pointer hover shows it with focus elsewhere; Escape on another element dismisses it, and the document listener is gone after hide/destroy", () => {
    const { fixture, button, hover, hidden } = setup();
    const keydownAdds = (spy: ReturnType<typeof vi.spyOn>) =>
      spy.mock.calls.filter((c) => c[0] === "keydown");
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");
    try {
      const other = document.createElement("input");
      document.body.appendChild(other);
      other.focus();
      hover(button, "mouseenter");
      expect(hidden()).toBe(false);
      expect(document.activeElement).toBe(other);
      expect(keydownAdds(add).length).toBe(1); // added once, not per change detection
      fixture.detectChanges();
      expect(keydownAdds(add).length).toBe(1);

      const ev = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
      other.dispatchEvent(ev);
      fixture.detectChanges();
      expect(hidden()).toBe(true);
      expect(ev.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(other);
      expect(keydownAdds(remove).length).toBe(1); // removed on hide
      expect(keydownAdds(remove)[0][1]).toBe(keydownAdds(add)[0][1]);

      // Re-entering shows it again (listener re-added), destroy removes it.
      hover(button, "mouseleave");
      hover(button, "mouseenter");
      expect(hidden()).toBe(false);
      expect(keydownAdds(add).length).toBe(2);
      fixture.destroy();
      expect(keydownAdds(remove).length).toBe(2);
      other.remove();
    } finally {
      add.mockRestore();
      remove.mockRestore();
    }
  });
});
