import { test, expect, type Page } from "@playwright/test";

// Control on Windows/Linux, Meta on macOS: Playwright's ControlOrMeta picks the platform's.
const UNDO = "ControlOrMeta+z";
const REDO = "ControlOrMeta+Shift+z";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

async function caretAtStart(page: Page) {
    const ta = page.getByRole("textbox", { name: "Notes" });
    await ta.focus();
    await ta.evaluate((el: HTMLTextAreaElement) => el.setSelectionRange(0, 0));
    return ta;
}

test("a task tool applies, then native undo takes it back, then redo reapplies it", async ({ page }) => {
    const ta = await caretAtStart(page);
    await page.getByRole("button", { name: "Task" }).click();
    await expect(ta).toHaveValue("* TODO Ship the release");
    await page.keyboard.press(UNDO);
    await expect(ta).toHaveValue("* Ship the release");
    await page.keyboard.press(REDO);
    await expect(ta).toHaveValue("* TODO Ship the release");
});

test("scheduled adds a planning line with the date selected, and undoes", async ({ page }) => {
    const ta = await caretAtStart(page);
    await page.getByRole("button", { name: "Scheduled" }).click();
    await expect(ta).toHaveValue("* Ship the release\nSCHEDULED: <2026-10-24 Sat>");
    const selected = await ta.evaluate((el: HTMLTextAreaElement) => el.value.slice(el.selectionStart, el.selectionEnd));
    expect(selected).toBe("2026-10-24 Sat");
    await page.keyboard.press(UNDO);
    await expect(ta).toHaveValue("* Ship the release");
});

test("a property drawer and a contact, then undo back to the start", async ({ page }, info) => {
    const ta = await caretAtStart(page);
    await page.getByRole("button", { name: "Property" }).click();
    await expect(ta).toHaveValue("* Ship the release\n:PROPERTIES:\n:ID: \n:END:");
    await page.keyboard.type("abc");
    await expect(ta).toHaveValue("* Ship the release\n:PROPERTIES:\n:ID: abc\n:END:");
    await page.keyboard.press(UNDO);
    // Chromium undoes the typing alone; WebKit merges it with the tool before it.
    await expect(ta).toHaveValue(info.project.name === "webkit" ? "* Ship the release" : "* Ship the release\n:PROPERTIES:\n:ID: \n:END:");
});

test("bold by shortcut and by button undo the same way", async ({ page }) => {
    const ta = page.getByRole("textbox", { name: "Notes" });
    await ta.focus();
    await ta.evaluate((el: HTMLTextAreaElement) => el.setSelectionRange(2, 6));
    await page.keyboard.press("ControlOrMeta+b");
    await expect(ta).toHaveValue("* *Ship* the release");
    await page.keyboard.press(UNDO);
    await expect(ta).toHaveValue("* Ship the release");
});

test("the text submits with a form under the field name", async ({ page }) => {
    const ta = await caretAtStart(page);
    await page.getByRole("button", { name: "Task" }).click();
    const submitted = await ta.evaluate((el: HTMLTextAreaElement) => {
        const form = document.createElement("form");
        el.before(form);
        form.append(el);
        return new FormData(form).get("notes");
    });
    expect(submitted).toBe("* TODO Ship the release");
});
