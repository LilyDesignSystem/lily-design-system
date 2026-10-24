import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { zoneNameCount, zoneNamesFrom, type ZoneNamePack } from "./zone-names.js";

const here = dirname(fileURLToPath(import.meta.url));
const packDir = existsDir(join(here, "zone-names")) ? join(here, "zone-names") : join(here, "..", "zone-names");
function existsDir(p: string): boolean {
    try {
        readdirSync(p);
        return true;
    } catch {
        return false;
    }
}
const load = (tag: string): ZoneNamePack => JSON.parse(readFileSync(join(packDir, `${tag}.json`), "utf8"));
const tags = readdirSync(packDir).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort();

describe("zoneNamesFrom", () => {
    const pack: ZoneNamePack = { locale: "xx-001", cldrLocale: "xx", cldr: "48.0", names: ["Std", "Dst", "All"], zones: { "A/B": [0, 1], "C/D": 2, "E/F": 99, "G/H": [0, 99] } };
    it("expands an index to a name and a pair to [standard, daylight]", () => {
        const names = zoneNamesFrom(pack);
        expect(names["A/B"]).toEqual(["Std", "Dst"]);
        expect(names["C/D"]).toBe("All");
    });
    it("leaves out a zone whose index is missing, and keeps only the standard name when the daylight one is missing", () => {
        const names = zoneNamesFrom(pack);
        expect("E/F" in names).toBe(false);
        expect(names["G/H"]).toBe("Std");
    });
    it("counts the zones named", () => {
        expect(zoneNameCount(pack)).toBe(4);
    });
});

describe("the zone-name packs", () => {
    it("exist for every label-pack locale", () => {
        const labelDir = existsDir(join(here, "label-packs")) ? join(here, "label-packs") : join(here, "..", "label-packs");
        const labels = readdirSync(labelDir).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort();
        expect(tags).toEqual(labels);
    });
    it("name themselves, say which CLDR they come from, and index only names that exist", () => {
        for (const tag of tags) {
            const pack = load(tag);
            expect(pack.locale).toBe(tag);
            expect(pack.cldr).toMatch(/^\d+(\.\d+)?$/);
            for (const at of Object.values(pack.zones)) {
                for (const i of typeof at === "number" ? [at] : at) expect(pack.names[i], `${tag}`).toBeTypeOf("string");
            }
            expect(new Set(pack.names).size, `${tag}: names are unique`).toBe(pack.names.length);
        }
    });
    it("hold real translations: French differs from English, and Paris is named in each", () => {
        const fr = zoneNamesFrom(load("fr-001"));
        const en = zoneNamesFrom(load("en-001"));
        expect(fr["Europe/Paris"]).not.toEqual(en["Europe/Paris"]);
        expect(en["Europe/Paris"]).toEqual(["Central European Standard Time", "Central European Summer Time"]);
        expect(fr["Europe/Paris"]![0]).toMatch(/Europe centrale/);
        expect(zoneNamesFrom(load("ja-001"))["Asia/Tokyo"]).toBe("日本標準時");
    });
    it("never lend another language's text: a name is not the English name unless CLDR's own is that", () => {
        const en = zoneNamesFrom(load("en-001"));
        for (const tag of ["ar-001", "ja-001", "ru-001", "zh-001", "ko-001", "hi-001", "th-001"]) {
            const names = zoneNamesFrom(load(tag));
            const same = Object.keys(names).filter((z) => JSON.stringify(names[z]) === JSON.stringify(en[z]));
            expect(same.length, `${tag} has ${same.length} names equal to English`).toBeLessThan(5);
        }
    });
    it("are empty, honestly, where CLDR has no zone names (Cornish, Scots, Wu)", () => {
        for (const tag of ["kw-001", "sco-001", "wuu-001"]) expect(zoneNameCount(load(tag))).toBe(0);
    });
    it("cover the common zones in the major languages", () => {
        for (const tag of ["ar-001", "de-001", "es-001", "fr-001", "hi-001", "it-001", "ja-001", "ko-001", "pt-001", "ru-001", "zh-001"]) {
            const names = zoneNamesFrom(load(tag));
            for (const zone of ["Europe/London", "America/New_York", "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney", "UTC"]) {
                expect(names[zone], `${tag} ${zone}`).toBeDefined();
            }
        }
    });
});
