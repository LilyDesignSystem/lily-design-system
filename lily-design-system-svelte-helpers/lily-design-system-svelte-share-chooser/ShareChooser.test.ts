import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ShareChooser, {
    canCopy,
    canShareNatively,
    BLACK_RIGHTWARDS_ARROWHEAD,
    type ShareTarget,
} from "./ShareChooser.svelte";

const URL_UNDER_TEST = "https://example.test/article";

const TARGETS: ShareTarget[] = [
    {
        id: "mastodon",
        label: "Mastodon",
        href: (u, t) => `https://mastodon.test/share?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
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
            else Object.defineProperty(navigator, "clipboard", { configurable: true, value: original });
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
            else Object.defineProperty(navigator, "share", { configurable: true, value: original });
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
});

describe("ShareChooser — markup contract (§7.1–§7.6)", () => {
    test("§7.1 renders a disclosure button controlling a list", () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        const button = screen.getByRole("button", { name: "Share" });
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const listId = button.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.tagName).toBe("UL");
    });

    test("§7.1 the button renders ➤, hidden from assistive tech", () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        const icon = document.querySelector(".share-chooser-icon") as HTMLElement;
        // U+27A4 BLACK RIGHTWARDS ARROWHEAD
        expect(icon.textContent).toBe("\u27A4");
        expect(BLACK_RIGHTWARDS_ARROWHEAD).toBe("\u27A4");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.2 the list is hidden until the button is activated", async () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        const list = document.querySelector(".share-chooser-list") as HTMLElement;
        expect(list.hasAttribute("hidden")).toBe(true);
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await flush();
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(
            screen.getByRole("button", { name: "Share" }).getAttribute("aria-expanded"),
        ).toBe("true");
    });

    test("§7.3 destinations are real links, not role=menuitem", async () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        const links = document.querySelectorAll<HTMLAnchorElement>(".share-chooser-target");
        expect(links.length).toBe(2);
        for (const a of links) {
            expect(a.tagName).toBe("A");
            // Real link semantics are the point: no role override, and safe
            // cross-origin defaults.
            expect(a.getAttribute("role")).toBeNull();
            expect(a.getAttribute("target")).toBe("_blank");
            expect(a.getAttribute("rel")).toBe("noopener noreferrer");
        }
    });

    test("§7.4 each destination's href comes from its own href()", async () => {
        render(ShareChooser, {
            props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST, title: "Hello" },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        const links = document.querySelectorAll<HTMLAnchorElement>(".share-chooser-target");
        expect(links[0].getAttribute("href")).toBe(
            `https://mastodon.test/share?url=${encodeURIComponent(URL_UNDER_TEST)}&text=${encodeURIComponent("Hello")}`,
        );
        expect(links[1].getAttribute("href")).toBe(
            `https://linkedin.test/sharing?url=${encodeURIComponent(URL_UNDER_TEST)}`,
        );
    });

    test("§7.5 the copy item renders only when copyLabel is supplied", async () => {
        const { unmount } = render(ShareChooser, {
            props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        expect(document.querySelector(".share-chooser-copy")).toBeNull();
        unmount();

        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                copyLabel: "Copy link",
            },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        const copy = document.querySelector(".share-chooser-copy") as HTMLElement;
        expect(copy.tagName).toBe("BUTTON");
        expect(copy.textContent?.trim()).toBe("Copy link");
    });

    test("§7.6 the status region is present, polite, and silent on load", () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        const status = document.querySelector(".share-chooser-status") as HTMLElement;
        expect(status.getAttribute("aria-live")).toBe("polite");
        expect(status.textContent?.trim()).toBe("");
    });
});

describe("ShareChooser — copy to clipboard (§7.7–§7.10)", () => {
    test("§7.7 copying writes the URL and fires onCopy", async () => {
        const clip = stubClipboard();
        const onCopy = vi.fn();
        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                copyLabel: "Copy link",
                onCopy,
            },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await fireEvent.click(document.querySelector(".share-chooser-copy")!);
        await flush();
        expect(clip.writes).toEqual([URL_UNDER_TEST]);
        expect(onCopy).toHaveBeenCalledWith(URL_UNDER_TEST);
        clip.restore();
    });

    test("§7.8 a successful copy announces copiedLabel and closes the list", async () => {
        const clip = stubClipboard();
        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                copyLabel: "Copy link",
                copiedLabel: "Link copied",
            },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await fireEvent.click(document.querySelector(".share-chooser-copy")!);
        await flush();
        expect(
            (document.querySelector(".share-chooser-status") as HTMLElement).textContent?.trim(),
        ).toBe("Link copied");
        expect(
            (document.querySelector(".share-chooser-list") as HTMLElement).hasAttribute("hidden"),
        ).toBe(true);
        clip.restore();
    });

    test("§7.9 a failed copy announces copyFailedLabel and does not throw", async () => {
        const clip = stubClipboard(false);
        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                copyLabel: "Copy link",
                copiedLabel: "Link copied",
                copyFailedLabel: "Could not copy",
            },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await fireEvent.click(document.querySelector(".share-chooser-copy")!);
        await flush();
        expect(
            (document.querySelector(".share-chooser-status") as HTMLElement).textContent?.trim(),
        ).toBe("Could not copy");
        clip.restore();
    });

    test("§7.10 an absent clipboard API is treated as a failure, not a crash", async () => {
        // No stub: jsdom has no navigator.clipboard at all.
        expect(canCopy()).toBe(false);
        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                copyLabel: "Copy link",
                copyFailedLabel: "Could not copy",
            },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await fireEvent.click(document.querySelector(".share-chooser-copy")!);
        await flush();
        expect(
            (document.querySelector(".share-chooser-status") as HTMLElement).textContent?.trim(),
        ).toBe("Could not copy");
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
        const onNativeShare = vi.fn();
        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                title: "Hello",
                text: "Body",
                onNativeShare,
            },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await flush();
        expect(nat.calls).toEqual([{ url: URL_UNDER_TEST, title: "Hello", text: "Body" }]);
        expect(onNativeShare).toHaveBeenCalledWith(URL_UNDER_TEST);
        // The list must NOT also open.
        expect(
            (document.querySelector(".share-chooser-list") as HTMLElement).hasAttribute("hidden"),
        ).toBe(true);
        nat.restore();
    });

    test("§7.13 strategy=auto falls back to the list with no native sheet", async () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await flush();
        expect(
            (document.querySelector(".share-chooser-list") as HTMLElement).hasAttribute("hidden"),
        ).toBe(false);
    });

    test("§7.13 strategy=list ignores an available native sheet", async () => {
        const nat = stubNativeShare();
        render(ShareChooser, {
            props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST, strategy: "list" },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await flush();
        expect(nat.calls.length).toBe(0);
        expect(
            (document.querySelector(".share-chooser-list") as HTMLElement).hasAttribute("hidden"),
        ).toBe(false);
        nat.restore();
    });

    test("§7.14 a dismissed share sheet does not fall through to the list", async () => {
        // navigator.share rejects when the user dismisses the sheet. Opening
        // the list then would resurrect UI the user just dismissed.
        const nat = stubNativeShare("reject");
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await flush();
        expect(nat.calls.length).toBe(1);
        expect(
            (document.querySelector(".share-chooser-list") as HTMLElement).hasAttribute("hidden"),
        ).toBe(true);
        nat.restore();
    });
});

describe("ShareChooser — keyboard and dismissal (§7.15–§7.19)", () => {
    async function openList() {
        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                copyLabel: "Copy link",
            },
        });
        const button = screen.getByRole("button", { name: "Share" });
        await fireEvent.click(button);
        await flush();
        return { button, list: document.querySelector(".share-chooser-list") as HTMLElement };
    }

    test("§7.15 opening moves focus to the first item", async () => {
        const { list } = await openList();
        expect(document.activeElement).toBe(list.querySelector(".share-chooser-target"));
    });

    test("§7.15 ArrowDown on the closed button opens and focuses the first item", async () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        const button = screen.getByRole("button", { name: "Share" });
        await fireEvent.keyDown(button, { key: "ArrowDown" });
        await flush();
        expect(document.activeElement?.className).toContain("share-chooser-target");
    });

    test("§7.15 ArrowUp on the closed button opens and focuses the last item", async () => {
        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                copyLabel: "Copy link",
            },
        });
        const button = screen.getByRole("button", { name: "Share" });
        await fireEvent.keyDown(button, { key: "ArrowUp" });
        await flush();
        expect(document.activeElement?.className).toContain("share-chooser-copy");
    });

    test("§7.16 arrows move focus between items and clamp at the ends", async () => {
        const { list } = await openList();
        const all = Array.from(
            list.querySelectorAll(".share-chooser-target, .share-chooser-copy"),
        );
        await fireEvent.keyDown(list, { key: "ArrowDown" });
        expect(document.activeElement).toBe(all[1]);
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(document.activeElement).toBe(all[0]);
        // Clamps rather than wrapping.
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(document.activeElement).toBe(all[0]);
    });

    test("§7.16 Home and End jump to the first and last item", async () => {
        const { list } = await openList();
        const all = Array.from(
            list.querySelectorAll(".share-chooser-target, .share-chooser-copy"),
        );
        await fireEvent.keyDown(list, { key: "End" });
        expect(document.activeElement).toBe(all[all.length - 1]);
        await fireEvent.keyDown(list, { key: "Home" });
        expect(document.activeElement).toBe(all[0]);
    });

    test("§7.17 Escape closes and returns focus to the button", async () => {
        const { button, list } = await openList();
        await fireEvent.keyDown(list, { key: "Escape" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(button);
    });

    test("§7.18 choosing a destination fires onShare with its id and closes", async () => {
        const onShare = vi.fn();
        render(ShareChooser, {
            props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST, onShare },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        await fireEvent.click(document.querySelector('[data-target-id="linkedin"]')!);
        await flush();
        expect(onShare).toHaveBeenCalledWith("linkedin", URL_UNDER_TEST);
        expect(
            (document.querySelector(".share-chooser-list") as HTMLElement).hasAttribute("hidden"),
        ).toBe(true);
    });

    test("§7.19 clicking outside closes the list", async () => {
        const { list } = await openList();
        await fireEvent.click(document.body);
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
    });
});

describe("ShareChooser — url resolution and custom glyph (§7.20–§7.22)", () => {
    test("§7.20 an explicit url prop wins", async () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS, url: URL_UNDER_TEST } });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        const href = document.querySelector(".share-chooser-target")!.getAttribute("href")!;
        expect(href).toContain(encodeURIComponent(URL_UNDER_TEST));
    });

    test("§7.21 with no url prop it falls back to the current page URL", async () => {
        render(ShareChooser, { props: { label: "Share", targets: TARGETS } });
        await fireEvent.click(screen.getByRole("button", { name: "Share" }));
        const href = document.querySelector(".share-chooser-target")!.getAttribute("href")!;
        expect(href).toContain(encodeURIComponent(location.href));
    });

    test("§7.22 children replaces the glyph and receives ChildArgs", async () => {
        const customSnippet = (($anchor: Comment, args: any) => {
            const node = document.createElement("span");
            const a = args();
            node.setAttribute("data-testid", "custom");
            node.setAttribute("data-open", String(a.open));
            node.setAttribute("data-url", a.url);
            node.textContent = "custom glyph";
            $anchor.before(node);
        }) as any;

        render(ShareChooser, {
            props: {
                label: "Share",
                targets: TARGETS,
                url: URL_UNDER_TEST,
                children: customSnippet,
            },
        });
        await flush();
        const custom = screen.getByTestId("custom");
        expect(custom.closest("button")?.className).toContain("share-chooser-button");
        expect(document.querySelector(".share-chooser-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-url")).toBe(URL_UNDER_TEST);
    });
});
