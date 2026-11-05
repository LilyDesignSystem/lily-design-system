// sheet.test.js
// Sheet component test

const path = require("path");

describe("Sheet", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "sheet.html"));
    });

    it("should render the dialog element with correct class", async function () {
        const el = await $("dialog.sheet");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("sheet");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("dialog.sheet");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4) and real modality (P18-T6): real key presses in a real browser.
describe("Sheet keyboard and modality", function () {
    const SEL = ".sheet";
    async function load() {
        await browser.url("file://" + path.resolve(__dirname, "sheet.html"));
        await browser.execute((s) => {
            const d = document.querySelector(s);
            d.insertAdjacentHTML(
                "beforeend",
                '<button id="first">First</button><button id="last">Last</button>',
            );
            const b = document.createElement("button");
            b.id = "opener";
            b.textContent = "Open";
            document.body.prepend(b);
            const after = document.createElement("button");
            after.id = "outside";
            after.textContent = "Outside";
            document.body.append(after);
            b.focus();
        }, SEL);
    }
    async function openIt() {
        await browser.execute(
            (s) => document.querySelector(s).setAttribute("data-open", "true"),
            SEL,
        );
        await browser.waitUntil(async () => await isOpen());
    }
    async function active() {
        return browser.execute(() => document.activeElement && document.activeElement.id);
    }
    async function attr(selector, name) {
        return browser.execute((s, n) => document.querySelector(s).getAttribute(n), selector, name);
    }
    const isOpen = () => browser.execute((s) => document.querySelector(s).open, SEL);
    const inside = () =>
        browser.execute((s) => document.querySelector(s).contains(document.activeElement), SEL);

    it("is closed (not rendered) while data-open is false", async function () {
        await load();
        expect(await isOpen()).toBe(false);
    });
    it("is a native <dialog> with the base class and aria-modal", async function () {
        await load();
        expect(await browser.execute((s) => document.querySelector(s).tagName, SEL)).toBe("DIALOG");
        expect(await attr(SEL, "aria-modal")).toBe("true");
    });
    it("data-open=true opens it with showModal() and moves focus inside", async function () {
        await load();
        await openIt();
        expect(await browser.execute((s) => document.querySelector(s).matches(":modal"), SEL)).toBe(
            true,
        );
        expect(await inside()).toBe(true);
    });
    it("Tab cannot leave it while open", async function () {
        await load();
        await openIt();
        for (let i = 0; i < 6; i++) {
            await browser.keys("Tab");
            const id = await active();
            expect(id === "opener" || id === "outside").toBe(false);
        }
    });
    it("Escape closes it and returns focus to the opener", async function () {
        await load();
        await openIt();
        await browser.keys("Escape");
        await browser.waitUntil(async () => !(await isOpen()));
        expect(await attr(SEL, "data-open")).toBe("false");
        expect(await active()).toBe("opener");
    });
    it("the native cancel event closes it", async function () {
        await load();
        await openIt();
        await browser.execute(
            (s) =>
                document.querySelector(s).dispatchEvent(new Event("cancel", { cancelable: true })),
            SEL,
        );
        await browser.waitUntil(async () => !(await isOpen()));
        expect(await attr(SEL, "data-open")).toBe("false");
        expect(await active()).toBe("opener");
    });
    it("data-open=false closes it and returns focus to the opener", async function () {
        await load();
        await openIt();
        await browser.execute(
            (s) => document.querySelector(s).setAttribute("data-open", "false"),
            SEL,
        );
        await browser.waitUntil(async () => !(await isOpen()));
        expect(await active()).toBe("opener");
    });
});

describe("sheet reopened at once", function () {
    it("stays open when it opens before the native close event fires", async function () {
        await browser.url("file://" + path.resolve(__dirname, "sheet.html"));
        const open = await browser.execute(async function () {
            const el = document.querySelector("dialog.sheet");
            const settle = () => new Promise((resolve) => queueMicrotask(resolve));
            el.setAttribute("data-open", "true");
            await settle();
            el.setAttribute("data-open", "false");
            await settle();
            el.setAttribute("data-open", "true");
            await settle();
            await new Promise((resolve) => setTimeout(resolve, 50));
            return el.open;
        });
        expect(open).toBe(true);
    });
});
