import { test, expect } from "@playwright/test";

// Actions and media, on /demos/actions, with real clicks and real scrolling. The clipboard and <video> are stubbed: WebKit
// has no clipboard permission to grant, and the page has no video file. The stubs record the calls the components make.
//
// What IS asserted: the text reaching the clipboard call, a timer firing once, a link or a button, a fixed corner, an
// element's visibility, play and pause by scrolling, the video time following the scroll.
// What is NOT asserted: real playback, the system clipboard, styling.

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        const w = window as unknown as Record<string, unknown>;
        w.copied = [];
        w.refuse = false;
        Object.defineProperty(navigator, "clipboard", {
            value: {
                writeText: (text: string) => {
                    if (w.refuse) return Promise.reject(new Error("denied"));
                    (w.copied as string[]).push(text);
                    return Promise.resolve();
                },
            },
        });
        w.media = [];
        const media = w.media as string[];
        HTMLMediaElement.prototype.play = function () {
            media.push("play");
            return Promise.resolve();
        };
        HTMLMediaElement.prototype.pause = function () {
            media.push("pause");
        };
        Object.defineProperty(HTMLMediaElement.prototype, "duration", { get: () => 100 });
        Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
            set(value: number) {
                w.time = value;
            },
            get() {
                return w.time ?? 0;
            },
        });
    });
    await page.goto("/demos/actions");
    // Interactive once the first copy is reported; hydration can swallow a click, so look before clicking again.
    const copy = page.getByTestId("copy").locator("button");
    await expect(async () => {
        await copy.click();
        await expect(copy).toHaveAttribute("data-copied", "true", { timeout: 1000 });
    }).toPass({ timeout: 30_000 });
});

const lastScroll = (page: import("@playwright/test").Page, testId: string) =>
    page.getByTestId(testId).evaluate((node) => node.scrollIntoView({ block: "center" }));

test("clipboard copy: the text reaches the clipboard, and the mark clears", async ({ page }) => {
    expect(await page.evaluate(() => (window as unknown as { copied: string[] }).copied)).toContain(
        "copy me",
    );
    await expect(page.getByTestId("copy").locator("button")).toHaveAttribute(
        "data-copied",
        "false",
        { timeout: 4000 },
    );
});

test("clipboard copy: a refusal reports and marks nothing", async ({ page }) => {
    await expect(page.getByTestId("copy").locator("button")).toHaveAttribute(
        "data-copied",
        "false",
        { timeout: 4000 },
    );
    await page.evaluate(() => ((window as unknown as { refuse: boolean }).refuse = true));
    await page.getByTestId("copy").locator("button").click();
    await expect(page.getByTestId("copy-state")).toContainText("failed: yes");
    await expect(page.getByTestId("copy").locator("button")).toHaveAttribute(
        "data-copied",
        "false",
    );
});

test("timer button: fires once at the end of its countdown, and a press fires at once", async ({
    page,
}) => {
    await expect(page.getByTestId("timer-state")).toContainText("Timer: 1", { timeout: 5000 });
    await page.getByRole("button", { name: "Long" }).click();
    await expect(page.getByTestId("timer-state")).toContainText("pressed: 1");
    await page.getByRole("button", { name: "Long" }).click();
    await expect(page.getByTestId("timer-state")).toContainText("Timer: 1, pressed: 1");
});

test("float button: stays in its corner while the page scrolls", async ({ page }) => {
    const button = page.getByRole("button", { name: "Help" });
    await expect(button).toBeInViewport();
    await page.mouse.wheel(0, 800);
    await expect(button).toBeInViewport();
    await button.click();
    await expect(page.getByTestId("float-state")).toHaveText("Floats: 1");
});

test("call to action: a link with href, a button without", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Join" })).toHaveAttribute("href", /#join$/);
    await page.getByRole("button", { name: "Act" }).click();
    await expect(page.getByTestId("cta-state")).toHaveText("Acted: 1");
});

test("visible: follows the viewport", async ({ page }) => {
    await expect(page.getByText("Off screen")).toBeAttached();
    await lastScroll(page, "visible");
    await expect(page.getByText("On screen")).toBeVisible();
});

test("video player: plays in view and pauses out of it", async ({ page }) => {
    const calls = () => page.evaluate(() => (window as unknown as { media: string[] }).media);
    await page
        .locator("video.video-player-element")
        .evaluate((node) => node.scrollIntoView({ block: "center" }));
    await expect.poll(calls).toContain("play");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(calls).toContain("pause");
    expect(
        await page
            .locator("video.video-player-element")
            .evaluate((node: HTMLVideoElement) => node.muted),
    ).toBe(true);
});

test("scroller video: the step and the video's time follow the scroll", async ({ page }) => {
    await page
        .locator(".scroller-base section")
        .nth(1)
        .evaluate((node) => node.scrollIntoView({ block: "center" }));
    await expect(page.getByTestId("scroller-state")).toContainText("Step: 1");
    await expect(page.getByTestId("scroller-state")).toContainText(/moved: true/i);
    await expect
        .poll(() => page.evaluate(() => (window as unknown as { time?: number }).time ?? 0))
        .toBeGreaterThan(0);
});
