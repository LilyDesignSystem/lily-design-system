import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ThemePicker } from "./theme-picker.component";

// Order of themes (spec/theme-picker, 2026-11-21): alphabetical by the name shown, in the page's language.

const labels = {
    "ibm-carbon": "IBM Carbon",
    "adobe-spectrum": "Adobe Spectrum",
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    light: "Light",
    dark: "Dark",
};
const themes = Object.keys(labels);

let fixtures: ComponentFixture<unknown>[] = [];
const flush = () => new Promise<void>((r) => setTimeout(r, 0));

async function mount(inputs: Record<string, unknown> = {}): Promise<ComponentFixture<ThemePicker>> {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", "/assets/themes/");
    fixture.componentRef.setInput("themes", themes);
    fixture.componentRef.setInput("themeLabels", labels);
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    fixtures.push(fixture);
    await flush();
    fixture.detectChanges();
    return fixture;
}
const names = (f: ComponentFixture<unknown>, selector = ".theme-picker-option") =>
    Array.from(f.nativeElement.querySelectorAll(selector) as NodeListOf<HTMLElement>).map((o) =>
        o.textContent?.trim(),
    );

beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ThemePicker] });
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    localStorage.clear();
});
afterEach(() => {
    for (const f of fixtures) f.destroy();
    fixtures = [];
});

describe("ThemePicker: order of themes", () => {
    test("lists the themes alphabetically by the name shown, in one list", async () => {
        expect(names(await mount())).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("'Follow this device' is first, then the sorted themes", async () => {
        expect(names(await mount({ systemLabel: "Follow this device" }))).toEqual([
            "Follow this device",
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("sortThemes false keeps the order of `themes`", async () => {
        expect(names(await mount({ sortThemes: false }))).toEqual([
            "IBM Carbon",
            "Adobe Spectrum",
            "NHS England (patients)",
            "Light",
            "Dark",
        ]);
    });

    test("a title-cased slug is the name when there is no label", async () => {
        expect(
            names(await mount({ themes: ["zeta-one", "alpha-two", "mid"], themeLabels: {} })),
        ).toEqual(["Alpha Two", "Mid", "Zeta One"]);
    });

    test("uses the page's language, and sorts again when it changes", async () => {
        document.documentElement.setAttribute("lang", "en");
        const f = await mount({ themes: ["a", "z"], themeLabels: { a: "Äpple", z: "Zebra" } });
        expect(names(f)).toEqual(["Äpple", "Zebra"]);
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        f.detectChanges();
        expect(names(f)).toEqual(["Zebra", "Äpple"]);
    });

    test("the native select variant is sorted the same way", async () => {
        const f = await mount({ variant: "select" });
        expect(names(f, "option.theme-picker-option")).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });
});
