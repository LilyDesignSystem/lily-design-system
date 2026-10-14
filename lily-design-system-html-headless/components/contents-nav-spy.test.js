// contents-nav-spy.test.js
// Scrollspy for contents-nav — a REAL browser, real layout and real scrolling
// (jsdom has neither, so the framework ports' unit tests mock positions; this
// is where the behaviour is proved). Harness: contents-nav-spy.fixture.html.

const fs = require("fs");
const path = require("path");

// Chrome blocks a module import between file:// URLs, so inject the module's
// source as an inline classic script (exports dropped).
const source = fs
  .readFileSync(path.resolve(__dirname, "contents-nav-spy.js"), "utf8")
  .replace(/^export /gm, "");

async function open(query = "", hash = "") {
  await browser.url(
    "file://" + path.resolve(__dirname, "contents-nav-spy.fixture.html") + query + hash
  );
  await browser.execute((src) => {
    const script = document.createElement("script");
    script.textContent = src + "\nwindow.__setup(startScrollspy);";
    document.head.append(script);
  }, source);
  await settle();
}

/** Two animation frames: the spy is frame-throttled. */
async function settle() {
  await browser.execute(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 50)));
      })
  );
}

async function scrollToY(y) {
  await browser.execute((top) => window.scrollTo(0, top), y);
  await settle();
}

async function active() {
  return browser.execute(() => {
    const links = document.querySelectorAll("a[aria-current]");
    return Array.from(links).map((a) => a.textContent.trim());
  });
}

describe("contents-nav spy (real browser)", function () {
  it("marks exactly one link, the first, at the top of the page", async function () {
    await open();
    expect(await active()).toEqual(["Introduction"]);
    expect(
      await browser.execute(() => document.querySelector("a[data-active]").textContent.trim())
    ).toBe("Introduction");
  });

  it("follows the reader down and back up", async function () {
    await open();
    await scrollToY(1000); // past #intro (900px), inside #usage
    expect(await active()).toEqual(["Usage"]);
    await scrollToY(1900); // past #usage (900-1800), inside #api
    expect(await active()).toEqual(["API"]);
    await scrollToY(100);
    expect(await active()).toEqual(["Introduction"]);
  });

  it("marks the nested link and flags its parent item data-descendant-active", async function () {
    await open();
    await scrollToY(1400); // #usage-details sits 400px into #usage
    expect(await active()).toEqual(["Details"]);
    const parent = await browser.execute(() =>
      document.querySelector('a[href="#usage"]').closest("li").hasAttribute("data-descendant-active")
    );
    expect(parent).toBe(true);
  });

  it("activates the last section at the bottom of the page though it is too short to reach the line", async function () {
    await open();
    await browser.execute(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await settle();
    expect(await active()).toEqual(["Last"]);
  });

  it("a click makes its link current and the real scroll then agrees", async function () {
    await open();
    await browser.execute(() => document.querySelector('a[href="#api"]').click());
    expect(await active()).toEqual(["API"]);
    await settle();
    await browser.pause(300);
    expect(await active()).toEqual(["API"]);
  });

  it("offset moves the activation line", async function () {
    await open("?offset=200");
    await scrollToY(750); // #usage top is at 900-750 = 150 <= 200
    expect(await active()).toEqual(["Usage"]);
  });

  it("current sets the aria-current token", async function () {
    await open("?current=location");
    expect(
      await browser.execute(() => document.querySelector("a[aria-current]").getAttribute("aria-current"))
    ).toBe("location");
  });

  it("the URL hash wins on load", async function () {
    await open("", "#api");
    expect(await active()).toEqual(["API"]);
  });

  it("onChange fires once per change", async function () {
    await open();
    await scrollToY(1000);
    await scrollToY(1000);
    await scrollToY(1900);
    expect(await browser.execute(() => window.__changes)).toEqual(["intro", "usage", "api"]);
  });
});
