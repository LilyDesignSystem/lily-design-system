// Builds the site into a temporary directory and checks the pages it writes.
import { mkdtempSync, readFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { buildSite, catalog } from "../build.mjs";

let out;
let pages;
const read = (path) => readFileSync(join(out, path), "utf8");

beforeAll(async () => {
  out = mkdtempSync(join(tmpdir(), "lily-alpine-examples-"));
  pages = await buildSite(out);
}, 120000);

afterAll(() => rmSync(out, { recursive: true, force: true }));

describe("the three required routes", () => {
  test("/ is a home page that links to the components and the helpers", () => {
    const html = read("index.html");
    expect(html).toContain('href="/components/"');
    expect(html).toContain('href="/helpers/"');
    expect(html).toContain(`All ${catalog().length} Lily components`);
  });

  test("/components/ lists every catalog component once, each linking to its page", () => {
    const html = read("components/index.html");
    const all = catalog();
    expect(all).toHaveLength(571);
    expect((html.match(/<li data-text=/g) ?? []).length).toBe(all.length);
    for (const c of all) expect(html).toContain(`href="/components/${c.slug}/"`);
    expect(html).toContain('type="search"');
    expect(html).toContain('role="status"');
  });

  test("/components/{slug} exists for every component: a demo, its markup, a heading", () => {
    for (const c of catalog()) {
      const file = `components/${c.slug}/index.html`;
      expect(existsSync(join(out, file)), file).toBe(true);
      const html = read(file);
      expect(html, c.slug).toContain(`<h1 id="page-heading">${c.name}</h1>`);
      expect(html, c.slug).toContain('<div class="demo" id="demo">');
      expect(html, c.slug).toMatch(new RegExp(`class=(&quot;|")${c.slug}[ "&]`));
    }
  });
});

describe("every page", () => {
  test("has the skip link first, the landmarks, a theme and the app script", () => {
    const sample = ["index.html", "components/index.html", "components/dial/index.html", "helpers/index.html", "helpers/gantt-chart/index.html"];
    for (const file of sample) {
      const html = read(file);
      expect(html.indexOf('<a class="skip-link"'), file).toBeLessThan(html.indexOf("<header"));
      expect(html, file).toContain('<main id="main-content"');
      expect(html, file).toContain('<nav class="site-nav" aria-label="Main navigation">');
      expect(html, file).toContain('<footer class="site-footer"');
      expect(html, file).toContain('<html lang="en">');
      expect(html, file).toContain('src="/assets/theme-boot.js"');
      expect(html, file).toContain('type="module" src="/assets/app.js"');
    }
  });

  test("writes the page count it reports", () => {
    expect(pages).toBe(1 + 1 + 571 + 1 + 4);
  });
});

describe("assets", () => {
  test("bundles Alpine once and ships the themes the switcher offers", () => {
    expect(existsSync(join(out, "assets", "app.js"))).toBe(true);
    expect(readFileSync(join(out, "assets", "app.js"), "utf8")).toContain("lilyDataGrid");
    const themes = readdirSync(join(out, "themes")).filter((f) => f.endsWith(".css"));
    expect(themes.length).toBeGreaterThanOrEqual(57);
    const list = readFileSync(join(out, "assets", "themes.js"), "utf8");
    expect(list).toContain("united-kingdom-national-health-service-england-for-patients");
    expect(existsSync(join(out, "themes", "united-kingdom-national-health-service-england-for-patients.css"))).toBe(true);
  });
});

describe("demos", () => {
  test("every aria-label is filled in the demo but the markup shown stays the shipped snippet", () => {
    const html = read("components/dial/index.html");
    expect(html).toContain('aria-label="Dial"');
    expect(html).toContain("&lt;!-- Consumer provides the dial face --&gt;");
  });

  test("a comment inside a list, table or select stays a comment", () => {
    const html = read("components/menu/index.html");
    expect(html).not.toMatch(/<ul[^>]*>\s*Consumer provides/);
  });

  test("the helper pages carry their options script before the demo", () => {
    for (const [page, option] of [["data-grid", "gridOptions"], ["kanban-board", "boardOptions"], ["calendar", "calendarOptions"], ["gantt-chart", "ganttOptions"]]) {
      const html = read(`helpers/${page}/index.html`);
      expect(html.indexOf(`window.${option} =`), page).toBeGreaterThan(-1);
      expect(html.indexOf(`window.${option} =`), page).toBeLessThan(html.indexOf('<div class="demo"'));
    }
  });
});
