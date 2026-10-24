import { describe, expect, it } from "vitest";
import { DEFAULT_ZONES, defaultLabel, formatOffset, isDaylightTime, matchZone, offsetMinutes, orderedZones, zoneInfo, zoneName } from "./zones.js";

// A winter date and a summer date, so daylight saving time is exercised in both hemispheres.
const WINTER = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
const SUMMER = new Date(Date.UTC(2026, 6, 15, 12, 0, 0));

describe("offsetMinutes", () => {
    it("is minutes east of UTC", () => {
        expect(offsetMinutes("UTC", WINTER)).toBe(0);
        expect(offsetMinutes("Europe/Paris", WINTER)).toBe(60);
        expect(offsetMinutes("America/New_York", WINTER)).toBe(-300);
        expect(offsetMinutes("Asia/Tokyo", WINTER)).toBe(540);
    });
    it("handles half and quarter hour offsets", () => {
        expect(offsetMinutes("Asia/Kolkata", WINTER)).toBe(330);
        expect(offsetMinutes("Asia/Kathmandu", WINTER)).toBe(345);
        expect(offsetMinutes("America/St_Johns", WINTER)).toBe(-210);
        expect(offsetMinutes("Australia/Eucla", WINTER)).toBe(525);
    });
    it("follows daylight saving time, in both hemispheres", () => {
        expect(offsetMinutes("Europe/Paris", SUMMER)).toBe(120);
        expect(offsetMinutes("America/New_York", SUMMER)).toBe(-240);
        expect(offsetMinutes("Australia/Sydney", WINTER)).toBe(660);
        expect(offsetMinutes("Australia/Sydney", SUMMER)).toBe(600);
    });
    it("is the offset at that instant, not today's", () => {
        expect(offsetMinutes("Europe/London", new Date(Date.UTC(2026, 2, 29, 0, 59)))).toBe(0);
        expect(offsetMinutes("Europe/London", new Date(Date.UTC(2026, 2, 29, 1, 1)))).toBe(60);
    });
    it("is undefined for a zone the runtime does not know", () => {
        expect(offsetMinutes("Mars/Olympus_Mons", WINTER)).toBeUndefined();
        expect(offsetMinutes("", WINTER)).toBeUndefined();
    });
});

describe("formatOffset", () => {
    it("writes sign, hours and minutes in ASCII", () => {
        expect(formatOffset(0)).toBe("UTC+00:00");
        expect(formatOffset(60)).toBe("UTC+01:00");
        expect(formatOffset(330)).toBe("UTC+05:30");
        expect(formatOffset(-210)).toBe("UTC-03:30");
        expect(formatOffset(-720)).toBe("UTC-12:00");
        expect(formatOffset(840)).toBe("UTC+14:00");
    });
});

describe("zoneName", () => {
    it("is the zone's full name in the locale", () => {
        expect(zoneName("America/New_York", "en", WINTER)).toBe("Eastern Standard Time");
        expect(zoneName("America/New_York", "en", SUMMER)).toBe("Eastern Daylight Time");
        expect(zoneName("Asia/Kolkata", "en", WINTER)).toBe("India Standard Time");
        expect(zoneName("Europe/Paris", "en", WINTER)).toBe("Central European Standard Time");
    });
    it("follows the locale: the same zone in other languages", () => {
        expect(zoneName("Europe/Paris", "fr", WINTER)).toMatch(/Europe centrale/);
        expect(zoneName("Europe/Paris", "de", WINTER)).toMatch(/Mitteleuropäische/);
        expect(zoneName("Asia/Tokyo", "ja", WINTER)).toMatch(/日本/);
    });
    it("is undefined for an unknown zone or an invalid locale", () => {
        expect(zoneName("Mars/Olympus_Mons", "en", WINTER)).toBeUndefined();
        expect(zoneName("UTC", "not a locale!", WINTER)).toBeUndefined();
    });
});

describe("zoneInfo", () => {
    it("carries the id, offset, name and the default label", () => {
        const z = zoneInfo("Asia/Kolkata", "en", WINTER)!;
        expect(z.id).toBe("Asia/Kolkata");
        expect(z.offsetMinutes).toBe(330);
        expect(z.offset).toBe("UTC+05:30");
        expect(z.name).toBe("India Standard Time");
        expect(z.label).toBe("UTC+05:30 – India Standard Time");
        expect(defaultLabel(z)).toBe(z.label);
    });
    it("takes a labelFor override", () => {
        expect(zoneInfo("UTC", "en", WINTER, (z) => `${z.name} / ${z.offset}`)!.label).toBe("Coordinated Universal Time / UTC+00:00");
    });
    it("is undefined for an unknown zone", () => {
        expect(zoneInfo("Nowhere/Land", "en", WINTER)).toBeUndefined();
    });
});

describe("orderedZones", () => {
    const zones = orderedZones(DEFAULT_ZONES, "en", WINTER);

    it("is ordered by offset, west to east", () => {
        const minutes = zones.map((z) => z.offsetMinutes);
        expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
        expect(zones[0].offset).toBe("UTC-11:00");
        expect(zones[zones.length - 1].offset).toBe("UTC+14:00");
    });
    it("lists every default zone the runtime knows, once each", () => {
        expect(new Set(zones.map((z) => z.id)).size).toBe(zones.length);
        expect(zones.length).toBe(DEFAULT_ZONES.length);
    });
    it("breaks ties by name, then id", () => {
        const tie = orderedZones(["Europe/Paris", "Africa/Lagos", "Europe/Berlin"], "en", WINTER);
        expect(tie.map((z) => z.offsetMinutes)).toEqual([60, 60, 60]);
        const names = tie.map((z) => z.name);
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en")));
        const same = orderedZones(["Europe/Paris", "Europe/Berlin"], "en", WINTER);
        expect(same.map((z) => z.id)).toEqual(["Europe/Berlin", "Europe/Paris"]);
    });
    it("leaves out an unknown zone and a repeated one", () => {
        const some = orderedZones(["UTC", "Nowhere/Land", "UTC", "Asia/Tokyo"], "en", WINTER);
        expect(some.map((z) => z.id)).toEqual(["UTC", "Asia/Tokyo"]);
    });
    it("re-orders when daylight saving time moves a zone", () => {
        const idx = (date: Date, id: string) => orderedZones(["Europe/Paris", "Africa/Lagos", "Europe/London"], "en", date).findIndex((z) => z.id === id);
        expect(idx(WINTER, "Europe/London")).toBe(0);
        expect(idx(SUMMER, "Europe/London")).toBe(0);
        const summer = orderedZones(["Europe/Paris", "Africa/Lagos"], "en", SUMMER);
        expect(summer.map((z) => z.id)).toEqual(["Africa/Lagos", "Europe/Paris"]);
    });
    it("names the zones in the locale it is given", () => {
        expect(orderedZones(["Europe/Paris"], "fr", WINTER)[0].name).not.toBe(orderedZones(["Europe/Paris"], "en", WINTER)[0].name);
    });
    it("is empty for no zones", () => {
        expect(orderedZones([], "en", WINTER)).toEqual([]);
    });
});

describe("matchZone", () => {
    const zones = orderedZones(DEFAULT_ZONES, "en", WINTER);
    it("is the zone itself when it is listed", () => {
        expect(matchZone("Asia/Tokyo", zones, "en", WINTER)).toBe("Asia/Tokyo");
    });
    it("is the listed zone with the same offset and name when it is not", () => {
        expect(matchZone("Europe/Berlin", zones, "en", WINTER)).toBe("Europe/Paris");
        expect(matchZone("America/Toronto", zones, "en", WINTER)).toBe("America/New_York");
    });
    it("is undefined when nothing matches or the zone is unknown", () => {
        expect(matchZone("Nowhere/Land", zones, "en", WINTER)).toBeUndefined();
        expect(matchZone(undefined, zones, "en", WINTER)).toBeUndefined();
    });
});

describe("isDaylightTime", () => {
    it("is true only while daylight time is in force", () => {
        expect(isDaylightTime("Europe/Paris", SUMMER)).toBe(true);
        expect(isDaylightTime("Europe/Paris", WINTER)).toBe(false);
        expect(isDaylightTime("Australia/Sydney", WINTER)).toBe(true);
        expect(isDaylightTime("Australia/Sydney", SUMMER)).toBe(false);
    });
    it("is never true for a zone without daylight time, or an unknown one", () => {
        expect(isDaylightTime("Asia/Kolkata", SUMMER)).toBe(false);
        expect(isDaylightTime("UTC", WINTER)).toBe(false);
        expect(isDaylightTime("Nowhere/Land", WINTER)).toBe(false);
    });
});

describe("supplied names", () => {
    const names = { "Europe/Paris": ["Standard Paris", "Daylight Paris"], "Asia/Kolkata": "Kolkata All Year" } as const;
    it("win over Intl, and a pair follows daylight time", () => {
        expect(zoneName("Europe/Paris", "en", WINTER, names)).toBe("Standard Paris");
        expect(zoneName("Europe/Paris", "en", SUMMER, names)).toBe("Daylight Paris");
        expect(zoneName("Asia/Kolkata", "en", SUMMER, names)).toBe("Kolkata All Year");
    });
    it("leave Intl in charge of a zone they do not name", () => {
        expect(zoneName("Asia/Tokyo", "en", WINTER, names)).toBe("Japan Standard Time");
    });
    it("reach the label, the order and the matching", () => {
        expect(zoneInfo("Europe/Paris", "en", SUMMER, undefined, names)!.label).toBe("UTC+02:00 – Daylight Paris");
        const zones = orderedZones(["Asia/Kolkata", "Europe/Paris"], "en", WINTER, undefined, names);
        expect(zones.map((z) => z.name)).toEqual(["Standard Paris", "Kolkata All Year"]);
        expect(matchZone("Europe/Berlin", orderedZones(["Europe/Paris"], "en", WINTER, undefined, { ...names, "Europe/Berlin": ["Standard Paris", "x"] }), "en", WINTER, { ...names, "Europe/Berlin": ["Standard Paris", "x"] })).toBe("Europe/Paris");
    });
});
