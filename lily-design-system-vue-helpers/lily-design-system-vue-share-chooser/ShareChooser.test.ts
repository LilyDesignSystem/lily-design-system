import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { h, nextTick } from "vue";

import ShareChooser, {
    canCopy,
    canShareNatively,
    RIGHTWARDS_ARROW_WITH_HOOK,
    type ShareTarget,
} from "./ShareChooser.vue";

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

/** Let Vue's scheduler, the async click handlers, and nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(ShareChooser, {
        props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST, ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

function parts(wrapper: VueWrapper<any>) {
    return {
        button: wrapper.find("button.share-chooser-button"),
        list: wrapper.find("ul.share-chooser-list"),
        status: wrapper.find("p.share-chooser-status"),
    };
}

/** Open the list and wait for focus to land. */
async function openList(wrapper: VueWrapper<any>) {
    const p = parts(wrapper);
    await p.button.trigger("click");
    await flush();
    return p;
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

beforeEach(() => {
    // jsdom ships neither API; make their absence explicit rather than assumed.
    delete (navigator as any).share;
    delete (navigator as any).clipboard;
});

afterEach(() => {
    delete (navigator as any).share;
    delete (navigator as any).clipboard;
    while (wrappers.length) wrappers.pop()?.unmount();
});

describe("ShareChooser — markup contract (§7.1–§7.6)", () => {
    test("§7.1 renders a disclosure button controlling a list", () => {
        const wrapper = build();
        const { button, list } = parts(wrapper);
        expect(button.element.tagName).toBe("BUTTON");
        expect(button.attributes("type")).toBe("button");
        expect(button.attributes("aria-label")).toBe("Share");
        expect(button.attributes("aria-expanded")).toBe("false");
        const listId = button.attributes("aria-controls");
        expect(listId).toBeTruthy();
        expect(list.element.id).toBe(listId);
        expect(list.element.tagName).toBe("UL");
    });

    test("§7.1 the button renders ↪, hidden from assistive tech", () => {
        const wrapper = build();
        const icon = wrapper.find(".share-chooser-icon");
        // U+21AA RIGHTWARDS ARROW WITH HOOK
        expect(icon.text()).toBe("↪");
        expect(RIGHTWARDS_ARROW_WITH_HOOK).toBe("↪");
        expect(icon.attributes("aria-hidden")).toBe("true");
    });

    test("§7.2 the list is hidden until the button is activated", async () => {
        const wrapper = build();
        const { button, list } = parts(wrapper);
        expect(list.element.hasAttribute("hidden")).toBe(true);
        await button.trigger("click");
        await flush();
        expect(list.element.hasAttribute("hidden")).toBe(false);
        expect(button.attributes("aria-expanded")).toBe("true");
    });

    test("§7.3 destinations are real links, not role=menuitem", async () => {
        const wrapper = build();
        await openList(wrapper);
        const links = wrapper.findAll("a.share-chooser-target");
        expect(links.length).toBe(2);
        for (const a of links) {
            expect(a.element.tagName).toBe("A");
            // Real link semantics are the point: no role override, and safe
            // cross-origin defaults.
            expect(a.attributes("role")).toBeUndefined();
            expect(a.attributes("target")).toBe("_blank");
            expect(a.attributes("rel")).toBe("noopener noreferrer");
        }
    });

    test("§7.3 newTab: false drops target=_blank for that destination only", async () => {
        const wrapper = build({
            targets: [TARGETS[0], { ...TARGETS[1], newTab: false }],
        });
        await openList(wrapper);
        const links = wrapper.findAll("a.share-chooser-target");
        expect(links[0].attributes("target")).toBe("_blank");
        expect(links[1].attributes("target")).toBeUndefined();
        expect(links[1].attributes("rel")).toBe("noopener noreferrer");
    });

    test("§7.4 each destination's href comes from its own href()", async () => {
        const wrapper = build({ title: "Hello" });
        await openList(wrapper);
        const links = wrapper.findAll("a.share-chooser-target");
        expect(links[0].attributes("href")).toBe(
            `https://mastodon.test/share?url=${encodeURIComponent(URL_UNDER_TEST)}&text=${encodeURIComponent("Hello")}`,
        );
        expect(links[1].attributes("href")).toBe(
            `https://linkedin.test/sharing?url=${encodeURIComponent(URL_UNDER_TEST)}`,
        );
    });

    test("§7.5 the copy item renders only when copyLabel is supplied", async () => {
        const bare = build();
        await openList(bare);
        expect(bare.find(".share-chooser-copy").exists()).toBe(false);

        const withCopy = build({ copyLabel: "Copy link" });
        await openList(withCopy);
        const copy = withCopy.find(".share-chooser-copy");
        expect(copy.element.tagName).toBe("BUTTON");
        expect(copy.attributes("type")).toBe("button");
        expect(copy.text()).toBe("Copy link");
    });

    test("§7.6 the status region is present, polite, and silent on load", () => {
        const wrapper = build();
        const { status } = parts(wrapper);
        expect(status.attributes("aria-live")).toBe("polite");
        expect(status.text()).toBe("");
    });

    test("§4.2 the root carries the class hook, the consumer class, and $attrs", () => {
        const wrapper = build(
            { class: "mine" },
            { attrs: { "data-testid": "share", id: "root-id" } },
        );
        const root = wrapper.find("div.share-chooser");
        expect(root.classes()).toContain("share-chooser");
        expect(root.classes()).toContain("mine");
        expect(root.attributes("data-testid")).toBe("share");
        expect(root.attributes("id")).toBe("root-id");
    });
});

describe("ShareChooser — copy to clipboard (§7.7–§7.10)", () => {
    test("§7.7 copying writes the URL and emits copy", async () => {
        const clip = stubClipboard();
        const wrapper = build({ copyLabel: "Copy link" });
        await openList(wrapper);
        await wrapper.find(".share-chooser-copy").trigger("click");
        await flush();
        expect(clip.writes).toEqual([URL_UNDER_TEST]);
        expect(wrapper.emitted("copy")).toEqual([[URL_UNDER_TEST]]);
        clip.restore();
    });

    test("§7.8 a successful copy announces copiedLabel and closes the list", async () => {
        const clip = stubClipboard();
        const wrapper = build({ copyLabel: "Copy link", copiedLabel: "Link copied" });
        await openList(wrapper);
        await wrapper.find(".share-chooser-copy").trigger("click");
        await flush();
        expect(parts(wrapper).status.text()).toBe("Link copied");
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(true);
        clip.restore();
    });

    test("§7.9 a failed copy announces copyFailedLabel and does not throw", async () => {
        const clip = stubClipboard(false);
        const wrapper = build({
            copyLabel: "Copy link",
            copiedLabel: "Link copied",
            copyFailedLabel: "Could not copy",
        });
        await openList(wrapper);
        await wrapper.find(".share-chooser-copy").trigger("click");
        await flush();
        expect(parts(wrapper).status.text()).toBe("Could not copy");
        expect(wrapper.emitted("copy")).toBeUndefined();
        clip.restore();
    });

    test("§7.10 an absent clipboard API is treated as a failure, not a crash", async () => {
        // No stub: jsdom has no navigator.clipboard at all.
        expect(canCopy()).toBe(false);
        const wrapper = build({
            copyLabel: "Copy link",
            copyFailedLabel: "Could not copy",
        });
        await openList(wrapper);
        await wrapper.find(".share-chooser-copy").trigger("click");
        await flush();
        expect(parts(wrapper).status.text()).toBe("Could not copy");
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(true);
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
        const wrapper = build({ title: "Hello", text: "Body" });
        await parts(wrapper).button.trigger("click");
        await flush();
        expect(nat.calls).toEqual([
            { url: URL_UNDER_TEST, title: "Hello", text: "Body" },
        ]);
        expect(wrapper.emitted("nativeShare")).toEqual([[URL_UNDER_TEST]]);
        // The list must NOT also open.
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(true);
        expect(parts(wrapper).button.attributes("aria-expanded")).toBe("false");
        nat.restore();
    });

    test("§7.13 strategy=auto falls back to the list with no native sheet", async () => {
        const wrapper = build();
        await parts(wrapper).button.trigger("click");
        await flush();
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(false);
    });

    test("§7.13 strategy=list ignores an available native sheet", async () => {
        const nat = stubNativeShare();
        const wrapper = build({ strategy: "list" });
        await parts(wrapper).button.trigger("click");
        await flush();
        expect(nat.calls.length).toBe(0);
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(false);
        nat.restore();
    });

    test("§7.13 strategy=native attempts the sheet and skips the list", async () => {
        const nat = stubNativeShare();
        const wrapper = build({ strategy: "native" });
        await parts(wrapper).button.trigger("click");
        await flush();
        expect(nat.calls.length).toBe(1);
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(true);
        nat.restore();
    });

    test("§7.14 a dismissed share sheet does not fall through to the list", async () => {
        // navigator.share rejects when the user dismisses the sheet. Opening
        // the list then would resurrect UI the user just dismissed.
        const nat = stubNativeShare("reject");
        const wrapper = build();
        await parts(wrapper).button.trigger("click");
        await flush();
        expect(nat.calls.length).toBe(1);
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(true);
        // A dismissal is not a share.
        expect(wrapper.emitted("nativeShare")).toBeUndefined();
        nat.restore();
    });
});

describe("ShareChooser — keyboard and dismissal (§7.15–§7.19)", () => {
    function itemsOf(wrapper: VueWrapper<any>): HTMLElement[] {
        return Array.from(
            parts(wrapper).list.element.querySelectorAll<HTMLElement>(
                ".share-chooser-target, .share-chooser-copy",
            ),
        );
    }

    test("§7.15 opening moves focus to the first item", async () => {
        const wrapper = build({ copyLabel: "Copy link" });
        await openList(wrapper);
        expect(document.activeElement).toBe(itemsOf(wrapper)[0]);
    });

    test("§7.15 ArrowDown on the closed button opens and focuses the first item", async () => {
        const wrapper = build();
        await parts(wrapper).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(false);
        expect(document.activeElement).toBe(itemsOf(wrapper)[0]);
    });

    test("§7.15 ArrowUp on the closed button opens and focuses the last item", async () => {
        const wrapper = build({ copyLabel: "Copy link" });
        await parts(wrapper).button.trigger("keydown", { key: "ArrowUp" });
        await flush();
        const all = itemsOf(wrapper);
        expect(document.activeElement).toBe(all[all.length - 1]);
        expect((document.activeElement as HTMLElement).className).toContain(
            "share-chooser-copy",
        );
    });

    test("§7.16 arrows move focus between items and clamp at the ends", async () => {
        const wrapper = build({ copyLabel: "Copy link" });
        const { list } = await openList(wrapper);
        const all = itemsOf(wrapper);
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(document.activeElement).toBe(all[1]);
        await list.trigger("keydown", { key: "ArrowUp" });
        expect(document.activeElement).toBe(all[0]);
        // Clamps rather than wrapping.
        await list.trigger("keydown", { key: "ArrowUp" });
        expect(document.activeElement).toBe(all[0]);
        await list.trigger("keydown", { key: "End" });
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(document.activeElement).toBe(all[all.length - 1]);
    });

    test("§7.16 Home and End jump to the first and last item", async () => {
        const wrapper = build({ copyLabel: "Copy link" });
        const { list } = await openList(wrapper);
        const all = itemsOf(wrapper);
        await list.trigger("keydown", { key: "End" });
        expect(document.activeElement).toBe(all[all.length - 1]);
        await list.trigger("keydown", { key: "Home" });
        expect(document.activeElement).toBe(all[0]);
    });

    test("§7.17 Escape closes and returns focus to the button", async () => {
        const wrapper = build({ copyLabel: "Copy link" });
        const { button, list } = await openList(wrapper);
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(list.element.hasAttribute("hidden")).toBe(true);
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(button.element);
    });

    test("§7.17 Tab closes without stealing focus back to the button", async () => {
        const wrapper = build({ copyLabel: "Copy link" });
        const { button, list } = await openList(wrapper);
        await list.trigger("keydown", { key: "Tab" });
        await flush();
        expect(list.element.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button.element);
    });

    test("§7.18 choosing a destination emits share with its id and closes", async () => {
        const wrapper = build();
        await openList(wrapper);
        await wrapper.find('[data-target-id="linkedin"]').trigger("click");
        await flush();
        expect(wrapper.emitted("share")).toEqual([["linkedin", URL_UNDER_TEST]]);
        expect(parts(wrapper).list.element.hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 clicking outside closes the list", async () => {
        const wrapper = build({ copyLabel: "Copy link" });
        const { list } = await openList(wrapper);
        document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        expect(list.element.hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 clicking the trigger again closes the list", async () => {
        const wrapper = build({ copyLabel: "Copy link" });
        const { button, list } = await openList(wrapper);
        await button.trigger("click");
        await flush();
        expect(list.element.hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 focus leaving the root closes the list", async () => {
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        const wrapper = build({ copyLabel: "Copy link" });
        const { list } = await openList(wrapper);
        await parts(wrapper).list.trigger("focusout", { relatedTarget: outside });
        await flush();
        expect(list.element.hasAttribute("hidden")).toBe(true);
        outside.remove();
    });
});

describe("ShareChooser — url resolution and custom glyph (§7.20–§7.22)", () => {
    test("§7.20 an explicit url prop wins", async () => {
        const wrapper = build();
        await openList(wrapper);
        const href = wrapper.find(".share-chooser-target").attributes("href")!;
        expect(href).toContain(encodeURIComponent(URL_UNDER_TEST));
    });

    test("§7.21 with no url prop it falls back to the current page URL", async () => {
        const wrapper = build({ url: undefined });
        await openList(wrapper);
        const href = wrapper.find(".share-chooser-target").attributes("href")!;
        expect(href).toContain(encodeURIComponent(location.href));
    });

    test("§7.21 the native sheet gets the resolved url too", async () => {
        const nat = stubNativeShare();
        const wrapper = build({ url: undefined });
        await parts(wrapper).button.trigger("click");
        await flush();
        expect(nat.calls[0].url).toBe(location.href);
        nat.restore();
    });

    test("§7.22 the default slot replaces the glyph and receives SlotArgs", async () => {
        const wrapper = build(
            {},
            {
                slots: {
                    default: (args: { open: boolean; url: string }) =>
                        h(
                            "span",
                            {
                                "data-testid": "custom",
                                "data-open": String(args.open),
                                "data-url": args.url,
                            },
                            "custom glyph",
                        ),
                },
            },
        );
        await flush();
        const custom = wrapper.find('[data-testid="custom"]');
        expect(custom.exists()).toBe(true);
        expect(custom.element.closest("button")?.className).toContain(
            "share-chooser-button",
        );
        expect(wrapper.find(".share-chooser-icon").exists()).toBe(false);
        expect(custom.attributes("data-open")).toBe("false");
        expect(custom.attributes("data-url")).toBe(URL_UNDER_TEST);
    });

    test("§7.22 the slot's open argument tracks the list state", async () => {
        const wrapper = build(
            {},
            {
                slots: {
                    default: (args: { open: boolean; url: string }) =>
                        h("span", { "data-testid": "custom", "data-open": String(args.open) }),
                },
            },
        );
        await openList(wrapper);
        expect(wrapper.find('[data-testid="custom"]').attributes("data-open")).toBe(
            "true",
        );
    });
});
