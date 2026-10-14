import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject, { activeSectionIndex } from "@lily/ContentsNav";

describe("ContentsNav", () => {
    test("renders as navigation landmark", () => {
        render(<Subject label="On this page">Items</Subject>);
        expect(screen.getByRole("navigation", { name: "On this page" })).toBeTruthy();
    });

    test("applies aria-label", () => {
        render(<Subject label="Contents">Items</Subject>);
        expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("Contents");
    });

    test("renders children", () => {
        render(<Subject label="Contents">Section 1</Subject>);
        expect(screen.getByRole("navigation").textContent).toContain("Section 1");
    });

    test("passes through attributes", () => {
        render(<Subject label="Contents" data-testid="cn">Items</Subject>);
        expect(screen.getByTestId("cn")).toBeTruthy();
    });
});

// =====================================================================
// Scrollspy (spy)
// =====================================================================

function Links({ ids }: { ids: string[] }) {
    return (
        <ol>
            {ids.map((id) => (
                <li key={id}>
                    <a href={"#" + id}>{id}</a>
                </li>
            ))}
        </ol>
    );
}

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

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const settle = async () => {
    await act(async () => {
        await frame();
        await frame();
    });
};
const scroll = async (type = "scroll") => {
    await act(async () => {
        window.dispatchEvent(new Event(type));
    });
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
        cleanup();
        document.body.innerHTML = "";
        window.location.hash = "";
    });

    test("spy is off by default: no link is marked", async () => {
        sections(IDS);
        render(<Subject label="Contents"><Links ids={IDS} /></Subject>);
        await settle();
        expect(activeLink()).toBeNull();
    });

    test("marks the link of the section in view with aria-current and data-active", async () => {
        const tops = sections(IDS);
        tops.intro = -400; tops.usage = -20; tops.api = 500;
        render(<Subject label="Contents" spy><Links ids={IDS} /></Subject>);
        await settle();
        expect(activeLink()!.textContent).toBe("usage");
        expect(activeLink()!.getAttribute("aria-current")).toBe("true");
        expect(activeLink()!.hasAttribute("data-active")).toBe(true);
        expect(document.querySelectorAll("a[aria-current]")).toHaveLength(1);
    });

    test("moves the mark when the reader scrolls, and back again", async () => {
        const tops = sections(IDS);
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        render(<Subject label="Contents" spy><Links ids={IDS} /></Subject>);
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
        render(<Subject label="Contents" spy offset={80}><Links ids={IDS} /></Subject>);
        await settle();
        expect(activeLink()!.textContent).toBe("usage");
    });

    test("current sets the aria-current token", async () => {
        sections(IDS);
        render(<Subject label="Contents" spy current="location"><Links ids={IDS} /></Subject>);
        await settle();
        expect(activeLink()!.getAttribute("aria-current")).toBe("location");
    });

    test("a click makes its link current at once and holds it while the scroll settles", async () => {
        const tops = sections(IDS);
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        render(<Subject label="Contents" spy><Links ids={IDS} /></Subject>);
        await settle();
        await act(async () => {
            (document.querySelector('a[href="#api"]') as HTMLElement).click();
        });
        expect(activeLink()!.textContent).toBe("api");
        tops.intro = -100; tops.usage = 0; tops.api = 300;
        await scroll();
        expect(activeLink()!.textContent).toBe("api");
        await scroll("scrollend");
        expect(activeLink()!.textContent).toBe("usage");
    });

    test("onActiveChange fires once per change, with the section id", async () => {
        const tops = sections(IDS);
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        const onActiveChange = vi.fn();
        render(<Subject label="Contents" spy onActiveChange={onActiveChange}><Links ids={IDS} /></Subject>);
        await settle();
        await scroll();
        expect(onActiveChange).toHaveBeenCalledTimes(1);
        expect(onActiveChange).toHaveBeenLastCalledWith("intro");
        tops.intro = -400; tops.usage = -100; tops.api = 200;
        await scroll();
        expect(onActiveChange).toHaveBeenCalledTimes(2);
        expect(onActiveChange).toHaveBeenLastCalledWith("usage");
    });

    test("at the bottom of the page the last section is current even if it never reaches the line", async () => {
        const tops = sections(IDS);
        tops.intro = -900; tops.usage = -500; tops.api = 400;
        Object.defineProperty(document.documentElement, "scrollHeight", { value: window.innerHeight + 10, configurable: true });
        Object.defineProperty(window, "scrollY", { value: 10, configurable: true });
        render(<Subject label="Contents" spy><Links ids={IDS} /></Subject>);
        await settle();
        expect(activeLink()!.textContent).toBe("api");
        Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    });

    test("the URL hash wins on load", async () => {
        const tops = sections(IDS);
        tops.intro = 0; tops.usage = 300; tops.api = 600;
        window.location.hash = "#api";
        render(<Subject label="Contents" spy><Links ids={IDS} /></Subject>);
        await settle();
        expect(activeLink()!.textContent).toBe("api");
    });

    test("ancestors of the active link get data-descendant-active", async () => {
        const tops = sections(["intro", "child"]);
        tops.intro = -400; tops.child = -10;
        render(
            <Subject label="Contents" spy>
                <ol>
                    <li>
                        <a href="#intro">intro</a>
                        <ol><li><a href="#child">child</a></li></ol>
                    </li>
                </ol>
            </Subject>,
        );
        await settle();
        expect(activeLink()!.textContent).toBe("child");
        expect(document.querySelector("li")!.hasAttribute("data-descendant-active")).toBe(true);
        expect(activeLink()!.closest("li")!.hasAttribute("data-descendant-active")).toBe(false);
    });

    test("links with no matching element are ignored", async () => {
        const tops = sections(["intro"]);
        tops.intro = 0;
        render(<Subject label="Contents" spy><Links ids={["intro", "missing"]} /></Subject>);
        await settle();
        expect(activeLink()!.textContent).toBe("intro");
    });
});
