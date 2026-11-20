import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test("install blocks expose one labelled tab set and copy the exact command", async ({
    context,
    page,
}) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/getting-started/");
    await page.waitForLoadState("networkidle");

    const tablists = page.getByRole("tablist");
    await expect(tablists).toHaveCount(8);

    const react = page.locator(".package-manager-tabs").first();
    await expect(react.getByRole("tablist")).toHaveAccessibleName("Install React packages");
    await expect(react.getByRole("tab", { selected: true })).toHaveText("pnpm");
    await expect(react.getByRole("tabpanel")).toContainText(
        "pnpm add @lilydesignsystem/react-headless @lilydesignsystem/themes",
    );
    await expect(react.getByRole("button", { name: "Copy the pnpm command" })).toBeVisible();

    await react.getByRole("tab", { name: "npm", exact: true }).click();
    await expect(react.getByRole("tab", { selected: true })).toHaveText("npm");
    await expect(react.getByRole("tabpanel")).toContainText(
        "npm install @lilydesignsystem/react-headless @lilydesignsystem/themes",
    );
    await expect(react.getByRole("button", { name: "Copy the npm command" })).toBeVisible();

    await react.getByRole("button", { name: "Copy the npm command" }).click();
    await expect(react.getByRole("status")).toHaveText("npm command copied");
    await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe("npm install @lilydesignsystem/react-headless @lilydesignsystem/themes");

    const { violations } = await new AxeBuilder({ page })
        .include(".package-manager-tabs")
        .withTags(wcagTags)
        .analyze();
    expect(violations).toEqual([]);
});

test("package-manager tabs support arrow-key focus and manual activation", async ({ page }) => {
    await page.goto("/tutorials/solid/");
    await page.waitForLoadState("networkidle");

    const tabs = page.getByRole("tablist", { name: "Install Solid packages" });
    const pnpm = tabs.getByRole("tab", { name: "pnpm" });
    const npm = tabs.getByRole("tab", { name: "npm", exact: true });

    await pnpm.focus();
    await page.keyboard.press("ArrowRight");
    await expect(npm).toBeFocused();
    await expect(pnpm).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Enter");
    await expect(npm).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText(
        "npm install @lilydesignsystem/solid-headless @lilydesignsystem/themes",
    );
});

test("every tutorial package-install block uses the shared recipe", async ({ page }) => {
    const tutorials = [
        {
            route: "/tutorials/solid/",
            label: "Install Solid packages",
            command: "pnpm add @lilydesignsystem/solid-headless @lilydesignsystem/themes",
        },
        {
            route: "/tutorials/web-components/",
            label: "Install Web Components packages",
            command: "pnpm add @lilydesignsystem/web-components-headless",
        },
        {
            route: "/tutorials/alpine/",
            label: "Install Alpine packages",
            command: "pnpm add alpinejs @lilydesignsystem/alpine-headless",
        },
    ];

    for (const { route, label, command } of tutorials) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const tabs = page.getByRole("tablist", { name: label });
        await expect(tabs.getByRole("tab")).toHaveCount(4);
        await expect(tabs.getByRole("tab", { selected: true })).toHaveText("pnpm");
        await expect(page.getByRole("tabpanel")).toContainText(command);
    }
});
