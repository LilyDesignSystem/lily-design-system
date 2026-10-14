// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";

import { activeSectionIndex, autoInit, initContentsNavSpy } from "./spy.js";

const linksHtml = (ids) => "<ol>" + ids.map((id) => `<li><a href="#${id}">${id}</a></li>`).join("") + "</ol>";

/** Sections whose tops the test controls; jsdom has no layout. */
function sections(ids) {
  const tops = {};
  // A tall page, so the viewport is not "at the bottom" unless a test says so.
  Object.defineProperty(document.documentElement, "scrollHeight", { value: 5000, configurable: true });
  for (const id of ids) {
    const el = document.createElement("section");
    el.id = id;
    tops[id] = 0;
    el.getBoundingClientRect = () => ({ top: tops[id], bottom: tops[id] + 100, left: 0, right: 0, width: 0, height: 100, x: 0, y: tops[id], toJSON() {} });
    document.body.appendChild(el);
  }
  return tops;
}

function mountNav(attrs, html) {
  const nav = document.createElement("nav");
  nav.className = "contents-nav";
  nav.setAttribute("aria-label", "Contents");
  nav.setAttribute("data-lily-contents-nav-spy", "");
  for (const [k, v] of Object.entries(attrs)) nav.setAttribute(k, v);
  nav.innerHTML = html;
  document.body.appendChild(nav);
  return nav;
}

const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
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

describe("activeSectionIndex (pure)", () => {
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

describe("contents-nav spy", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    window.location.hash = "";
  });

  test("autoInit wires every [data-lily-contents-nav-spy] and marks the link in view", async () => {
    const tops = sections(IDS);
    tops.intro = -400; tops.usage = -20; tops.api = 500;
    mountNav({}, linksHtml(IDS));
    const stops = autoInit();
    await settle();
    expect(stops).toHaveLength(1);
    expect(activeLink().textContent).toBe("usage");
    expect(activeLink().getAttribute("aria-current")).toBe("true");
    expect(activeLink().hasAttribute("data-active")).toBe(true);
    expect(document.querySelectorAll("a[aria-current]")).toHaveLength(1);
    stops.forEach((stop) => stop());
  });

  test("moves the mark when the reader scrolls, and back again", async () => {
    const tops = sections(IDS);
    tops.intro = 0; tops.usage = 300; tops.api = 600;
    const stop = initContentsNavSpy(mountNav({}, linksHtml(IDS)));
    await settle();
    expect(activeLink().textContent).toBe("intro");
    tops.intro = -400; tops.usage = -100; tops.api = 200;
    await scroll();
    expect(activeLink().textContent).toBe("usage");
    tops.intro = 0; tops.usage = 300; tops.api = 600;
    await scroll();
    expect(activeLink().textContent).toBe("intro");
    stop();
  });

  test("data-spy-offset moves the activation line", async () => {
    const tops = sections(IDS);
    tops.intro = -400; tops.usage = 60; tops.api = 500;
    const stop = initContentsNavSpy(mountNav({ "data-spy-offset": "80" }, linksHtml(IDS)));
    await settle();
    expect(activeLink().textContent).toBe("usage");
    stop();
  });

  test("data-spy-current sets the aria-current token", async () => {
    sections(IDS);
    const stop = initContentsNavSpy(mountNav({ "data-spy-current": "location" }, linksHtml(IDS)));
    await settle();
    expect(activeLink().getAttribute("aria-current")).toBe("location");
    stop();
  });

  test("a click makes its link current at once and holds it while the scroll settles", async () => {
    const tops = sections(IDS);
    tops.intro = 0; tops.usage = 300; tops.api = 600;
    const stop = initContentsNavSpy(mountNav({}, linksHtml(IDS)));
    await settle();
    document.querySelector('a[href="#api"]').click();
    expect(activeLink().textContent).toBe("api");
    tops.intro = -100; tops.usage = 0; tops.api = 300;
    await scroll();
    expect(activeLink().textContent).toBe("api");
    await scroll("scrollend");
    expect(activeLink().textContent).toBe("usage");
    stop();
  });

  test("onChange fires once per change, with the section id and the nav", async () => {
    const tops = sections(IDS);
    tops.intro = 0; tops.usage = 300; tops.api = 600;
    const onChange = vi.fn();
    const nav = mountNav({}, linksHtml(IDS));
    const stop = initContentsNavSpy(nav, { onChange });
    await settle();
    await scroll();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith("intro", nav);
    tops.intro = -400; tops.usage = -100; tops.api = 200;
    await scroll();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith("usage", nav);
    stop();
  });

  test("at the bottom of the page the last section is current even if it never reaches the line", async () => {
    const tops = sections(IDS);
    tops.intro = -900; tops.usage = -500; tops.api = 400;
    Object.defineProperty(document.documentElement, "scrollHeight", { value: window.innerHeight + 10, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 10, configurable: true });
    const stop = initContentsNavSpy(mountNav({}, linksHtml(IDS)));
    await settle();
    expect(activeLink().textContent).toBe("api");
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    stop();
  });

  test("the URL hash wins on load", async () => {
    const tops = sections(IDS);
    tops.intro = 0; tops.usage = 300; tops.api = 600;
    window.location.hash = "#api";
    const stop = initContentsNavSpy(mountNav({}, linksHtml(IDS)));
    await settle();
    expect(activeLink().textContent).toBe("api");
    stop();
  });

  test("ancestors of the active link get data-descendant-active", async () => {
    const tops = sections(["intro", "child"]);
    tops.intro = -400; tops.child = -10;
    const stop = initContentsNavSpy(
      mountNav({}, '<ol><li><a href="#intro">intro</a><ol><li><a href="#child">child</a></li></ol></li></ol>'),
    );
    await settle();
    expect(activeLink().textContent).toBe("child");
    expect(document.querySelector("li").hasAttribute("data-descendant-active")).toBe(true);
    expect(activeLink().closest("li").hasAttribute("data-descendant-active")).toBe(false);
    stop();
  });

  test("links with no matching element are ignored", async () => {
    const tops = sections(["intro"]);
    tops.intro = 0;
    const stop = initContentsNavSpy(mountNav({}, linksHtml(["intro", "missing"])));
    await settle();
    expect(activeLink().textContent).toBe("intro");
    stop();
  });
});
