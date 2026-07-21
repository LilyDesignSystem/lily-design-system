// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    canCopy,
    canShareNatively,
    initShareButton,
    nextShareButtonId,
    RIGHTWARDS_ARROW_WITH_HOOK,
    shareTargetHref,
} from "./share-button.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve `./share-button.njk` from this dir.
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});

const URL_UNDER_TEST = "https://example.test/article";

/**
 * Macro targets carry pre-resolved href STRINGS — the documented
 * Nunjucks deviation (spec §3.3). These are what the consumer's own
 * URL-builder would have produced server-side.
 */
const TARGETS = [
    {
        id: "mastodon",
        label: "Mastodon",
        href: `https://mastodon.test/share?url=${encodeURIComponent(URL_UNDER_TEST)}&text=${encodeURIComponent("Hello")}`,
    },
    {
        id: "linkedin",
        label: "LinkedIn",
        href: `https://linkedin.test/sharing?url=${encodeURIComponent(URL_UNDER_TEST)}`,
    },
];

function renderMacro(opts: Record<string, unknown>): string {
    const src =
        `{% from "./share-button.njk" import shareButton %}` +
        `{{ shareButton(opts) }}`;
    return env.renderString(src, { opts });
}

function renderMacroWithCaller(
    opts: Record<string, unknown>,
    body: string,
): string {
    const src =
        `{% from "./share-button.njk" import shareButton %}` +
        `{% call shareButton(opts) %}${body}{% endcall %}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-share-button-root]",
    ) as HTMLElement;
}

type Parts = {
    root: HTMLElement;
    trigger: HTMLButtonElement;
    list: HTMLElement;
    status: HTMLElement;
    targets: HTMLAnchorElement[];
    copy: HTMLButtonElement | null;
    api: ReturnType<typeof initShareButton>;
};

/** Render + mount + init in one step, returning the DOM parts. */
function setup(
    opts: Record<string, unknown> = {},
    initOpts: Record<string, unknown> = {},
): Parts {
    const root = mountIntoBody(
        renderMacro({ label: "Share", targets: TARGETS, ...opts }),
    );
    const api = initShareButton(root, initOpts);
    return {
        root,
        trigger: root.querySelector(
            ".share-button-trigger",
        ) as HTMLButtonElement,
        list: root.querySelector(".share-button-list") as HTMLElement,
        status: root.querySelector(".share-button-status") as HTMLElement,
        targets: Array.from(
            root.querySelectorAll<HTMLAnchorElement>(".share-button-target"),
        ),
        copy: root.querySelector(".share-button-copy"),
        api,
    };
}

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function click(el: Element): void {
    el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
}

function keydown(el: Element, key: string): void {
    el.dispatchEvent(
        new window.KeyboardEvent("keydown", { key, bubbles: true }),
    );
}

/** Install a fake async clipboard; returns the writes and a restore fn. */
function stubClipboard(succeed = true): {
    writes: string[];
    restore: () => void;
} {
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

beforeEach(() => {
    // jsdom ships neither API; make their absence explicit rather than
    // assumed.
    delete (navigator as any).share;
    delete (navigator as any).clipboard;
    document.body.innerHTML = "";
});

afterEach(() => {
    delete (navigator as any).share;
    delete (navigator as any).clipboard;
});

// =====================================================================
// §7.1–§7.6 — markup contract
// =====================================================================

describe("ShareButton — markup contract (§7.1–§7.6)", () => {
    test("§7.1 renders a disclosure button controlling a list", () => {
        const { trigger, list } = setup();
        expect(trigger.tagName).toBe("BUTTON");
        expect(trigger.getAttribute("type")).toBe("button");
        expect(trigger.getAttribute("aria-label")).toBe("Share");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        const listId = trigger.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)).toBe(list);
        expect(list.tagName).toBe("UL");
    });

    test("§7.1 the button renders ↪, hidden from assistive tech", () => {
        const { root } = setup();
        const icon = root.querySelector(".share-button-icon") as HTMLElement;
        // U+21AA RIGHTWARDS ARROW WITH HOOK, emitted as &#8618;
        expect(icon.textContent).toBe("↪");
        expect(RIGHTWARDS_ARROW_WITH_HOOK).toBe("↪");
        expect(RIGHTWARDS_ARROW_WITH_HOOK.codePointAt(0)).toBe(0x21aa);
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.1 the trigger class is share-button-trigger, not -button", () => {
        const { root, trigger } = setup();
        expect(trigger.className).toBe("share-button-trigger");
        expect(root.querySelector(".share-button-button")).toBeNull();
    });

    test("§7.2 the list is hidden until the button is activated", () => {
        const { trigger, list } = setup();
        expect(list.hasAttribute("hidden")).toBe(true);
        click(trigger);
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.3 destinations are real links, not role=menuitem", () => {
        const { targets } = setup();
        expect(targets.length).toBe(2);
        for (const a of targets) {
            expect(a.tagName).toBe("A");
            // Real link semantics are the point: no role override, and
            // safe cross-origin defaults.
            expect(a.getAttribute("role")).toBeNull();
            expect(a.getAttribute("target")).toBe("_blank");
            expect(a.getAttribute("rel")).toBe("noopener noreferrer");
        }
    });

    test("§7.3 each destination sits in its own list item", () => {
        const { root, targets } = setup();
        const lis = root.querySelectorAll(".share-button-list-item");
        expect(lis.length).toBe(2);
        for (const a of targets) {
            expect(a.parentElement?.className).toBe("share-button-list-item");
            expect(a.parentElement?.tagName).toBe("LI");
        }
    });

    test("§7.4 each destination's href is the string the consumer supplied", () => {
        const { targets } = setup();
        expect(targets[0].getAttribute("href")).toBe(TARGETS[0].href);
        expect(targets[1].getAttribute("href")).toBe(TARGETS[1].href);
        expect(targets[0].getAttribute("data-target-id")).toBe("mastodon");
        expect(targets[1].getAttribute("data-target-id")).toBe("linkedin");
    });

    test("§7.4 labels come from the consumer, and no endpoint ships", () => {
        const { targets } = setup();
        expect(targets[0].textContent?.trim()).toBe("Mastodon");
        // The package must contain no built-in social endpoints: every
        // URL in the output traces back to what the test supplied.
        const html = renderMacro({ label: "Share", targets: [] });
        expect(html).not.toMatch(/https?:\/\//);
    });

    test("§7.5 the copy item renders only when copyLabel is supplied", () => {
        expect(setup().copy).toBeNull();
        const { copy } = setup({ copyLabel: "Copy link" });
        expect(copy).not.toBeNull();
        expect(copy!.tagName).toBe("BUTTON");
        expect(copy!.getAttribute("type")).toBe("button");
        expect(copy!.textContent?.trim()).toBe("Copy link");
    });

    test("§7.6 the status region is present, polite, and silent on load", () => {
        const { status } = setup({ copyLabel: "Copy link" });
        expect(status.tagName).toBe("P");
        expect(status.getAttribute("aria-live")).toBe("polite");
        expect(status.textContent?.trim()).toBe("");
    });
});

// =====================================================================
// §7.7–§7.10 — copy to clipboard
// =====================================================================

describe("ShareButton — copy to clipboard (§7.7–§7.10)", () => {
    test("§7.7 copying writes the URL and fires onCopy", async () => {
        const clip = stubClipboard();
        const onCopy = vi.fn();
        const { trigger, copy } = setup(
            { url: URL_UNDER_TEST, copyLabel: "Copy link" },
            { onCopy },
        );
        click(trigger);
        click(copy!);
        await flush();
        expect(clip.writes).toEqual([URL_UNDER_TEST]);
        expect(onCopy).toHaveBeenCalledWith(URL_UNDER_TEST);
        clip.restore();
    });

    test("§7.8 a successful copy announces copiedLabel and closes the list", async () => {
        const clip = stubClipboard();
        const { trigger, copy, list, status } = setup({
            url: URL_UNDER_TEST,
            copyLabel: "Copy link",
            copiedLabel: "Link copied",
        });
        click(trigger);
        click(copy!);
        await flush();
        expect(status.textContent?.trim()).toBe("Link copied");
        expect(list.hasAttribute("hidden")).toBe(true);
        clip.restore();
    });

    test("§7.9 a failed copy announces copyFailedLabel and does not throw", async () => {
        const clip = stubClipboard(false);
        const { trigger, copy, list, status } = setup({
            url: URL_UNDER_TEST,
            copyLabel: "Copy link",
            copiedLabel: "Link copied",
            copyFailedLabel: "Could not copy",
        });
        click(trigger);
        expect(() => click(copy!)).not.toThrow();
        await flush();
        expect(status.textContent?.trim()).toBe("Could not copy");
        expect(list.hasAttribute("hidden")).toBe(true);
        clip.restore();
    });

    test("§7.10 an absent clipboard API is treated as a failure, not a crash", async () => {
        // No stub: jsdom has no navigator.clipboard at all.
        expect(canCopy()).toBe(false);
        const { trigger, copy, status } = setup({
            url: URL_UNDER_TEST,
            copyLabel: "Copy link",
            copyFailedLabel: "Could not copy",
        });
        click(trigger);
        expect(() => click(copy!)).not.toThrow();
        await flush();
        expect(status.textContent?.trim()).toBe("Could not copy");
    });

    test("§7.10 copy labels may also be supplied at init time", async () => {
        const clip = stubClipboard();
        const { trigger, copy, status } = setup(
            { url: URL_UNDER_TEST, copyLabel: "Copy link" },
            { copiedLabel: "Copied via init" },
        );
        click(trigger);
        click(copy!);
        await flush();
        expect(status.textContent?.trim()).toBe("Copied via init");
        clip.restore();
    });
});

// =====================================================================
// §7.11–§7.14 — native share sheet
// =====================================================================

describe("ShareButton — native share sheet (§7.11–§7.14)", () => {
    test("§7.11 canShareNatively reflects navigator.share", () => {
        expect(canShareNatively()).toBe(false);
        const nat = stubNativeShare();
        expect(canShareNatively()).toBe(true);
        nat.restore();
    });

    test("§7.12 strategy=auto uses the sheet when available, and skips the list", async () => {
        const nat = stubNativeShare();
        const onNativeShare = vi.fn();
        const { trigger, list } = setup(
            { url: URL_UNDER_TEST, title: "Hello", text: "Body" },
            { onNativeShare },
        );
        click(trigger);
        await flush();
        expect(nat.calls).toEqual([
            { url: URL_UNDER_TEST, title: "Hello", text: "Body" },
        ]);
        expect(onNativeShare).toHaveBeenCalledWith(URL_UNDER_TEST);
        // The list must NOT also open.
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        nat.restore();
    });

    test("§7.13 strategy=auto falls back to the list with no native sheet", async () => {
        const { trigger, list } = setup({ url: URL_UNDER_TEST });
        click(trigger);
        await flush();
        expect(list.hasAttribute("hidden")).toBe(false);
    });

    test("§7.13 strategy=list ignores an available native sheet", async () => {
        const nat = stubNativeShare();
        const { trigger, list } = setup({
            url: URL_UNDER_TEST,
            strategy: "list",
        });
        click(trigger);
        await flush();
        expect(nat.calls.length).toBe(0);
        expect(list.hasAttribute("hidden")).toBe(false);
        nat.restore();
    });

    test("§7.13 strategy=native always attempts the sheet", async () => {
        const nat = stubNativeShare();
        const { trigger, list } = setup({
            url: URL_UNDER_TEST,
            strategy: "native",
        });
        click(trigger);
        await flush();
        expect(nat.calls.length).toBe(1);
        expect(list.hasAttribute("hidden")).toBe(true);
        nat.restore();
    });

    test("§7.14 a dismissed share sheet does not fall through to the list", async () => {
        // navigator.share rejects when the user dismisses the sheet.
        // Opening the list then would resurrect UI the user just
        // dismissed.
        const nat = stubNativeShare("reject");
        const { trigger, list } = setup({ url: URL_UNDER_TEST });
        click(trigger);
        await flush();
        expect(nat.calls.length).toBe(1);
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        nat.restore();
    });
});

// =====================================================================
// §7.15–§7.19 — keyboard and dismissal
// =====================================================================

describe("ShareButton — keyboard and dismissal (§7.15–§7.19)", () => {
    function openList(initOpts: Record<string, unknown> = {}) {
        const parts = setup(
            { url: URL_UNDER_TEST, copyLabel: "Copy link" },
            initOpts,
        );
        click(parts.trigger);
        return parts;
    }

    function itemsOf(list: HTMLElement): HTMLElement[] {
        return Array.from(
            list.querySelectorAll<HTMLElement>(
                ".share-button-target, .share-button-copy",
            ),
        );
    }

    test("§7.15 opening moves focus to the first item", () => {
        const { list } = openList();
        expect(document.activeElement).toBe(itemsOf(list)[0]);
    });

    test("§7.15 ArrowDown on the closed trigger opens and focuses the first item", () => {
        const { trigger, list } = setup({ url: URL_UNDER_TEST });
        keydown(trigger, "ArrowDown");
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(document.activeElement).toBe(itemsOf(list)[0]);
    });

    test("§7.15 ArrowUp on the closed trigger opens and focuses the last item", () => {
        const { trigger, list } = setup({
            url: URL_UNDER_TEST,
            copyLabel: "Copy link",
        });
        keydown(trigger, "ArrowUp");
        expect(list.hasAttribute("hidden")).toBe(false);
        const all = itemsOf(list);
        expect(document.activeElement).toBe(all[all.length - 1]);
        expect(
            (document.activeElement as HTMLElement).className,
        ).toContain("share-button-copy");
    });

    test("§7.16 arrows move focus between items and clamp at the ends", () => {
        const { list } = openList();
        const all = itemsOf(list);
        keydown(list, "ArrowDown");
        expect(document.activeElement).toBe(all[1]);
        keydown(list, "ArrowUp");
        expect(document.activeElement).toBe(all[0]);
        // Clamps rather than wrapping — at the top, ArrowUp stays put.
        keydown(list, "ArrowUp");
        expect(document.activeElement).toBe(all[0]);
    });

    test("§7.16 ArrowDown clamps at the last item rather than wrapping", () => {
        const { list } = openList();
        const all = itemsOf(list);
        for (let i = 0; i < all.length + 3; i++) keydown(list, "ArrowDown");
        expect(document.activeElement).toBe(all[all.length - 1]);
    });

    test("§7.16 Home and End jump to the first and last item", () => {
        const { list } = openList();
        const all = itemsOf(list);
        keydown(list, "End");
        expect(document.activeElement).toBe(all[all.length - 1]);
        keydown(list, "Home");
        expect(document.activeElement).toBe(all[0]);
    });

    test("§7.17 Escape closes and returns focus to the trigger", () => {
        const { trigger, list } = openList();
        keydown(list, "Escape");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(trigger);
    });

    test("§7.17 Tab closes without stealing focus back to the trigger", () => {
        const { trigger, list } = openList();
        keydown(list, "Tab");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(trigger);
    });

    test("§7.18 choosing a destination fires onShare with its id and closes", () => {
        const onShare = vi.fn();
        const { trigger, list, root } = setup(
            { url: URL_UNDER_TEST },
            { onShare },
        );
        click(trigger);
        click(root.querySelector('[data-target-id="linkedin"]')!);
        expect(onShare).toHaveBeenCalledWith("linkedin", URL_UNDER_TEST);
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 clicking outside closes the list", () => {
        const { list } = openList();
        click(document.body);
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 destroy() removes the document listener", () => {
        const { list, api, trigger } = openList();
        api.destroy();
        click(trigger);
        // No handler left, so the list state is untouched by the click.
        expect(list.hasAttribute("hidden")).toBe(false);
    });
});

// =====================================================================
// §7.20–§7.22 — url resolution and custom glyph
// =====================================================================

describe("ShareButton — url resolution and glyph (§7.20–§7.22)", () => {
    test("§7.20 an explicit url opt wins", async () => {
        const nat = stubNativeShare();
        const { trigger } = setup({ url: URL_UNDER_TEST });
        click(trigger);
        await flush();
        expect(nat.calls[0].url).toBe(URL_UNDER_TEST);
        nat.restore();
    });

    test("§7.20 the url travels on a data attribute, not a rendered href", () => {
        const { root } = setup({ url: URL_UNDER_TEST });
        expect(root.getAttribute("data-lily-share-button-url")).toBe(
            URL_UNDER_TEST,
        );
        // Omitted entirely when unset, so the client falls through to
        // location.href.
        const bare = mountIntoBody(
            renderMacro({ label: "Share", targets: TARGETS }),
        );
        expect(bare.hasAttribute("data-lily-share-button-url")).toBe(false);
    });

    test("§7.21 with no url opt it falls back to the current page URL", async () => {
        const nat = stubNativeShare();
        const { trigger } = setup({});
        click(trigger);
        await flush();
        expect(nat.calls[0].url).toBe(location.href);
        nat.restore();
    });

    test("§7.21 copy uses the same lazily-resolved URL", async () => {
        const clip = stubClipboard();
        const { trigger, copy } = setup({ copyLabel: "Copy link" });
        click(trigger);
        click(copy!);
        await flush();
        expect(clip.writes).toEqual([location.href]);
        clip.restore();
    });

    test("§7.22 a {% call %} body replaces the glyph", () => {
        const root = mountIntoBody(
            renderMacroWithCaller(
                { label: "Share", targets: TARGETS },
                '<svg data-testid="custom" aria-hidden="true"></svg>',
            ),
        );
        const custom = root.querySelector("[data-testid='custom']")!;
        expect(custom.closest("button")?.className).toBe(
            "share-button-trigger",
        );
        expect(root.querySelector(".share-button-icon")).toBeNull();
    });

    test("§7.22 without a call body the default glyph renders", () => {
        const { root } = setup();
        expect(
            (root.querySelector(".share-button-icon") as HTMLElement)
                .textContent,
        ).toBe(RIGHTWARDS_ARROW_WITH_HOOK);
    });
});

// =====================================================================
// §7.23–§7.26 — Nunjucks-specific surface
// =====================================================================

describe("ShareButton — Nunjucks surface (§7.23–§7.26)", () => {
    test("§7.23 ids are deterministic and derived from the default name", () => {
        const { trigger, list } = setup();
        expect(list.id).toBe("share-button-share-list");
        expect(trigger.getAttribute("aria-controls")).toBe(list.id);
        // Same opts in, same string out — no counters, no randomness.
        expect(renderMacro({ label: "Share", targets: TARGETS })).toBe(
            renderMacro({ label: "Share", targets: TARGETS }),
        );
    });

    test("§7.23 the name opt drives the ids", () => {
        const { root, list } = setup({ name: "footer" });
        expect(list.id).toBe("share-button-footer-list");
        expect(root.getAttribute("data-lily-share-button-name")).toBe(
            "footer",
        );
        expect(
            root.querySelector(".share-button-target")!.id,
        ).toBe("share-button-footer-target-0");
    });

    test("§7.23 an explicit id opt overrides the name-derived prefix", () => {
        const { list, root } = setup({
            name: "share",
            id: "custom-prefix",
            copyLabel: "Copy link",
        });
        expect(list.id).toBe("custom-prefix-list");
        expect(root.querySelector(".share-button-copy")!.id).toBe(
            "custom-prefix-copy",
        );
    });

    test("§7.23 two instances sharing a name collide, distinct ids do not", () => {
        // Documented in the spec: this is why `id` exists.
        document.body.innerHTML =
            renderMacro({ label: "A", targets: TARGETS }) +
            renderMacro({ label: "B", targets: TARGETS, id: "b" });
        const lists = Array.from(
            document.querySelectorAll(".share-button-list"),
        ).map((l) => l.id);
        expect(new Set(lists).size).toBe(2);
        expect(lists).toEqual(["share-button-share-list", "b-list"]);
    });

    test("§7.23 classes and attributes land on the root", () => {
        const { root } = setup({
            classes: "my-share",
            attributes: { "data-analytics": "share-widget" },
        });
        expect(root.className).toBe("share-button my-share");
        expect(root.getAttribute("data-analytics")).toBe("share-widget");
    });

    test("§7.24 newTab:false drops target=_blank but keeps rel", () => {
        const { root } = setup({
            targets: [
                { id: "email", label: "Email", href: "mailto:a@b.test", newTab: false },
                ...TARGETS,
            ],
        });
        const links = Array.from(
            root.querySelectorAll<HTMLAnchorElement>(".share-button-target"),
        );
        expect(links[0].hasAttribute("target")).toBe(false);
        expect(links[0].getAttribute("rel")).toBe("noopener noreferrer");
        // The other targets are unaffected.
        expect(links[1].getAttribute("target")).toBe("_blank");
    });

    test("§7.25 shareTargetHref resolves the function form", () => {
        const target = {
            id: "x",
            href: (u: string, t: string, x: string) => `${u}|${t}|${x}`,
        };
        expect(shareTargetHref(target, "U", "T", "X")).toBe("U|T|X");
    });

    test("§7.25 shareTargetHref resolves the string form unchanged", () => {
        expect(
            shareTargetHref({ id: "x", href: "https://a.test" }, "U", "T", "X"),
        ).toBe("https://a.test");
    });

    test("§7.25 a throwing href function yields empty string, not a crash", () => {
        const target = {
            id: "x",
            href: () => {
                throw new Error("boom");
            },
        };
        expect(shareTargetHref(target, "U", "T", "X")).toBe("");
        expect(shareTargetHref(null as any, "U", "T", "X")).toBe("");
        expect(shareTargetHref({ id: "x" }, "U", "T", "X")).toBe("");
    });

    test("§7.26 client targets with function hrefs re-resolve the anchors", () => {
        const { root } = setup(
            { url: URL_UNDER_TEST },
            {
                targets: [
                    {
                        id: "mastodon",
                        href: (u: string) => `https://rebuilt.test/?u=${u}`,
                    },
                ],
            },
        );
        const links = Array.from(
            root.querySelectorAll<HTMLAnchorElement>(".share-button-target"),
        );
        expect(links[0].getAttribute("href")).toBe(
            `https://rebuilt.test/?u=${URL_UNDER_TEST}`,
        );
        // Untouched targets keep the server-rendered href.
        expect(links[1].getAttribute("href")).toBe(TARGETS[1].href);
    });

    test("§7.26 re-resolution also runs on open, tracking the live URL", () => {
        let n = 0;
        const { trigger, root } = setup(
            {},
            { targets: [{ id: "mastodon", href: () => `https://n.test/${n}` }] },
        );
        const link = root.querySelector(
            '[data-target-id="mastodon"]',
        ) as HTMLAnchorElement;
        expect(link.getAttribute("href")).toBe("https://n.test/0");
        n = 1;
        click(trigger);
        expect(link.getAttribute("href")).toBe("https://n.test/1");
    });

    test("§7.26 autoInit wires every root on the page", () => {
        document.body.innerHTML =
            renderMacro({ label: "A", targets: TARGETS }) +
            renderMacro({ label: "B", targets: TARGETS, id: "b" });
        const apis = autoInit();
        expect(apis.length).toBe(2);
        const triggers = Array.from(
            document.querySelectorAll<HTMLButtonElement>(
                ".share-button-trigger",
            ),
        );
        click(triggers[1]);
        const lists = Array.from(
            document.querySelectorAll<HTMLElement>(".share-button-list"),
        );
        expect(lists[0].hasAttribute("hidden")).toBe(true);
        expect(lists[1].hasAttribute("hidden")).toBe(false);
    });

    test("§7.26 initShareButton is inert on a missing or foreign root", () => {
        expect(() => initShareButton(null as any)).not.toThrow();
        document.body.innerHTML = "<div></div>";
        const api = initShareButton(
            document.body.firstElementChild as HTMLElement,
        );
        expect(() => api.open()).not.toThrow();
        expect(() => api.destroy()).not.toThrow();
    });

    test("§7.26 nextShareButtonId mints stable, incrementing, SSR-safe ids", () => {
        const a = nextShareButtonId();
        const b = nextShareButtonId();
        expect(a).toMatch(/^share-button-\d+$/);
        expect(b).not.toBe(a);
    });
});

// =====================================================================
// §6 — degradation without JavaScript
// =====================================================================

describe("ShareButton — no-JS degradation (§6)", () => {
    test("§6 destination links are complete in the server markup", () => {
        // No initShareButton call at all — this is the no-JS document.
        const root = mountIntoBody(
            renderMacro({
                label: "Share",
                targets: TARGETS,
                copyLabel: "Copy link",
            }),
        );
        const links = Array.from(
            root.querySelectorAll<HTMLAnchorElement>(".share-button-target"),
        );
        expect(links.map((a) => a.getAttribute("href"))).toEqual([
            TARGETS[0].href,
            TARGETS[1].href,
        ]);
    });

    test("§6 the list stays hidden and copy is inert without the client", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Share",
                targets: TARGETS,
                copyLabel: "Copy link",
            }),
        );
        const trigger = root.querySelector(
            ".share-button-trigger",
        ) as HTMLButtonElement;
        const list = root.querySelector(".share-button-list") as HTMLElement;
        click(trigger);
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    test("§6 the macro is pure: no document, storage, or navigator access", () => {
        // Rendering must not touch anything ambient. If it did, a
        // server render would either throw or leak state.
        const before = document.documentElement.outerHTML;
        renderMacro({ label: "Share", targets: TARGETS, url: URL_UNDER_TEST });
        expect(document.documentElement.outerHTML).toBe(before);
        // And nothing is persisted — this helper owns an action, not a
        // preference.
        const html = renderMacro({ label: "Share", targets: TARGETS });
        expect(html).not.toMatch(/localStorage|data-theme|data-text-size/);
    });
});
