import { test, expect } from "@playwright/test";

// Control on Windows/Linux, Meta on macOS: Playwright's ControlOrMeta picks the platform's.
const UNDO = "ControlOrMeta+z";
const REDO = "ControlOrMeta+Shift+z";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

async function selectWord(page: import("@playwright/test").Page) {
    const ta = page.getByRole("textbox", { name: "Message" });
    await ta.focus();
    await ta.evaluate((el: HTMLTextAreaElement) => el.setSelectionRange(0, 5));
    return ta;
}

test("a tool applies, then native undo takes it back, then redo reapplies it", async ({ page }) => {
    const ta = await selectWord(page);
    await page.getByRole("button", { name: "Bold" }).click();
    await expect(ta).toHaveValue("**hello** world");

    await page.keyboard.press(UNDO);
    await expect(ta).toHaveValue("hello world");

    await page.keyboard.press(REDO);
    await expect(ta).toHaveValue("**hello** world");
});

test("two tools undo back to the start (one step each; WebKit merges them into one)", async ({ page, browserName }) => {
    const ta = await selectWord(page);
    await page.getByRole("button", { name: "Bold" }).click();
    await page.getByRole("button", { name: "Italic" }).click();
    await expect(ta).toHaveValue("***hello*** world");

    await page.keyboard.press(UNDO);
    if (browserName === "webkit") {
        // WebKit coalesces consecutive insertText edits into one undo step.
        await expect(ta).toHaveValue("hello world");
        return;
    }
    await expect(ta).toHaveValue("**hello** world");
    await page.keyboard.press(UNDO);
    await expect(ta).toHaveValue("hello world");
});

test("the shortcut path undoes the same way", async ({ page }) => {
    const ta = await selectWord(page);
    await page.keyboard.press("ControlOrMeta+b");
    await expect(ta).toHaveValue("**hello** world");
    await page.keyboard.press(UNDO);
    await expect(ta).toHaveValue("hello world");
});

test("the formatted text stays selected after a tool, so tools stack", async ({ page }) => {
    const ta = await selectWord(page);
    await page.getByRole("button", { name: "Bold" }).click();
    const sel = await ta.evaluate((el: HTMLTextAreaElement) => el.value.slice(el.selectionStart, el.selectionEnd));
    expect(sel).toBe("hello");
});

test("typing after a tool, undo removes the typing (WebKit also removes the tool: it merges the two)", async ({ page, browserName }) => {
    const ta = await selectWord(page);
    await page.getByRole("button", { name: "Bold" }).click();
    await ta.evaluate((el: HTMLTextAreaElement) => el.setSelectionRange(el.value.length, el.value.length));
    await page.keyboard.type("!");
    await expect(ta).toHaveValue("**hello** world!");
    await page.keyboard.press(UNDO);
    await expect(ta).toHaveValue(browserName === "webkit" ? "hello world" : "**hello** world");
});

test("the value submits with a form under the field name", async ({ page }) => {
    const ta = await selectWord(page);
    await page.getByRole("button", { name: "Bold" }).click();
    const submitted = await ta.evaluate((el: HTMLTextAreaElement) => {
        const form = document.createElement("form");
        el.before(form);
        form.append(el);
        return new FormData(form).get("body");
    });
    expect(submitted).toBe("**hello** world");
});
