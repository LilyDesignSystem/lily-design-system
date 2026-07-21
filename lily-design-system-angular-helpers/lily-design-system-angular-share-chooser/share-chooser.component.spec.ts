import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  ShareChooser,
  ShareChooserIcon,
  BLACK_RIGHTWARDS_ARROWHEAD,
  canCopy,
  canShareNatively,
  nextShareChooserId,
  type ShareTarget,
} from "./share-chooser.component";

const URL_UNDER_TEST = "https://example.test/article";

const TARGETS: ShareTarget[] = [
  {
    id: "mastodon",
    label: "Mastodon",
    href: (u, t) =>
      `https://mastodon.test/share?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: (u) => `https://linkedin.test/sharing?url=${encodeURIComponent(u)}`,
  },
];

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

/** Install a fake async clipboard; returns the writes and a restore fn. */
function stubClipboard(succeed = true): { writes: string[]; restore: () => void } {
  const original = (navigator as any).clipboard;
  const writes: string[] = [];
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: (s: string) => {
        if (!succeed) return Promise.reject(new Error("denied"));
        writes.push(s);
        return Promise.resolve();
      },
    },
  });
  return {
    writes,
    restore: () => {
      if (original === undefined) delete (navigator as any).clipboard;
      else
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: original,
        });
    },
  };
}

/** Install a fake native share sheet; returns the calls and a restore fn. */
function stubNativeShare(behaviour: "resolve" | "reject" = "resolve") {
  const original = (navigator as any).share;
  const calls: any[] = [];
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: (data: any) => {
      calls.push(data);
      return behaviour === "resolve"
        ? Promise.resolve()
        : Promise.reject(new Error("AbortError"));
    },
  });
  return {
    calls,
    restore: () => {
      if (original === undefined) delete (navigator as any).share;
      else
        Object.defineProperty(navigator, "share", {
          configurable: true,
          value: original,
        });
    },
  };
}

/** Fixtures created by a test, destroyed after it so listeners unwind. */
let fixtures: ComponentFixture<unknown>[] = [];

/** Create + render a ShareChooser with the supplied inputs. */
function mount(inputs: Record<string, unknown> = {}): ComponentFixture<ShareChooser> {
  const fixture = TestBed.createComponent(ShareChooser);
  fixture.componentRef.setInput("label", "Share");
  fixture.componentRef.setInput("targets", TARGETS);
  fixture.componentRef.setInput("url", URL_UNDER_TEST);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

function q<T extends Element>(fixture: ComponentFixture<unknown>, sel: string): T {
  return fixture.nativeElement.querySelector(sel) as T;
}

function trigger(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return q<HTMLButtonElement>(fixture, ".share-chooser-button");
}

function list(fixture: ComponentFixture<unknown>): HTMLUListElement {
  return q<HTMLUListElement>(fixture, ".share-chooser-list");
}

function links(fixture: ComponentFixture<unknown>): HTMLAnchorElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".share-chooser-target"),
  ) as HTMLAnchorElement[];
}

function items(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".share-chooser-target, .share-chooser-copy"),
  ) as HTMLElement[];
}

function status(fixture: ComponentFixture<unknown>): HTMLElement {
  return q<HTMLElement>(fixture, ".share-chooser-status");
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

/** Click an element, let microtasks settle, and re-render. */
async function clickSettled(
  fixture: ComponentFixture<unknown>,
  target: HTMLElement,
): Promise<void> {
  click(fixture, target);
  await flush();
  fixture.detectChanges();
}

beforeEach(() => {
  // jsdom ships neither API; make their absence explicit rather than assumed.
  delete (navigator as any).share;
  delete (navigator as any).clipboard;
});

afterEach(() => {
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
  delete (navigator as any).share;
  delete (navigator as any).clipboard;
});

describe("ShareChooser — markup contract (§4.2, §7.1–§7.6)", () => {
  test("§7.1 renders a disclosure button controlling a list", () => {
    const fixture = mount();
    const btn = trigger(fixture);
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-label")).toBe("Share");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    const listId = btn.getAttribute("aria-controls");
    expect(listId).toBeTruthy();
    expect(list(fixture).id).toBe(listId);
    expect(list(fixture).tagName).toBe("UL");
  });

  test("§4.2 the trigger's class hook is share-chooser-button", () => {
    const fixture = mount();
    expect(trigger(fixture)).toBeTruthy();
    expect(trigger(fixture).tagName).toBe("BUTTON");
    // The retired `share-button-trigger` hook must not linger.
    expect(q(fixture, ".share-chooser-trigger")).toBeNull();
  });

  test("§4.2 the root carries the base class plus the consumer's class", () => {
    const fixture = mount({ className: "extra" });
    const root = q<HTMLElement>(fixture, ".share-chooser");
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("§7.1 the button renders ➤, hidden from assistive tech", () => {
    const fixture = mount();
    const icon = q<HTMLElement>(fixture, ".share-chooser-icon");
    // U+27A4 BLACK RIGHTWARDS ARROWHEAD
    expect(icon.textContent).toBe("➤");
    expect(BLACK_RIGHTWARDS_ARROWHEAD).toBe("➤");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("§4.3 nextShareChooserId mints unique, stable ids", () => {
    const a = nextShareChooserId();
    const b = nextShareChooserId();
    expect(a).toMatch(/^share-chooser-\d+$/);
    expect(b).not.toBe(a);
  });

  test("§7.2 the list is hidden until the button is activated", async () => {
    const fixture = mount();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    await clickSettled(fixture, trigger(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    expect(trigger(fixture).getAttribute("aria-expanded")).toBe("true");
  });

  test("§7.3 destinations are real links, not role=menuitem", async () => {
    const fixture = mount();
    await clickSettled(fixture, trigger(fixture));
    const all = links(fixture);
    expect(all.length).toBe(2);
    for (const a of all) {
      expect(a.tagName).toBe("A");
      // Real link semantics are the point: no role override, and safe
      // cross-origin defaults.
      expect(a.getAttribute("role")).toBeNull();
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  test("§7.3 newTab:false drops target=_blank for that destination", async () => {
    const fixture = mount({
      targets: [
        TARGETS[0],
        { id: "email", label: "Email", href: (u: string) => `mailto:?body=${u}`, newTab: false },
      ],
    });
    await clickSettled(fixture, trigger(fixture));
    const all = links(fixture);
    expect(all[0].getAttribute("target")).toBe("_blank");
    expect(all[1].getAttribute("target")).toBeNull();
  });

  test("§7.3 destinations sit in .share-chooser-list-item children", async () => {
    const fixture = mount();
    await clickSettled(fixture, trigger(fixture));
    const li = fixture.nativeElement.querySelectorAll(".share-chooser-list-item");
    expect(li.length).toBe(2);
    expect((li[0] as HTMLElement).tagName).toBe("LI");
  });

  test("§7.4 each destination's href comes from its own href()", async () => {
    const fixture = mount({ title: "Hello" });
    await clickSettled(fixture, trigger(fixture));
    const all = links(fixture);
    expect(all[0].getAttribute("href")).toBe(
      `https://mastodon.test/share?url=${encodeURIComponent(URL_UNDER_TEST)}&text=${encodeURIComponent("Hello")}`,
    );
    expect(all[1].getAttribute("href")).toBe(
      `https://linkedin.test/sharing?url=${encodeURIComponent(URL_UNDER_TEST)}`,
    );
  });

  test("§7.4 href() also receives text", async () => {
    const fixture = mount({
      title: "T",
      text: "Body",
      targets: [
        { id: "x", label: "X", href: (_u: string, _t: string, x: string) => `https://x.test/?t=${x}` },
      ],
    });
    await clickSettled(fixture, trigger(fixture));
    expect(links(fixture)[0].getAttribute("href")).toBe("https://x.test/?t=Body");
  });

  test("§7.5 no copy item renders when copyLabel is absent", async () => {
    const fixture = mount();
    await clickSettled(fixture, trigger(fixture));
    expect(q(fixture, ".share-chooser-copy")).toBeNull();
  });

  test("§7.5 the copy item renders when copyLabel is supplied", async () => {
    const fixture = mount({ copyLabel: "Copy link" });
    await clickSettled(fixture, trigger(fixture));
    const copy = q<HTMLElement>(fixture, ".share-chooser-copy");
    expect(copy.tagName).toBe("BUTTON");
    expect(copy.getAttribute("type")).toBe("button");
    expect(copy.textContent?.trim()).toBe("Copy link");
  });

  test("§7.6 the status region is present, polite, and silent on load", () => {
    const fixture = mount();
    const el = status(fixture);
    expect(el.tagName).toBe("P");
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.textContent?.trim()).toBe("");
  });
});

describe("ShareChooser — copy to clipboard (§7.7–§7.10)", () => {
  test("§7.7 copying writes the URL and emits copy", async () => {
    const clip = stubClipboard();
    const fixture = mount({ copyLabel: "Copy link" });
    const copied = vi.fn();
    fixture.componentInstance.copy.subscribe(copied);
    await clickSettled(fixture, trigger(fixture));
    await clickSettled(fixture, q<HTMLElement>(fixture, ".share-chooser-copy"));
    expect(clip.writes).toEqual([URL_UNDER_TEST]);
    expect(copied).toHaveBeenCalledWith(URL_UNDER_TEST);
    clip.restore();
  });

  test("§7.8 a successful copy announces copiedLabel and closes the list", async () => {
    const clip = stubClipboard();
    const fixture = mount({ copyLabel: "Copy link", copiedLabel: "Link copied" });
    await clickSettled(fixture, trigger(fixture));
    await clickSettled(fixture, q<HTMLElement>(fixture, ".share-chooser-copy"));
    expect(status(fixture).textContent?.trim()).toBe("Link copied");
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    clip.restore();
  });

  test("§7.9 a failed copy announces copyFailedLabel and does not throw", async () => {
    const clip = stubClipboard(false);
    const fixture = mount({
      copyLabel: "Copy link",
      copiedLabel: "Link copied",
      copyFailedLabel: "Could not copy",
    });
    await clickSettled(fixture, trigger(fixture));
    await clickSettled(fixture, q<HTMLElement>(fixture, ".share-chooser-copy"));
    expect(status(fixture).textContent?.trim()).toBe("Could not copy");
    clip.restore();
  });

  test("§7.9 a failed copy does not emit copy, and still closes the list", async () => {
    const clip = stubClipboard(false);
    const fixture = mount({ copyLabel: "Copy link", copyFailedLabel: "Could not copy" });
    const copied = vi.fn();
    fixture.componentInstance.copy.subscribe(copied);
    await clickSettled(fixture, trigger(fixture));
    await clickSettled(fixture, q<HTMLElement>(fixture, ".share-chooser-copy"));
    expect(copied).not.toHaveBeenCalled();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    clip.restore();
  });

  test("§7.10 an absent clipboard API is treated as a failure, not a crash", async () => {
    // No stub: jsdom has no navigator.clipboard at all.
    expect(canCopy()).toBe(false);
    const fixture = mount({ copyLabel: "Copy link", copyFailedLabel: "Could not copy" });
    await clickSettled(fixture, trigger(fixture));
    await clickSettled(fixture, q<HTMLElement>(fixture, ".share-chooser-copy"));
    expect(status(fixture).textContent?.trim()).toBe("Could not copy");
  });

  test("§7.10 canCopy reflects navigator.clipboard.writeText", () => {
    expect(canCopy()).toBe(false);
    const clip = stubClipboard();
    expect(canCopy()).toBe(true);
    clip.restore();
  });
});

describe("ShareChooser — native share sheet (§7.11–§7.14)", () => {
  test("§7.11 canShareNatively reflects navigator.share", () => {
    expect(canShareNatively()).toBe(false);
    const nat = stubNativeShare();
    expect(canShareNatively()).toBe(true);
    nat.restore();
  });

  test("§7.12 strategy=auto uses the sheet when available, and skips the list", async () => {
    const nat = stubNativeShare();
    const fixture = mount({ title: "Hello", text: "Body" });
    const shared = vi.fn();
    fixture.componentInstance.nativeShare.subscribe(shared);
    await clickSettled(fixture, trigger(fixture));
    expect(nat.calls).toEqual([{ url: URL_UNDER_TEST, title: "Hello", text: "Body" }]);
    expect(shared).toHaveBeenCalledWith(URL_UNDER_TEST);
    // The list must NOT also open.
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    nat.restore();
  });

  test("§7.12 strategy=native attempts the sheet", async () => {
    const nat = stubNativeShare();
    const fixture = mount({ strategy: "native" });
    await clickSettled(fixture, trigger(fixture));
    expect(nat.calls.length).toBe(1);
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    nat.restore();
  });

  test("§7.13 strategy=auto falls back to the list with no native sheet", async () => {
    const fixture = mount();
    await clickSettled(fixture, trigger(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
  });

  test("§7.13 strategy=list ignores an available native sheet", async () => {
    const nat = stubNativeShare();
    const fixture = mount({ strategy: "list" });
    await clickSettled(fixture, trigger(fixture));
    expect(nat.calls.length).toBe(0);
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    nat.restore();
  });

  test("§7.14 a dismissed share sheet does not fall through to the list", async () => {
    // navigator.share rejects when the user dismisses the sheet. Opening
    // the list then would resurrect UI the user just dismissed.
    const nat = stubNativeShare("reject");
    const fixture = mount();
    await clickSettled(fixture, trigger(fixture));
    expect(nat.calls.length).toBe(1);
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    nat.restore();
  });

  test("§7.14 a dismissed share sheet does not emit nativeShare", async () => {
    const nat = stubNativeShare("reject");
    const fixture = mount();
    const shared = vi.fn();
    fixture.componentInstance.nativeShare.subscribe(shared);
    await clickSettled(fixture, trigger(fixture));
    expect(shared).not.toHaveBeenCalled();
    nat.restore();
  });
});

describe("ShareChooser — keyboard and dismissal (§7.15–§7.19)", () => {
  async function openList(
    inputs: Record<string, unknown> = { copyLabel: "Copy link" },
  ): Promise<ComponentFixture<ShareChooser>> {
    const fixture = mount(inputs);
    await clickSettled(fixture, trigger(fixture));
    return fixture;
  }

  test("§7.15 opening moves focus to the first item", async () => {
    const fixture = await openList();
    expect(document.activeElement).toBe(items(fixture)[0]);
  });

  test("§7.15 ArrowDown on the closed button opens and focuses the first item", async () => {
    const fixture = mount();
    press(fixture, trigger(fixture), "ArrowDown");
    await flush();
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    expect(document.activeElement?.className).toContain("share-chooser-target");
  });

  test("§7.15 ArrowUp on the closed button opens and focuses the last item", async () => {
    const fixture = mount({ copyLabel: "Copy link" });
    press(fixture, trigger(fixture), "ArrowUp");
    await flush();
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    expect(document.activeElement?.className).toContain("share-chooser-copy");
  });

  test("§7.16 ArrowDown moves focus down the list", async () => {
    const fixture = await openList();
    const all = items(fixture);
    press(fixture, list(fixture), "ArrowDown");
    expect(document.activeElement).toBe(all[1]);
  });

  test("§7.16 ArrowUp moves focus up the list", async () => {
    const fixture = await openList();
    const all = items(fixture);
    press(fixture, list(fixture), "ArrowDown");
    press(fixture, list(fixture), "ArrowUp");
    expect(document.activeElement).toBe(all[0]);
  });

  test("§7.16 ArrowUp clamps at the first item rather than wrapping", async () => {
    const fixture = await openList();
    const all = items(fixture);
    press(fixture, list(fixture), "ArrowUp");
    expect(document.activeElement).toBe(all[0]);
  });

  test("§7.16 ArrowDown clamps at the last item rather than wrapping", async () => {
    const fixture = await openList();
    const all = items(fixture);
    // Exactly `all.length` presses from the first item: clamping lands on
    // the last item, wrapping would land back on the first.
    for (let i = 0; i < all.length; i++) press(fixture, list(fixture), "ArrowDown");
    expect(document.activeElement).toBe(all[all.length - 1]);
  });

  test("§7.16 Home and End jump to the first and last item", async () => {
    const fixture = await openList();
    const all = items(fixture);
    press(fixture, list(fixture), "End");
    expect(document.activeElement).toBe(all[all.length - 1]);
    press(fixture, list(fixture), "Home");
    expect(document.activeElement).toBe(all[0]);
  });

  test("§7.17 Escape closes and returns focus to the button", async () => {
    const fixture = await openList();
    press(fixture, list(fixture), "Escape");
    await flush();
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    expect(trigger(fixture).getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger(fixture));
  });

  test("§7.17 Tab closes without stealing focus back to the button", async () => {
    const fixture = await openList();
    const first = items(fixture)[0];
    press(fixture, list(fixture), "Tab");
    await flush();
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  test("§7.18 choosing a destination emits share with its id and closes", async () => {
    const fixture = mount();
    const shared = vi.fn();
    fixture.componentInstance.share.subscribe(shared);
    await clickSettled(fixture, trigger(fixture));
    await clickSettled(fixture, q<HTMLElement>(fixture, '[data-target-id="linkedin"]'));
    expect(shared).toHaveBeenCalledWith({
      targetId: "linkedin",
      url: URL_UNDER_TEST,
    });
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.19 clicking outside closes the list", async () => {
    const fixture = await openList();
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.19 clicking the trigger again closes the list", async () => {
    const fixture = await openList();
    await clickSettled(fixture, trigger(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.19 focus leaving the root closes the list", async () => {
    const fixture = await openList();
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    list(fixture).dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
    );
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    outside.remove();
  });

  test("§7.19 focus moving within the root keeps the list open", async () => {
    const fixture = await openList();
    const all = items(fixture);
    list(fixture).dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: all[1] }),
    );
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
  });
});

describe("ShareChooser — url resolution (§7.20–§7.21)", () => {
  test("§7.20 an explicit url input wins", async () => {
    const fixture = mount();
    await clickSettled(fixture, trigger(fixture));
    expect(links(fixture)[0].getAttribute("href")).toContain(
      encodeURIComponent(URL_UNDER_TEST),
    );
  });

  test("§7.21 with no url input it falls back to the current page URL", async () => {
    const fixture = mount({ url: "" });
    await clickSettled(fixture, trigger(fixture));
    expect(links(fixture)[0].getAttribute("href")).toContain(
      encodeURIComponent(location.href),
    );
  });

  test("§7.21 the resolved url is what share reports", async () => {
    const fixture = mount({ url: "" });
    const shared = vi.fn();
    fixture.componentInstance.share.subscribe(shared);
    await clickSettled(fixture, trigger(fixture));
    await clickSettled(fixture, q<HTMLElement>(fixture, '[data-target-id="mastodon"]'));
    expect(shared).toHaveBeenCalledWith({ targetId: "mastodon", url: location.href });
  });
});

@Component({
  standalone: true,
  imports: [ShareChooser, ShareChooserIcon],
  template: `
    <lily-share-chooser label="Share" [targets]="targets" [url]="url">
      <ng-template lilyShareChooserIcon let-args>
        <span
          data-testid="custom"
          [attr.data-open]="args.open"
          [attr.data-url]="args.url"
          >custom glyph</span
        >
      </ng-template>
    </lily-share-chooser>
  `,
})
class IconTemplateHost {
  readonly targets = TARGETS;
  readonly url = URL_UNDER_TEST;
}

describe("ShareChooser — custom glyph template (§7.22)", () => {
  test("§7.22 a projected ng-template replaces the glyph and receives ChildArgs", async () => {
    const fixture = TestBed.createComponent(IconTemplateHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    await flush();
    fixture.detectChanges();

    const custom = q<HTMLElement>(fixture, '[data-testid="custom"]');
    expect(custom).toBeTruthy();
    // The custom glyph replaces the default ➤ inside the trigger.
    expect(custom.closest("button")?.className).toContain("share-chooser-button");
    expect(q(fixture, ".share-chooser-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-url")).toBe(URL_UNDER_TEST);
  });

  test("§7.22 the ChildArgs open flag tracks the list state", async () => {
    const fixture = TestBed.createComponent(IconTemplateHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    await clickSettled(fixture, trigger(fixture));
    expect(q<HTMLElement>(fixture, '[data-testid="custom"]').getAttribute("data-open")).toBe(
      "true",
    );
  });
});
