import { render, screen, cleanup } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { tick } from "svelte";

import ThemePicker from "./ThemePicker.svelte";

// Order of themes (spec/theme-picker, 2026-11-21): alphabetical by the name shown, in the page's language.

const labels = {
    "ibm-carbon": "IBM Carbon",
    "adobe-spectrum": "Adobe Spectrum",
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    light: "Light",
    dark: "Dark",
};
const themes = Object.keys(labels);
const base = { label: "Theme", themesUrl: "/assets/themes/", themes, themeLabels: labels };

const names = () =>
    screen.getAllByRole("option", { hidden: true }).map((o) => o.textContent?.trim());

beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    localStorage.clear();
});
afterEach(() => cleanup());

describe("ThemePicker: order of themes", () => {
    test("lists the themes alphabetically by the name shown, in one list", () => {
        render(ThemePicker, { props: base });
        expect(names()).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("'Follow this device' is first, then the sorted themes", () => {
        render(ThemePicker, { props: { ...base, systemLabel: "Follow this device" } });
        expect(names()).toEqual([
            "Follow this device",
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("sortThemes={false} keeps the order of `themes`", () => {
        render(ThemePicker, { props: { ...base, sortThemes: false } });
        expect(names()).toEqual([
            "IBM Carbon",
            "Adobe Spectrum",
            "NHS England (patients)",
            "Light",
            "Dark",
        ]);
    });

    test("a title-cased slug is the name when there is no label", () => {
        render(ThemePicker, {
            props: { label: "Theme", themesUrl: "/t/", themes: ["zeta-one", "alpha-two", "mid"] },
        });
        expect(names()).toEqual(["Alpha Two", "Mid", "Zeta One"]);
    });

    test("uses the page's language, and sorts again when it changes", async () => {
        const swedish = { a: "Äpple", z: "Zebra" };
        document.documentElement.setAttribute("lang", "en");
        render(ThemePicker, {
            props: { label: "Theme", themesUrl: "/t/", themes: ["a", "z"], themeLabels: swedish },
        });
        expect(names()).toEqual(["Äpple", "Zebra"]);
        document.documentElement.setAttribute("lang", "sv");
        await new Promise((r) => setTimeout(r, 0));
        await tick();
        expect(names()).toEqual(["Zebra", "Äpple"]);
    });

    test("the native select variant is sorted the same way", () => {
        render(ThemePicker, { props: { ...base, variant: "select" } });
        const select = screen.getByRole("combobox");
        const options = Array.from(select.querySelectorAll("option")).map((o) =>
            o.textContent?.trim(),
        );
        expect(options).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });
});
