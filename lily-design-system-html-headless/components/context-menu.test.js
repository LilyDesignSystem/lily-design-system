// context-menu.test.js
// ContextMenu component test

const path = require("path");

describe("ContextMenu", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "context-menu.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.context-menu");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("context-menu");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.context-menu");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("menu");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.context-menu");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("ContextMenu keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "context-menu.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".context-menu",
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

    async function openMenu() {
        await browser.execute(() =>
            document.querySelector(".context-menu").setAttribute("data-open", "true"),
        );
    }
    const ITEMS =
        '<div id="a" role="menuitem" tabindex="-1">a</div><div id="b" role="menuitem" tabindex="-1">b</div><div id="c" role="menuitem" tabindex="-1">c</div>';
    it("ArrowDown moves to the next item and wraps", async function () {
        await load(ITEMS);
        await openMenu();
        await focus("a");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("b");
        await focus("c");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("a");
    });
    it("ArrowUp moves to the previous item and wraps", async function () {
        await load(ITEMS);
        await openMenu();
        await focus("b");
        await browser.keys("ArrowUp");
        expect(await active()).toBe("a");
        await browser.keys("ArrowUp");
        expect(await active()).toBe("c");
    });
    it("Home and End jump to the first and last item", async function () {
        await load(ITEMS);
        await openMenu();
        await focus("b");
        await browser.keys("End");
        expect(await active()).toBe("c");
        await browser.keys("Home");
        expect(await active()).toBe("a");
    });
    it("ignores keys that are not part of its contract", async function () {
        await load(ITEMS);
        await openMenu();
        await focus("b");
        await browser.keys("x");
        expect(await active()).toBe("b");
    });

    function shown() {
        return browser.execute(
            () => getComputedStyle(document.querySelector(".context-menu")).display !== "none",
        );
    }

    it("is hidden until data-open is true, then shows as a popover and focuses the first item", async function () {
        await load(ITEMS);
        expect(await shown()).toBe(false);
        await browser.execute(() =>
            document.querySelector(".context-menu").setAttribute("data-open", "true"),
        );
        await browser.waitUntil(async () => (await active()) === "a");
        expect(
            await browser.execute(() =>
                document.querySelector(".context-menu").matches(":popover-open"),
            ),
        ).toBe(true);
    });
    it("Escape closes it and returns focus to the opener", async function () {
        await load(ITEMS);
        await browser.execute(() => {
            const b = document.createElement("button");
            b.id = "opener";
            document.body.append(b);
            b.focus();
            document.querySelector(".context-menu").setAttribute("data-open", "true");
        });
        await browser.waitUntil(async () => (await active()) === "a");
        await browser.keys("Escape");
        await browser.waitUntil(
            async () => (await attr(".context-menu", "data-open")) === "false",
            {
                timeout: 2000,
            },
        );
        await browser.waitUntil(async () => (await active()) === "opener");
        expect(await shown()).toBe(false);
    });
    it("a click outside light-dismisses it: data-open becomes false and close fires", async function () {
        await load(ITEMS);
        await browser.execute(() => {
            document.body.insertAdjacentHTML("beforeend", '<p id="outside">outside</p>');
            window.__closed = 0;
            document
                .querySelector(".context-menu")
                .addEventListener("close", () => window.__closed++);
            document.querySelector(".context-menu").setAttribute("data-open", "true");
        });
        await browser.waitUntil(async () => (await active()) === "a");
        await (await $("#outside")).click();
        await browser.waitUntil(
            async () => (await attr(".context-menu", "data-open")) === "false",
            {
                timeout: 2000,
            },
        );
        expect(await browser.execute(() => window.__closed)).toBe(1);
        expect(await shown()).toBe(false);
    });
});

// Where the Popover API is missing (browsers before Chrome 114, Firefox 125, Safari 17), the script falls back to the
// hidden attribute. Simulated in this Chrome by removing showPopover before the snippet's script runs.
describe("ContextMenu without the Popover API", function () {
    it("data-open toggles hidden, and Escape closes it", async function () {
        const fs = require("fs");
        const src = fs.readFileSync(path.resolve(__dirname, "context-menu.html"), "utf8");
        const markup = src.slice(src.indexOf("\n-->") + 4, src.indexOf("<script>"));
        const script = src.slice(src.indexOf("<script>") + 8, src.indexOf("</script>"));
        await browser.url("file://" + path.resolve(__dirname, "context-menu.html"));
        await browser.execute(
            (html, js) => {
                delete HTMLElement.prototype.showPopover;
                document.body.innerHTML = html;
                document
                    .querySelector(".context-menu")
                    .insertAdjacentHTML(
                        "beforeend",
                        '<div id="a" role="menuitem" tabindex="-1">a</div>',
                    );
                new Function(js)();
            },
            markup,
            script,
        );
        const state = () =>
            browser.execute(() => {
                const m = document.querySelector(".context-menu");
                return [m.hidden, m.hasAttribute("popover"), m.getAttribute("data-open")];
            });
        expect(await state()).toEqual([true, false, "false"]);
        await browser.execute(() =>
            document.querySelector(".context-menu").setAttribute("data-open", "true"),
        );
        await browser.waitUntil(async () => (await state())[0] === false);
        await browser.keys("Escape");
        await browser.waitUntil(async () => (await state())[2] === "false");
        expect(await state()).toEqual([true, false, "false"]);
    });
});
