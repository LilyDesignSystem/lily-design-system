// dropdown-menu.test.js
// DropdownMenu component test

const path = require("path");

describe("DropdownMenu", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "dropdown-menu.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.dropdown-menu");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("dropdown-menu");
    });

    it("should have a haspopup button and a labelled menu panel", async function () {
        const button = await $("div.dropdown-menu > button");
        expect(await button.getAttribute("aria-haspopup")).toBe("true");
        expect(await button.getAttribute("aria-expanded")).toBe("false");
        const menu = await $("div.dropdown-menu > [role=menu]");
        expect(await menu.getAttribute("aria-label")).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("DropdownMenu keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "dropdown-menu.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".dropdown-menu [role=menu]",
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
    // The menu is popover="auto": the browser's toggle event, which updates aria-expanded, is queued as a task.
    async function expanded(value) {
        await browser.waitUntil(
            async () => (await attr(".dropdown-menu button", "aria-expanded")) === value,
            {
                timeout: 2000,
            },
        );
    }
    async function openMenu() {
        await (await $(".dropdown-menu button")).click();
        await expanded("true");
    }

    const ITEMS =
        '<div id="a" role="menuitem" tabindex="-1">a</div><div id="b" role="menuitem" tabindex="-1">b</div><div id="c" role="menuitem" tabindex="-1">c</div>';
    it("the button opens the menu, sets aria-expanded and focuses the first item", async function () {
        await load(ITEMS);
        expect(await attr(".dropdown-menu button", "aria-expanded")).toBe("false");
        await focus("a").catch(() => {});
        await openMenu();
        expect(
            await browser.execute(() =>
                document.querySelector(".dropdown-menu [role=menu]").matches(":popover-open"),
            ),
        ).toBe(true);
        expect(await active()).toBe("a");
    });
    it("arrows wrap, Home and End jump", async function () {
        await load(ITEMS);
        await openMenu();
        await browser.keys("ArrowDown");
        expect(await active()).toBe("b");
        await browser.keys("ArrowUp");
        await browser.keys("ArrowUp");
        expect(await active()).toBe("c");
        await browser.keys("Home");
        expect(await active()).toBe("a");
        await browser.keys("End");
        expect(await active()).toBe("c");
    });
    it("Escape closes the menu and returns focus to the button", async function () {
        await load(ITEMS);
        await openMenu();
        await browser.keys("Escape");
        await expanded("false");
        expect(
            await browser.execute(
                () =>
                    getComputedStyle(document.querySelector(".dropdown-menu [role=menu]")).display,
            ),
        ).toBe("none");
        expect(await browser.execute(() => document.activeElement.tagName)).toBe("BUTTON");
    });
});

describe("DropdownMenu Popover API", function () {
    it("a click outside light-dismisses the open menu", async function () {
        await browser.url("file://" + path.resolve(__dirname, "dropdown-menu.html"));
        await browser.execute(() => {
            document
                .querySelector(".dropdown-menu [role=menu]")
                .insertAdjacentHTML(
                    "beforeend",
                    '<div id="a" role="menuitem" tabindex="-1">a</div>',
                );
            document.body.insertAdjacentHTML(
                "beforeend",
                '<p id="outside" style="margin-top:200px">outside</p>',
            );
        });
        await (await $(".dropdown-menu button")).click();
        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    document.querySelector(".dropdown-menu button").getAttribute("aria-expanded"),
                )) === "true",
        );
        await (await $("#outside")).click();
        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    document.querySelector(".dropdown-menu button").getAttribute("aria-expanded"),
                )) === "false",
            { timeout: 2000 },
        );
        expect(
            await browser.execute(() =>
                document.querySelector(".dropdown-menu [role=menu]").matches(":popover-open"),
            ),
        ).toBe(false);
    });
});

// Where the Popover API is missing (browsers before Chrome 114, Firefox 125, Safari 17), the script falls back to the
// hidden attribute. Simulated in this Chrome by removing showPopover before the snippet's script runs.
describe("DropdownMenu without the Popover API", function () {
    it("toggles hidden on click and closes on Escape", async function () {
        const fs = require("fs");
        const src = fs.readFileSync(path.resolve(__dirname, "dropdown-menu.html"), "utf8");
        const markup = src.slice(src.indexOf("\n-->") + 4, src.indexOf("<script>"));
        const script = src.slice(src.indexOf("<script>") + 8, src.indexOf("</script>"));
        await browser.url("file://" + path.resolve(__dirname, "dropdown-menu.html"));
        await browser.execute(
            (html, js) => {
                delete HTMLElement.prototype.showPopover;
                document.body.innerHTML = html;
                document
                    .querySelector(".dropdown-menu [role=menu]")
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
                const m = document.querySelector(".dropdown-menu [role=menu]");
                return [
                    m.hidden,
                    m.hasAttribute("popover"),
                    document.querySelector(".dropdown-menu button").getAttribute("aria-expanded"),
                ];
            });
        expect(await state()).toEqual([true, false, "false"]);
        await (await $(".dropdown-menu button")).click();
        expect(await state()).toEqual([false, false, "true"]);
        await browser.keys("Escape");
        expect(await state()).toEqual([true, false, "false"]);
    });
});
