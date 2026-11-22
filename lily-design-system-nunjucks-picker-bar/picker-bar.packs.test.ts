// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import { describe, expect, test } from "vitest";

import { pickerBarLabels, shareLabels, type LabelPack } from "../shared/label-pack";

// tasks.md P41-T9: a Nunjucks app takes the page-header picker names from a label pack with `pickerBarLabels(pack)` (the same function
// every catalog uses; the Nunjucks locale-translations package re-exports it) and passes the result straight to the macro's `labels`.
// This renders the real macro with the names of several packs and checks each control is named by its pack, in its own language.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure([__dirname, path.join(__dirname, "..")], {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});
const pack = (locale: string): LabelPack =>
    JSON.parse(
        readFileSync(path.join(__dirname, "..", "shared", "label-packs", `${locale}.json`), "utf8"),
    );

function render(labels: Record<string, string | undefined>): HTMLElement {
    const html = env.renderString(
        `{% from "./picker-bar.njk" import pickerBar %}{{ pickerBar(opts) }}`,
        { opts: { labels, themesUrl: "/assets/themes/", locales: ["en", "cy"] } },
    );
    document.body.innerHTML = html;
    return document.body.querySelector("[data-lily-picker-bar-root]") as HTMLElement;
}
const nameOf = (root: HTMLElement, button: string) =>
    root.querySelector(`.${button}-button`)?.getAttribute("aria-label");

describe("picker-bar with the names of a label pack", () => {
    test.each(["en-001", "cy-001", "de-001", "ja-001", "ar-001", "es-001"])(
        "%s: every control is named by its pack",
        (locale) => {
            const names = pickerBarLabels(pack(locale));
            const root = render(names);
            expect(nameOf(root, "theme-picker")).toBe(names.theme);
            expect(nameOf(root, "locale-picker")).toBe(names.locale);
            expect(nameOf(root, "text-size-picker")).toBe(names.textSize);
            expect(nameOf(root, "search-picker")).toBe(names.search);
            expect(nameOf(root, "share-picker")).toBe(names.share);
            // Named by something, never blank.
            for (const button of ["theme", "locale", "text-size", "search", "share"])
                expect(nameOf(root, `${button}-picker`) ?? "").not.toBe("");
        },
    );

    test("the English pack's names are the plural nouns the spec chose", () => {
        const names = pickerBarLabels(pack("en-001"));
        expect(names.theme).toBe("Themes");
        expect(names.locale).toBe("Locales");
        expect(names.textSize).toBe("Text Sizes");
        expect(names.search).toBe("Search");
        expect(names.share).toBe("Share");
    });

    test("another language's pack is not the English one", () => {
        expect(pickerBarLabels(pack("de-001")).theme).not.toBe(
            pickerBarLabels(pack("en-001")).theme,
        );
        expect(pickerBarLabels(pack("ja-001")).share).not.toBe("Share");
    });

    test("a name the pack lacks leaves that control unnamed and the others named (no other language's text)", () => {
        const names = pickerBarLabels({
            pickers: { theme: "Themes", locale: "Locales" },
        } as unknown as LabelPack);
        expect(Object.keys(names).sort()).toEqual(["locale", "theme"]);
        const root = render(names);
        expect(nameOf(root, "theme-picker")).toBe("Themes");
        expect(
            root.querySelector(".text-size-picker-button")?.getAttribute("aria-label") ?? "",
        ).not.toMatch(/[A-Za-z]{3,}/);
    });

    test("the share messages come from the same pack under the share picker's own prop names", () => {
        const messages = shareLabels(pack("cy-001"));
        expect(Object.keys(messages).sort()).toEqual([
            "copiedLabel",
            "copyFailedLabel",
            "copyLabel",
        ]);
        for (const message of Object.values(messages)) expect(message).toBeTruthy();
    });
});
