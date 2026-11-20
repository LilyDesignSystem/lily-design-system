import { test, expect } from "@playwright/test";

test("component AI links carry only the public Markdown URL", async ({ page }) => {
    await page.goto("/components/button/");

    const markdownUrl = "https://lilydesignsystem.com/components/button.md";
    await expect(page.getByRole("link", { name: "Open in ChatGPT" })).toHaveAttribute(
        "href",
        `https://chatgpt.com/?q=${encodeURIComponent(markdownUrl)}`,
    );
    await expect(page.getByRole("link", { name: "Open in Claude" })).toHaveAttribute(
        "href",
        `https://claude.ai/new?q=${encodeURIComponent(markdownUrl)}`,
    );
    await expect(page.getByRole("link", { name: "View source" })).toHaveAttribute(
        "href",
        "https://github.com/LilyDesignSystem/lily-design-system/tree/main/components/button",
    );

    for (const name of ["Open in ChatGPT", "Open in Claude"]) {
        const href = await page.getByRole("link", { name }).getAttribute("href");
        expect(new URL(href!).searchParams.get("q")).toBe(markdownUrl);
        expect([...new URL(href!).searchParams]).toHaveLength(1);
    }
});

test("the components index does not offer links for a nonexistent Markdown page", async ({
    page,
}) => {
    await page.goto("/components/");
    await expect(page.getByRole("link", { name: "Open in ChatGPT" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Open in Claude" })).toHaveCount(0);
});
