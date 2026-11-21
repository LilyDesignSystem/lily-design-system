import { render, screen, cleanup } from "./test-utils";
import { flush as flushUpdates } from "solid-js";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import ThemePicker from "./ThemePicker";

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
const flush = async () => {
    await new Promise((r) => setTimeout(r, 0));
    flushUpdates();
};

beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    localStorage.clear();
});
afterEach(() => cleanup());

describe("ThemePicker: order of themes", () => {
    test("lists the themes alphabetically by the name shown, in one list", async () => {
        render(() => <ThemePicker {...base} />);
        await flush();
        expect(names()).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("'Follow this device' is first, then the sorted themes", async () => {
        render(() => (
            <ThemePicker
                {...base}
                systemLabel="Follow this device"
            />
        ));
        await flush();
        expect(names()).toEqual([
            "Follow this device",
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("sortThemes={false} keeps the order of `themes`", async () => {
        render(() => (
            <ThemePicker
                {...base}
                sortThemes={false}
            />
        ));
        await flush();
        expect(names()).toEqual([
            "IBM Carbon",
            "Adobe Spectrum",
            "NHS England (patients)",
            "Light",
            "Dark",
        ]);
    });

    test("a title-cased slug is the name when there is no label", async () => {
        render(() => (
            <ThemePicker
                label="Theme"
                themesUrl="/t/"
                themes={["zeta-one", "alpha-two", "mid"]}
            />
        ));
        await flush();
        expect(names()).toEqual(["Alpha Two", "Mid", "Zeta One"]);
    });

    test("uses the page's language, and sorts again when it changes", async () => {
        document.documentElement.setAttribute("lang", "en");
        render(() => (
            <ThemePicker
                label="Theme"
                themesUrl="/t/"
                themes={["a", "z"]}
                themeLabels={{ a: "Äpple", z: "Zebra" }}
            />
        ));
        await flush();
        expect(names()).toEqual(["Äpple", "Zebra"]);
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names()).toEqual(["Zebra", "Äpple"]);
    });

    test("the native select variant is sorted the same way", async () => {
        render(() => (
            <ThemePicker
                {...base}
                variant="select"
            />
        ));
        await flush();
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
