// tile-map.test.js
// TileMap component test

const path = require("path");

describe("TileMap", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tile-map.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tile-map");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tile-map");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tile-map");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have role='img'", async function () {
        const el = await $("div.tile-map");
        const r = await el.getAttribute("role");
        expect(r).toBe("img");
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("TileMap keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "tile-map.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".tile-map",
                inner,
            );
        }
    }
    async function active() {
        return browser.execute(() => document.activeElement && document.activeElement.id);
    }
    async function focus(id) {
        await browser.execute((i) => document.getElementById(i).focus(), id);
    }
    async function attr(selector, name) {
        return browser.execute((s, n) => document.querySelector(s).getAttribute(n), selector, name);
    }

    const TILES =
        '<div id="a" data-tile tabindex="0" style="display:inline-block;width:40px;height:40px">a</div><div id="b" data-tile tabindex="0" style="display:inline-block;width:40px;height:40px">b</div><br><div id="c" data-tile tabindex="0" style="display:inline-block;width:40px;height:40px">c</div><div id="d" data-tile tabindex="0" style="display:inline-block;width:40px;height:40px">d</div>';
    it("ArrowRight/ArrowLeft move between tiles and stop at the ends", async function () {
        await load(TILES);
        await focus("a");
        await browser.keys("ArrowRight");
        expect(await active()).toBe("b");
        await browser.keys("ArrowLeft");
        await browser.keys("ArrowLeft");
        expect(await active()).toBe("a");
    });
    it("ArrowDown/ArrowUp move to the nearest tile in the next row", async function () {
        await load(TILES);
        await focus("a");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("c");
        await browser.keys("ArrowUp");
        expect(await active()).toBe("a");
    });
    it("Enter and Space dispatch tile-activate from the focused tile", async function () {
        await load(TILES);
        await browser.execute(() => {
            window.__acts = [];
            document
                .querySelector(".tile-map")
                .addEventListener("tile-activate", (e) => window.__acts.push(e.target.id));
        });
        await focus("b");
        await browser.keys("Enter");
        await browser.keys(" ");
        expect(await browser.execute(() => window.__acts)).toEqual(["b", "b"]);
    });
    it("Escape blurs the focused tile", async function () {
        await load(TILES);
        await focus("b");
        await browser.keys("Escape");
        expect(await active()).toBe("");
    });
});
