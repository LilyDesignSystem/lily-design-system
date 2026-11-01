// form-reset.test.js
// P10-T9: form-reset audit. After a form reset the markup and the component's own
// state (aria-expanded, a hidden panel, data-value, the selected wheel option) must
// agree with the control the browser restored, and a cancelled reset changes nothing.

const path = require("path");

const fs = require("fs");
const os = require("os");

/** Load a component file with its markup and script inside <form id="test-form">. */
async function inForm(file) {
    const html = fs.readFileSync(path.resolve(__dirname, file), "utf8");
    const page = path.join(os.tmpdir(), "lily-form-reset-" + file);
    fs.writeFileSync(
        page,
        '<!doctype html><meta charset="utf-8"><form id="test-form">' + html + "</form>",
    );
    await browser.url("file://" + page);
}
async function reset(cancel) {
    await browser.execute((cancel) => {
        const form = document.getElementById("test-form");
        if (cancel) form.addEventListener("reset", (e) => e.preventDefault());
        form.reset();
    }, cancel);
    await browser.pause(50); // the components restore one tick after the reset
}

describe("accordion-checkbox form reset", function () {
    const load = () => inForm("accordion-checkbox.html");
    const state = () =>
        browser.execute(() => {
            const input = document.querySelector(".accordion-checkbox-input");
            const panel = document.querySelector(".accordion-checkbox-panel");
            return {
                checked: input.checked,
                expanded: input.getAttribute("aria-expanded"),
                hidden: panel.hidden,
            };
        });

    it("closes the panel again when the form resets", async function () {
        await load();
        await browser.execute(() => document.querySelector(".accordion-checkbox-input").click());
        expect(await state()).toEqual({ checked: true, expanded: "true", hidden: false });
        await reset(false);
        expect(await state()).toEqual({ checked: false, expanded: "false", hidden: true });
    });

    it("a cancelled reset changes nothing", async function () {
        await load();
        await browser.execute(() => document.querySelector(".accordion-checkbox-input").click());
        await reset(true);
        expect(await state()).toEqual({ checked: true, expanded: "true", hidden: false });
    });
});

describe("pin-input-div form reset", function () {
    it("publishes the restored digits in data-value", async function () {
        await inForm("pin-input-div.html");
        await browser.execute(() => {
            const inputs = document.querySelectorAll(".pin-input-div input");
            inputs[0].value = "7";
            inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
        });
        expect(
            await browser.execute(() => document.querySelector(".pin-input-div").dataset.value),
        ).toBe("7");
        await reset(false);
        expect(
            await browser.execute(() => document.querySelector(".pin-input-div").dataset.value),
        ).toBe("");
    });
});

describe("wheel-picker form reset", function () {
    const state = () =>
        browser.execute(() => ({
            selected: document.querySelector('[aria-selected="true"]').dataset.value,
            hidden: document.querySelector('.wheel-picker input[type="hidden"]').value,
        }));

    it("restores the initial selection and the hidden input", async function () {
        await inForm("wheel-picker.html");
        const initial = await state();
        await browser.execute(() => document.querySelector('[data-value="3"]').click());
        expect((await state()).selected).toBe("3");
        await reset(false);
        expect(await state()).toEqual(initial);
    });

    it("a cancelled reset changes nothing", async function () {
        await inForm("wheel-picker.html");
        await browser.execute(() => document.querySelector('[data-value="3"]').click());
        await reset(true);
        expect(await state()).toEqual({ selected: "3", hidden: "3" });
    });
});
