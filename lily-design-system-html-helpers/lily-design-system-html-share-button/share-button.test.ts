import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
    ShareButton,
    canCopy,
    canShareNatively,
    nextShareButtonId,
    RIGHTWARDS_ARROW_WITH_HOOK,
    type ShareButtonShareDetail,
    type ShareButtonUrlDetail,
    type ShareTarget,
} from "./share-button.js";

// Ensure the custom element is registered exactly once for the suite.
if (typeof customElements !== "undefined" && !customElements.get("share-button")) {
    customElements.define("share-button", ShareButton);
}

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

type MountOptions = {
    targets?: ShareTarget[];
    tag?: string;
};

function mount(
    attrs: Record<string, string>,
    { targets = TARGETS, tag = "share-button" }: MountOptions = {},
): ShareButton {
    const el = document.createElement(tag) as ShareButton;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    // `targets` is property-only: ShareTarget.href is a function, so there
    // is no honest attribute encoding for it. Assigning before append means
    // the first render already has them.
    el.targets = targets;
    document.body.appendChild(el);
    return el;
}

function trigger(): HTMLButtonElement {
    return document.body.querySelector<HTMLButtonElement>(".share-button-trigger")!;
}

function list(): HTMLUListElement {
    return document.body.querySelector<HTMLUListElement>(".share-button-list")!;
}

function links(): HTMLAnchorElement[] {
    return [...document.body.querySelectorAll<HTMLAnchorElement>(".share-button-target")];
}

function copyItem(): HTMLButtonElement | null {
    return document.body.querySelector<HTMLButtonElement>(".share-button-copy");
}

function statusRegion(): HTMLParagraphElement {
    return document.body.querySelector<HTMLParagraphElement>(".share-button-status")!;
}

function items(): HTMLElement[] {
    return [
        ...list().querySelectorAll<HTMLElement>(".share-button-target, .share-button-copy"),
    ];
}

function press(el: Element, key: string): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function click(el: Element): void {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
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

// jsdom does not implement navigation, and the destinations are real
// links with target="_blank". Swallow the default so clicking one in a
// test does not spray "Not implemented: navigation" at the console. This
// is a harness concern only — the links are genuinely navigable in a
// browser, which is the whole point of §7.3.
function swallowNavigation(event: MouseEvent): void {
    if ((event.target as HTMLElement | null)?.closest?.("a[href]")) event.preventDefault();
}

beforeEach(() => {
    document.body.replaceChildren();
    document.addEventListener("click", swallowNavigation);
    // jsdom ships neither API; make their absence explicit rather than
    // assumed, so "no native sheet" and "no clipboard" are real states.
    delete (navigator as any).share;
    delete (navigator as any).clipboard;
});

afterEach(() => {
    document.removeEventListener("click", swallowNavigation);
    document.body.replaceChildren();
    delete (navigator as any).share;
    delete (navigator as any).clipboard;
});

describe("<share-button> — pure helpers", () => {
    test("nextShareButtonId mints unique, prefixed ids", () => {
        const a = nextShareButtonId();
        const b = nextShareButtonId();
        expect(a).toMatch(/^share-button-\d+$/);
        expect(b).toMatch(/^share-button-\d+$/);
        expect(a).not.toBe(b);
    });

    test("RIGHTWARDS_ARROW_WITH_HOOK is U+21AA", () => {
        expect(RIGHTWARDS_ARROW_WITH_HOOK).toBe("↪");
        expect(RIGHTWARDS_ARROW_WITH_HOOK.codePointAt(0)).toBe(0x21aa);
    });

    test("canCopy reflects navigator.clipboard.writeText", () => {
        expect(canCopy()).toBe(false);
        const clip = stubClipboard();
        expect(canCopy()).toBe(true);
        clip.restore();
    });
});

describe("<share-button> — markup contract (§7.1–§7.6)", () => {
    test("§7.1 renders a disclosure button controlling a list", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        const root = document.body.querySelector("div.share-button")!;
        expect(root.tagName).toBe("DIV");
        const btn = trigger();
        expect(btn.tagName).toBe("BUTTON");
        expect(btn.getAttribute("type")).toBe("button");
        expect(btn.getAttribute("aria-label")).toBe("Share");
        expect(btn.getAttribute("aria-expanded")).toBe("false");
        const listId = btn.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.tagName).toBe("UL");
        expect(document.getElementById(listId!)).toBe(list());
    });

    test("§7.1 the trigger class is share-button-trigger, not -button", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        // The one deliberate bend in the {helper}-button convention:
        // `.share-button-button` reads badly.
        expect(document.body.querySelector(".share-button-trigger")).not.toBeNull();
        expect(document.body.querySelector(".share-button-button")).toBeNull();
    });

    test("§7.1 the button renders ↪, hidden from assistive tech", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        const icon = document.body.querySelector<HTMLElement>(".share-button-icon")!;
        // U+21AA RIGHTWARDS ARROW WITH HOOK
        expect(icon.textContent).toBe("↪");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.closest("button")).toBe(trigger());
    });

    test("§7.2 the list is hidden until the button is activated", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        click(trigger());
        await flush();
        expect(list().hasAttribute("hidden")).toBe(false);
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.3 destinations are real links, not role=menuitem", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        click(trigger());
        const all = links();
        expect(all.length).toBe(2);
        for (const a of all) {
            expect(a.tagName).toBe("A");
            // Real link semantics are the point: no role override, and safe
            // cross-origin defaults.
            expect(a.getAttribute("role")).toBeNull();
            expect(a.getAttribute("target")).toBe("_blank");
            expect(a.getAttribute("rel")).toBe("noopener noreferrer");
            expect(a.closest("li")?.className).toBe("share-button-list-item");
        }
    });

    test("§7.3 newTab:false drops target=_blank but keeps rel", async () => {
        mount(
            { label: "Share", url: URL_UNDER_TEST },
            {
                targets: [
                    { id: "same", label: "Same tab", href: (u) => u, newTab: false },
                    { id: "new", label: "New tab", href: (u) => u },
                ],
            },
        );
        await flush();
        click(trigger());
        expect(links()[0].hasAttribute("target")).toBe(false);
        expect(links()[0].getAttribute("rel")).toBe("noopener noreferrer");
        expect(links()[1].getAttribute("target")).toBe("_blank");
    });

    test("§7.4 each destination's href comes from its own href()", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST, "share-title": "Hello" });
        await flush();
        click(trigger());
        expect(links()[0].getAttribute("href")).toBe(
            `https://mastodon.test/share?url=${encodeURIComponent(URL_UNDER_TEST)}&text=${encodeURIComponent("Hello")}`,
        );
        expect(links()[1].getAttribute("href")).toBe(
            `https://linkedin.test/sharing?url=${encodeURIComponent(URL_UNDER_TEST)}`,
        );
    });

    test("§7.4 href() receives share-title and text", async () => {
        const seen: Array<[string, string, string]> = [];
        mount(
            { label: "Share", url: URL_UNDER_TEST, "share-title": "T", text: "B" },
            {
                targets: [
                    {
                        id: "probe",
                        label: "Probe",
                        href: (u, t, x) => {
                            seen.push([u, t, x]);
                            return "https://probe.test/";
                        },
                    },
                ],
            },
        );
        await flush();
        expect(seen.at(-1)).toEqual([URL_UNDER_TEST, "T", "B"]);
    });

    test("§7.5 the copy item renders only when copy-label is supplied", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        click(trigger());
        expect(copyItem()).toBeNull();

        document.body.replaceChildren();
        mount({ label: "Share", url: URL_UNDER_TEST, "copy-label": "Copy link" });
        await flush();
        click(trigger());
        const copy = copyItem()!;
        expect(copy.tagName).toBe("BUTTON");
        expect(copy.getAttribute("type")).toBe("button");
        expect(copy.textContent?.trim()).toBe("Copy link");
    });

    test("§7.6 the status region is present, polite, and silent on load", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        const status = statusRegion();
        expect(status.tagName).toBe("P");
        expect(status.getAttribute("aria-live")).toBe("polite");
        expect(status.textContent?.trim()).toBe("");
    });
});

describe("<share-button> — copy to clipboard (§7.7–§7.10)", () => {
    test("§7.7 copying writes the URL and fires onCopy", async () => {
        const clip = stubClipboard();
        const onCopy = vi.fn();
        const el = mount({
            label: "Share",
            url: URL_UNDER_TEST,
            "copy-label": "Copy link",
        });
        el.onCopy = onCopy;
        await flush();
        click(trigger());
        click(copyItem()!);
        await flush();
        expect(clip.writes).toEqual([URL_UNDER_TEST]);
        expect(onCopy).toHaveBeenCalledWith(URL_UNDER_TEST);
        clip.restore();
    });

    test("§7.7 copying also dispatches a bubbling `copy` CustomEvent", async () => {
        const clip = stubClipboard();
        const seen: ShareButtonUrlDetail[] = [];
        document.body.addEventListener("copy", (e) => {
            seen.push((e as CustomEvent<ShareButtonUrlDetail>).detail);
        });
        mount({ label: "Share", url: URL_UNDER_TEST, "copy-label": "Copy link" });
        await flush();
        click(trigger());
        click(copyItem()!);
        await flush();
        expect(seen.at(-1)).toEqual({ url: URL_UNDER_TEST });
        clip.restore();
    });

    test("§7.8 a successful copy announces copied-label and closes the list", async () => {
        const clip = stubClipboard();
        mount({
            label: "Share",
            url: URL_UNDER_TEST,
            "copy-label": "Copy link",
            "copied-label": "Link copied",
        });
        await flush();
        click(trigger());
        click(copyItem()!);
        await flush();
        expect(statusRegion().textContent?.trim()).toBe("Link copied");
        expect(list().hasAttribute("hidden")).toBe(true);
        clip.restore();
    });

    test("§7.9 a failed copy announces copy-failed-label and does not throw", async () => {
        const clip = stubClipboard(false);
        mount({
            label: "Share",
            url: URL_UNDER_TEST,
            "copy-label": "Copy link",
            "copied-label": "Link copied",
            "copy-failed-label": "Could not copy",
        });
        await flush();
        click(trigger());
        click(copyItem()!);
        await flush();
        expect(statusRegion().textContent?.trim()).toBe("Could not copy");
        expect(list().hasAttribute("hidden")).toBe(true);
        clip.restore();
    });

    test("§7.10 an absent clipboard API is treated as a failure, not a crash", async () => {
        // No stub: jsdom has no navigator.clipboard at all.
        expect(canCopy()).toBe(false);
        const onCopy = vi.fn();
        const el = mount({
            label: "Share",
            url: URL_UNDER_TEST,
            "copy-label": "Copy link",
            "copy-failed-label": "Could not copy",
        });
        el.onCopy = onCopy;
        await flush();
        click(trigger());
        click(copyItem()!);
        await flush();
        expect(statusRegion().textContent?.trim()).toBe("Could not copy");
        expect(onCopy).not.toHaveBeenCalled();
    });
});

describe("<share-button> — native share sheet (§7.11–§7.14)", () => {
    test("§7.11 canShareNatively reflects navigator.share", () => {
        expect(canShareNatively()).toBe(false);
        const nat = stubNativeShare();
        expect(canShareNatively()).toBe(true);
        nat.restore();
    });

    test("§7.12 strategy=auto uses the sheet when available, and skips the list", async () => {
        const nat = stubNativeShare();
        const onNativeShare = vi.fn();
        const seen: ShareButtonUrlDetail[] = [];
        document.body.addEventListener("nativeshare", (e) => {
            seen.push((e as CustomEvent<ShareButtonUrlDetail>).detail);
        });
        const el = mount({
            label: "Share",
            url: URL_UNDER_TEST,
            "share-title": "Hello",
            text: "Body",
        });
        el.onNativeShare = onNativeShare;
        await flush();
        click(trigger());
        await flush();
        expect(nat.calls).toEqual([{ url: URL_UNDER_TEST, title: "Hello", text: "Body" }]);
        expect(onNativeShare).toHaveBeenCalledWith(URL_UNDER_TEST);
        expect(seen.at(-1)).toEqual({ url: URL_UNDER_TEST });
        // The list must NOT also open.
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
        nat.restore();
    });

    test("§7.13 strategy=auto falls back to the list with no native sheet", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        click(trigger());
        await flush();
        expect(list().hasAttribute("hidden")).toBe(false);
    });

    test("§7.13 strategy=list ignores an available native sheet", async () => {
        const nat = stubNativeShare();
        mount({ label: "Share", url: URL_UNDER_TEST, strategy: "list" });
        await flush();
        click(trigger());
        await flush();
        expect(nat.calls.length).toBe(0);
        expect(list().hasAttribute("hidden")).toBe(false);
        nat.restore();
    });

    test("§7.13 strategy=native attempts the sheet and does not open the list", async () => {
        const nat = stubNativeShare();
        mount({ label: "Share", url: URL_UNDER_TEST, strategy: "native" });
        await flush();
        click(trigger());
        await flush();
        expect(nat.calls.length).toBe(1);
        expect(list().hasAttribute("hidden")).toBe(true);
        nat.restore();
    });

    test("§7.14 a dismissed share sheet does not fall through to the list", async () => {
        // navigator.share rejects when the user dismisses the sheet. Opening
        // the list then would resurrect UI the user just dismissed.
        const nat = stubNativeShare("reject");
        const onNativeShare = vi.fn();
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        el.onNativeShare = onNativeShare;
        await flush();
        click(trigger());
        await flush();
        expect(nat.calls.length).toBe(1);
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
        // A dismissal is not a successful share, so the callback stays quiet.
        expect(onNativeShare).not.toHaveBeenCalled();
        nat.restore();
    });
});

describe("<share-button> — keyboard and dismissal (§7.15–§7.19)", () => {
    async function openList(): Promise<ShareButton> {
        const el = mount({
            label: "Share",
            url: URL_UNDER_TEST,
            "copy-label": "Copy link",
        });
        await flush();
        click(trigger());
        await flush();
        return el;
    }

    test("§7.15 opening moves focus to the first item", async () => {
        await openList();
        expect(document.activeElement).toBe(items()[0]);
        expect(document.activeElement?.className).toContain("share-button-target");
    });

    test("§7.15 ArrowDown on the closed button opens and focuses the first item", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        press(trigger(), "ArrowDown");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(false);
        expect(document.activeElement).toBe(items()[0]);
    });

    test("§7.15 ArrowUp on the closed button opens and focuses the last item", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST, "copy-label": "Copy link" });
        await flush();
        press(trigger(), "ArrowUp");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(false);
        expect(document.activeElement?.className).toContain("share-button-copy");
        expect(document.activeElement).toBe(items().at(-1));
    });

    test("§7.16 arrows move focus between items and clamp at the ends", async () => {
        await openList();
        const all = items();
        expect(all.length).toBe(3);
        press(list(), "ArrowDown");
        expect(document.activeElement).toBe(all[1]);
        press(list(), "ArrowUp");
        expect(document.activeElement).toBe(all[0]);
        // Clamps rather than wrapping.
        press(list(), "ArrowUp");
        expect(document.activeElement).toBe(all[0]);
        press(list(), "End");
        press(list(), "ArrowDown");
        expect(document.activeElement).toBe(all[all.length - 1]);
    });

    test("§7.16 Home and End jump to the first and last item", async () => {
        await openList();
        const all = items();
        press(list(), "End");
        expect(document.activeElement).toBe(all[all.length - 1]);
        press(list(), "Home");
        expect(document.activeElement).toBe(all[0]);
    });

    test("§7.17 Escape closes and returns focus to the button", async () => {
        await openList();
        press(list(), "Escape");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(trigger());
    });

    test("§7.17 Tab closes the list without stealing focus back", async () => {
        await openList();
        press(list(), "Tab");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(trigger());
    });

    test("§7.18 choosing a destination fires onShare with its id and closes", async () => {
        const onShare = vi.fn();
        const seen: ShareButtonShareDetail[] = [];
        document.body.addEventListener("share", (e) => {
            seen.push((e as CustomEvent<ShareButtonShareDetail>).detail);
        });
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        el.onShare = onShare;
        await flush();
        click(trigger());
        click(document.body.querySelector('[data-target-id="linkedin"]')!);
        await flush();
        expect(onShare).toHaveBeenCalledWith("linkedin", URL_UNDER_TEST);
        expect(seen.at(-1)).toEqual({ targetId: "linkedin", url: URL_UNDER_TEST });
        expect(list().hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 clicking outside closes the list", async () => {
        await openList();
        click(document.body);
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 focus leaving the root closes the list", async () => {
        await openList();
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        const from = items()[0];
        // Focus really has to move: the handler defers to a microtask and
        // re-reads document.activeElement, so a focusout event whose focus
        // never actually left is correctly ignored.
        outside.focus();
        from.dispatchEvent(
            new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
        );
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 focus moving within the root keeps the list open", async () => {
        await openList();
        const all = items();
        all[1].focus();
        all[0].dispatchEvent(
            new FocusEvent("focusout", { bubbles: true, relatedTarget: all[1] }),
        );
        await flush();
        expect(list().hasAttribute("hidden")).toBe(false);
    });
});

describe("<share-button> — url resolution and custom glyph (§7.20–§7.22)", () => {
    test("§7.20 an explicit url attribute wins", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        click(trigger());
        expect(links()[0].getAttribute("href")).toContain(encodeURIComponent(URL_UNDER_TEST));
    });

    test("§7.21 with no url attribute it falls back to the current page URL", async () => {
        const el = mount({ label: "Share" });
        await flush();
        click(trigger());
        expect(links()[0].getAttribute("href")).toContain(encodeURIComponent(location.href));
        expect(el.currentUrl()).toBe(location.href);
    });

    test("§7.22 renderButtonContent replaces the glyph and sees open + url", async () => {
        // Light DOM has no <slot>, so subclassing stands in for the
        // `children` snippet the other frameworks expose. It receives the
        // same information those pass as ChildArgs.
        class CustomShareButton extends ShareButton {
            renderButtonContent(): Node {
                const span = document.createElement("span");
                span.setAttribute("data-testid", "custom");
                span.setAttribute("data-open", String(this.open));
                span.setAttribute("data-url", this.currentUrl());
                span.textContent = "custom glyph";
                return span;
            }
        }
        if (!customElements.get("custom-share-button")) {
            customElements.define("custom-share-button", CustomShareButton);
        }

        mount({ label: "Share", url: URL_UNDER_TEST }, { tag: "custom-share-button" });
        await flush();
        const custom = document.body.querySelector<HTMLElement>('[data-testid="custom"]')!;
        // The custom node replaced the glyph...
        expect(document.body.querySelector(".share-button-icon")).toBeNull();
        expect(custom.closest("button")).toBe(trigger());
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-url")).toBe(URL_UNDER_TEST);
        // ...and the base class's aria wiring survived.
        expect(trigger().getAttribute("aria-label")).toBe("Share");
        expect(document.getElementById(trigger().getAttribute("aria-controls")!)).toBe(list());
    });

    test("§7.22 renderButtonContent re-runs on open, so it stays current", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST }, { tag: "custom-share-button" });
        await flush();
        expect(
            document.body.querySelector('[data-testid="custom"]')!.getAttribute("data-open"),
        ).toBe("false");
        click(trigger());
        await flush();
        expect(
            document.body.querySelector('[data-testid="custom"]')!.getAttribute("data-open"),
        ).toBe("true");
    });
});

describe("<share-button> — HTML custom-element surface", () => {
    test("targets is property-only and re-renders the list", async () => {
        const el = mount({ label: "Share", url: URL_UNDER_TEST }, { targets: [] });
        await flush();
        expect(links().length).toBe(0);
        // No attribute encoding exists for a function-valued href.
        expect(el.hasAttribute("targets")).toBe(false);
        el.targets = TARGETS;
        await flush();
        click(trigger());
        expect(links().length).toBe(2);
        expect(el.targets).toEqual(TARGETS);
    });

    test("targets getter returns a copy, so callers cannot mutate internals", async () => {
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        el.targets.pop();
        expect(el.targets.length).toBe(2);
    });

    test("attributes and properties mirror each other", async () => {
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        el.label = "Share this page";
        expect(el.getAttribute("label")).toBe("Share this page");
        expect(trigger().getAttribute("aria-label")).toBe("Share this page");

        el.copyLabel = "Copy";
        expect(el.getAttribute("copy-label")).toBe("Copy");
        click(trigger());
        expect(copyItem()?.textContent).toBe("Copy");

        el.strategy = "list";
        expect(el.getAttribute("strategy")).toBe("list");
        expect(el.strategy).toBe("list");
    });

    test("strategy falls back to auto for a missing or bogus value", async () => {
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        expect(el.strategy).toBe("auto");
        el.setAttribute("strategy", "nonsense");
        expect(el.strategy).toBe("auto");
    });

    test("share-title is used instead of the global title attribute", async () => {
        // `title` is a global HTML attribute; claiming it would paint a
        // tooltip over the whole control, so the share title is
        // `share-title` / `el.shareTitle`.
        const el = mount({ label: "Share", url: URL_UNDER_TEST, title: "tooltip" });
        await flush();
        expect(el.shareTitle).toBe("");
        el.shareTitle = "Real title";
        expect(el.getAttribute("share-title")).toBe("Real title");
        expect(el.title).toBe("tooltip");
        click(trigger());
        expect(links()[0].getAttribute("href")).toContain(encodeURIComponent("Real title"));
    });

    test("the class attribute lands on the rendered root, not just the host", async () => {
        mount({ label: "Share", url: URL_UNDER_TEST, class: "my-share" });
        await flush();
        const root = document.body.querySelector("div.share-button")!;
        expect(root.className).toBe("share-button my-share");
    });

    test("a url change syncs hrefs in place without destroying focus", async () => {
        // This is the #render vs #syncState split: a non-structural change
        // must not rebuild the DOM, because a rebuild while the list is
        // open would blow away focus.
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        click(trigger());
        const before = items()[0];
        expect(document.activeElement).toBe(before);

        el.url = "https://example.test/other";
        await flush();
        expect(document.activeElement).toBe(before);
        expect(items()[0]).toBe(before);
        expect(list().hasAttribute("hidden")).toBe(false);
        expect(links()[0].getAttribute("href")).toContain(
            encodeURIComponent("https://example.test/other"),
        );
    });

    test("a structural change closes the list rather than orphaning focus", async () => {
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        click(trigger());
        expect(list().hasAttribute("hidden")).toBe(false);
        // copy-label gates which elements exist, so it rebuilds.
        el.copyLabel = "Copy link";
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(el.open).toBe(false);
    });

    test("openList and closeList are public and drive the same state", async () => {
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        el.openList();
        expect(el.open).toBe(true);
        expect(list().hasAttribute("hidden")).toBe(false);
        el.closeList();
        expect(el.open).toBe(false);
        expect(document.activeElement).toBe(trigger());
    });

    test("openList is a no-op with nothing to show", async () => {
        const el = mount({ label: "Share", url: URL_UNDER_TEST }, { targets: [] });
        await flush();
        el.openList();
        expect(el.open).toBe(false);
        expect(list().hasAttribute("hidden")).toBe(true);
    });

    test("nothing is written to localStorage or the document root", async () => {
        const clip = stubClipboard();
        const before = document.documentElement.outerHTML.length;
        mount({
            label: "Share",
            url: URL_UNDER_TEST,
            "copy-label": "Copy link",
            "copied-label": "Copied",
        });
        await flush();
        click(trigger());
        click(copyItem()!);
        await flush();
        // This helper owns an action, not a preference: no persistence and
        // no data-* on the document root.
        expect(localStorage.length).toBe(0);
        expect(document.documentElement.hasAttribute("data-share")).toBe(false);
        expect(document.documentElement.outerHTML.length).toBeGreaterThan(before - 1);
        clip.restore();
    });

    test("disconnecting removes the document click listener", async () => {
        const el = mount({ label: "Share", url: URL_UNDER_TEST });
        await flush();
        click(trigger());
        expect(el.open).toBe(true);
        el.remove();
        // No listener remains, so an outside click cannot reach into a
        // detached instance.
        click(document.body);
        expect(el.open).toBe(true);
    });

    test("module is import-safe under SSR", async () => {
        const original = (globalThis as any).customElements;
        delete (globalThis as any).customElements;
        try {
            const mod = await import("./index.js");
            expect(mod.ShareButton).toBeDefined();
            expect(mod.RIGHTWARDS_ARROW_WITH_HOOK).toBe("↪");
        } finally {
            (globalThis as any).customElements = original;
        }
    });
});
