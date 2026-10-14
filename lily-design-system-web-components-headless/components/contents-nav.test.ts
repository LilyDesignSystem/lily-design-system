import { afterEach, describe, expect, test, vi } from "vitest";

import { ContentsNav, activeSectionIndex } from "./contents-nav.js";

if (!customElements.get("lily-contents-nav")) {
    customElements.define("lily-contents-nav", ContentsNav);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContentsNav", () => {
    test("renders a native nav landmark", () => {
        const host = render('<lily-contents-nav label="Contents"></lily-contents-nav>');

        expect(host.querySelector("nav.contents-nav")).toBeTruthy();
    });

    test("uses label as the landmark's accessible name", () => {
        const host = render('<lily-contents-nav label="Contents"></lily-contents-nav>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("Contents");
    });

    test("moves its children into the nav", () => {
        const host = render('<lily-contents-nav label="Contents"><ol id="list"></ol></lily-contents-nav>');

        expect(host.querySelector("nav > #list")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-contents-nav label="Contents" class="extra"></lily-contents-nav>');

        expect(host.querySelector("nav")!.className).toBe("contents-nav extra");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-contents-nav label="Contents"></lily-contents-nav>');

        (host as unknown as ContentsNav).connectedCallback();

        expect(host.querySelectorAll("nav").length).toBe(1);
    });
});

// =====================================================================
// Scrollspy (spy)
// =====================================================================

const linksHtml = (ids: string[]) =>
    "<ol>" + ids.map((id) => `<li><a href="#${id}">${id}</a></li>`).join("") + "</ol>";

/** Sections whose tops the test controls; jsdom has no layout. */
function sections(ids: string[]): Record<string, number> {
    const tops: Record<string, number> = {};
    // A tall page, so the viewport is not "at the bottom" unless a test says so.
    Object.defineProperty(document.documentElement, "scrollHeight", { value: 5000, configurable: true });
    for (const id of ids) {
        const el = document.createElement("section");
        el.id = id;
        tops[id] = 0;
        el.getBoundingClientRect = () =>
            ({ top: tops[id], bottom: tops[id] + 100, left: 0, right: 0, width: 0, height: 100, x: 0, y: tops[id], toJSON() {} }) as DOMRect;
        document.body.appendChild(el);
    }
    return tops;
}

function mountNav(attrs: string, html: string): HTMLElement {
    const host = document.createElement("lily-contents-nav");
    host.setAttribute("label", "Contents");
    for (const part of attrs.split(" ").filter(Boolean)) {
        const [k, v] = part.split("=");
        host.setAttribute(k, v ?? "");
    }
    host.innerHTML = html;
    document.body.appendChild(host);
    return host;
}

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const settle = async () => {
    await frame();
    await frame();
};
const scroll = async (type = "scroll") => {
    window.dispatchEvent(new Event(type));
    await settle();
};
const activeLink = () => document.querySelector("a[aria-current]");
const IDS = ["intro", "usage", "api"];

describe("ContentsNav — activeSectionIndex (pure)", () => {
    test("the last section whose top has passed the line is current", () => {
        expect(activeSectionIndex([-300, -10, 400], 0, false)).toBe(1);
        expect(activeSectionIndex([-300, -10, 400], 500, false)).toBe(2);
    });
    test("before the first section, the first is current", () => {
        expect(activeSectionIndex([200, 600, 900], 0, false)).toBe(0);
    });
    test("at the bottom of the scroll range the last section is current", () => {
        expect(activeSectionIndex([-300, -10, 400], 0, true)).toBe(2);
    });
    test("no sections gives -1", () => {
        expect(activeSectionIndex([], 0, false)).toBe(-1);
    });
});

describe("ContentsNav — scrollspy", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        window.location.hash = "";
    });

    test("spy is off by default: no link is marked", async () => {
        sections(IDS);
        mountNav("", linksHtml(IDS));
        await settle();
        expect(activeLink()).toBeNull();
    });

    test("marks the link of the section in view with aria-current and data-active", async () => {
        const tops = sections(IDS);
        tops.intro = -400; tops.usage = -20; tops.api = 500;
        mountNav("spy", linksHtml(IDS));
        await settle();
        expect(activeLink()!.textContent).toBe("usage");
        expect(activeLink()!.getAttribute("aria-current")).toBe("true");
        expect(activeLink()!.hasAttribute("data-active")).toBe(true);
        expect(document.querySelectorAll("a[aria-current]")).toHaveLength(1);
    });

    test("moves the mark when the reader scrolls, and back again", async () => {
        const tops = sections(IDS);
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        mountNav("spy", linksHtml(IDS));
        await settle();
        expect(activeLink()!.textContent).toBe("intro");
        tops.intro = -400; tops.usage = -100; tops.api = 200;
        await scroll();
        expect(activeLink()!.textContent).toBe("usage");
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        await scroll();
        expect(activeLink()!.textContent).toBe("intro");
    });

    test("offset moves the activation line", async () => {
        const tops = sections(IDS);
        tops.intro = -400; tops.usage = 60; tops.api = 500;
        mountNav("spy offset=80", linksHtml(IDS));
        await settle();
        expect(activeLink()!.textContent).toBe("usage");
    });

    test("current sets the aria-current token", async () => {
        sections(IDS);
        mountNav("spy current=location", linksHtml(IDS));
        await settle();
        expect(activeLink()!.getAttribute("aria-current")).toBe("location");
    });

    test("a click makes its link current at once and holds it while the scroll settles", async () => {
        const tops = sections(IDS);
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        mountNav("spy", linksHtml(IDS));
        await settle();
        (document.querySelector('a[href="#api"]') as HTMLElement).click();
        expect(activeLink()!.textContent).toBe("api");
        tops.intro = -100; tops.usage = 0; tops.api = 300;
        await scroll();
        expect(activeLink()!.textContent).toBe("api");
        await scroll("scrollend");
        expect(activeLink()!.textContent).toBe("usage");
    });

    test("lily-active-change fires once per change, with the section id, and `active` holds it", async () => {
        const tops = sections(IDS);
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        const onChange = vi.fn();
        const host = document.createElement("lily-contents-nav");
        host.setAttribute("label", "Contents");
        host.setAttribute("spy", "");
        host.innerHTML = linksHtml(IDS);
        host.addEventListener("lily-active-change", (e) => onChange((e as CustomEvent).detail.id));
        document.body.appendChild(host);
        await settle();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenLastCalledWith("intro");
        tops.intro = -400; tops.usage = -100; tops.api = 200;
        await scroll();
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenLastCalledWith("usage");
        expect((host as unknown as ContentsNav).active).toBe("usage");
    });

    test("at the bottom of the page the last section is current even if it never reaches the line", async () => {
        const tops = sections(IDS);
        tops.intro = -900; tops.usage = -500; tops.api = 400;
        Object.defineProperty(document.documentElement, "scrollHeight", { value: window.innerHeight + 10, configurable: true });
        Object.defineProperty(window, "scrollY", { value: 10, configurable: true });
        mountNav("spy", linksHtml(IDS));
        await settle();
        expect(activeLink()!.textContent).toBe("api");
        Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    });

    test("the URL hash wins on load", async () => {
        const tops = sections(IDS);
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        window.location.hash = "#api";
        mountNav("spy", linksHtml(IDS));
        await settle();
        expect(activeLink()!.textContent).toBe("api");
    });

    test("ancestors of the active link get data-descendant-active", async () => {
        const tops = sections(["intro", "child"]);
        tops.intro = -400; tops.child = -10;
        mountNav("spy", '<ol><li><a href="#intro">intro</a><ol><li><a href="#child">child</a></li></ol></li></ol>');
        await settle();
        expect(activeLink()!.textContent).toBe("child");
        expect(document.querySelector("li")!.hasAttribute("data-descendant-active")).toBe(true);
        expect(activeLink()!.closest("li")!.hasAttribute("data-descendant-active")).toBe(false);
    });

    test("links with no matching element are ignored", async () => {
        const tops = sections(["intro"]);
        tops.intro = 0;
        mountNav("spy", linksHtml(["intro", "missing"]));
        await settle();
        expect(activeLink()!.textContent).toBe("intro");
    });
});
