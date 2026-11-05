// slider-button.test.js
// SliderButton component test

const path = require("path");

describe("SliderButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "slider-button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.slider-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("slider-button");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.slider-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have role='slider'", async function () {
        const el = await $("button.slider-button");
        const r = await el.getAttribute("role");
        expect(r).toBe("slider");
    });
});

// Keyboard behaviour (P12-T5a): real key presses in a real browser.
describe("SliderButton keyboard", function () {
    async function setup(extra) {
        await browser.url("file://" + path.resolve(__dirname, "slider-button.html"));
        await browser.execute((e) => {
            const b = document.querySelector(".slider-button");
            b.setAttribute("aria-label", "Confirm order");
            b.setAttribute("data-step", "25");
            Object.keys(e).forEach((k) =>
                k === "disabled" ? (b.disabled = true) : b.setAttribute(k, e[k]),
            );
            window.confirms = 0;
            b.addEventListener("confirm", () => (window.confirms += 1));
            b.focus();
        }, extra || {});
    }
    const now = () =>
        browser.execute(() =>
            document.querySelector(".slider-button").getAttribute("aria-valuenow"),
        );
    const confirms = () => browser.execute(() => window.confirms);

    it("ArrowRight and ArrowLeft move by data-step; Home returns to 0", async function () {
        await setup();
        await browser.keys(["ArrowRight", "ArrowRight"]);
        expect(await now()).toBe("50");
        await browser.keys("ArrowLeft");
        expect(await now()).toBe("25");
        await browser.keys("Home");
        expect(await now()).toBe("0");
        await browser.keys("ArrowLeft");
        expect(await now()).toBe("0");
    });

    it("reaching 100 dispatches confirm once and resets", async function () {
        await setup();
        await browser.keys(["ArrowRight", "ArrowRight", "ArrowRight"]);
        expect(await confirms()).toBe(0);
        await browser.keys("ArrowRight");
        expect(await confirms()).toBe(1);
        expect(await now()).toBe("0");
    });

    it("End, Enter and Space confirm at once", async function () {
        await setup();
        await browser.keys("End");
        await browser.keys("Enter");
        await browser.keys(" ");
        expect(await confirms()).toBe(3);
    });

    it("a disabled button ignores the keys", async function () {
        await setup({ disabled: true });
        await browser.execute(() => {
            const b = document.querySelector(".slider-button");
            ["End", "ArrowRight"].forEach((key) =>
                b.dispatchEvent(
                    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
                ),
            );
        });
        expect(await confirms()).toBe(0);
        expect(await now()).toBe("0");
    });
});
