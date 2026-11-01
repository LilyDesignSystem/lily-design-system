// dialog.test.js
// Dialog component test

const path = require("path");

describe("Dialog", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "dialog.html"));
    });

    it("should render the dialog element with correct class", async function () {
        const el = await $("dialog.dialog");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("dialog");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("dialog.dialog");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("dialog");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("dialog.dialog");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("Dialog keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "dialog.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                "body",
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

    it("Escape closes an open modal dialog", async function () {
        await load();
        await browser.execute(() => document.querySelector(".dialog").showModal());
        expect(await browser.execute(() => document.querySelector(".dialog").open)).toBe(true);
        await browser.keys("Escape");
        expect(await browser.execute(() => document.querySelector(".dialog").open)).toBe(false);
    });
    it("Escape closes a non-modal dialog too", async function () {
        await load();
        await browser.execute(() => {
            const d = document.querySelector(".dialog");
            d.show();
            d.focus();
        });
        await browser.keys("Escape");
        expect(await browser.execute(() => document.querySelector(".dialog").open)).toBe(false);
    });
    it("is focusable and modal", async function () {
        await load();
        expect(await attr(".dialog", "tabindex")).toBe("-1");
        expect(await attr(".dialog", "aria-modal")).toBe("true");
    });
});

// Modality and focus return (tasks.md P12-T4, P14-T4), in a real browser: no helper is needed, because closing a
// dialog opened with showModal() returns focus to the element that opened it.
describe("Dialog modality", function () {
    it("showModal() makes it modal; Escape closes it and focus returns to the opener", async function () {
        await browser.url("file://" + path.resolve(__dirname, "dialog.html"));
        await browser.execute(() => {
            const dialog = document.querySelector(".dialog");
            dialog.insertAdjacentHTML("beforeend", '<button id="inside">Inside</button>');
            const opener = document.createElement("button");
            opener.id = "opener";
            opener.textContent = "Open";
            opener.addEventListener("click", () => dialog.showModal());
            document.body.prepend(opener);
        });
        await (await $("#opener")).click();
        const state = () =>
            browser.execute(() => {
                const d = document.querySelector(".dialog");
                return {
                    open: d.open,
                    modal: d.matches(":modal"),
                    active: document.activeElement.id,
                };
            });
        expect(await state()).toEqual({ open: true, modal: true, active: "inside" });
        await browser.keys("Escape");
        await browser.waitUntil(async () => (await state()).open === false, { timeout: 2000 });
        expect((await state()).active).toBe("opener");
    });
});
