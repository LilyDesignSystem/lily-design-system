// The zone logic of the time zone picker: offsets, names and order. Pure and framework-neutral; every name comes
// from `Intl` in the caller's locale, so there is no English table here and no default locale.

/**
 * A representative zone for each common UTC offset and name, as IANA ids: the ids are identifiers, not words. An
 * app that wants other zones passes its own list. Offsets and names are worked out for a date, so a zone that keeps
 * daylight saving time shows the offset and name in force on that date.
 */
export const DEFAULT_ZONES: readonly string[] = [
    "Pacific/Pago_Pago",
    "Pacific/Honolulu",
    "Pacific/Marquesas",
    "America/Anchorage",
    "America/Los_Angeles",
    "America/Phoenix",
    "America/Denver",
    "America/Chicago",
    "America/Mexico_City",
    "America/New_York",
    "America/Bogota",
    "America/Halifax",
    "America/Caracas",
    "America/St_Johns",
    "America/Sao_Paulo",
    "America/Argentina/Buenos_Aires",
    "Atlantic/South_Georgia",
    "Atlantic/Azores",
    "UTC",
    "Europe/London",
    "Europe/Lisbon",
    "Africa/Lagos",
    "Europe/Paris",
    "Europe/Athens",
    "Africa/Cairo",
    "Africa/Johannesburg",
    "Europe/Moscow",
    "Africa/Nairobi",
    "Asia/Riyadh",
    "Asia/Tehran",
    "Asia/Dubai",
    "Asia/Kabul",
    "Asia/Karachi",
    "Asia/Kolkata",
    "Asia/Kathmandu",
    "Asia/Dhaka",
    "Asia/Yangon",
    "Asia/Bangkok",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Australia/Perth",
    "Australia/Eucla",
    "Asia/Tokyo",
    "Asia/Seoul",
    "Australia/Darwin",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Sydney",
    "Australia/Lord_Howe",
    "Pacific/Guadalcanal",
    "Pacific/Auckland",
    "Pacific/Fiji",
    "Pacific/Chatham",
    "Pacific/Tongatapu",
    "Pacific/Kiritimati",
];

/** One zone as the picker shows it. */
export type ZoneInfo = {
    /** The IANA id, which is the picker's value (`Europe/Paris`). */
    id: string;
    /** Minutes east of UTC on the picker's date (`60`, `-330`). */
    offsetMinutes: number;
    /** The offset as text (`UTC+01:00`, `UTC-03:30`, `UTC+00:00`). */
    offset: string;
    /** The zone's full name in the locale (`Central European Standard Time`). */
    name: string;
    /** What the option shows: `UTC+01:00 – Central European Standard Time`. */
    label: string;
};

const offsetFormatters = new Map<string, Intl.DateTimeFormat>();

/** Minutes east of UTC for `zone` at `date`; `undefined` when the runtime does not know the zone. */
export function offsetMinutes(zone: string, date: Date): number | undefined {
    try {
        let f = offsetFormatters.get(zone);
        if (!f) {
            f = new Intl.DateTimeFormat("en-US", {
                timeZone: zone,
                hourCycle: "h23",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            });
            offsetFormatters.set(zone, f);
        }
        const p: Record<string, string> = {};
        for (const part of f.formatToParts(date)) p[part.type] = part.value;
        const wall = Date.UTC(Number(p["year"]), Number(p["month"]) - 1, Number(p["day"]), Number(p["hour"]), Number(p["minute"]), Number(p["second"]));
        const instant = Math.floor(date.getTime() / 1000) * 1000;
        return Math.round((wall - instant) / 60000);
    } catch {
        return undefined;
    }
}

/** `330` → `UTC+05:30`, `-210` → `UTC-03:30`, `0` → `UTC+00:00`. ASCII, so it sorts and parses everywhere. */
export function formatOffset(minutes: number): string {
    const sign = minutes < 0 ? "-" : "+";
    const abs = Math.abs(minutes);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return `UTC${sign}${hh}:${mm}`;
}

/** The zone's full name in `locale` on `date`; `undefined` when `Intl` has none. */
export function zoneName(zone: string, locale: string, date: Date): string | undefined {
    try {
        const parts = new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: "long" }).formatToParts(date);
        return parts.find((p) => p.type === "timeZoneName")?.value;
    } catch {
        return undefined;
    }
}

/** What an option shows by default. */
export const defaultLabel = (zone: Pick<ZoneInfo, "offset" | "name">): string => `${zone.offset} – ${zone.name}`;

/** One zone's info, or `undefined` when the runtime does not know it. */
export function zoneInfo(zone: string, locale: string, date: Date, labelFor: (z: ZoneInfo) => string = defaultLabel): ZoneInfo | undefined {
    const minutes = offsetMinutes(zone, date);
    if (minutes === undefined) return undefined;
    const name = zoneName(zone, locale, date) ?? zone;
    const info: ZoneInfo = { id: zone, offsetMinutes: minutes, offset: formatOffset(minutes), name, label: "" };
    info.label = labelFor(info);
    return info;
}

/**
 * The zones that exist, ordered by offset (west to east), then by name, then by id. A repeated id appears once;
 * an id the runtime does not know is left out rather than shown unnamed.
 */
export function orderedZones(zones: readonly string[], locale: string, date: Date, labelFor?: (z: ZoneInfo) => string): ZoneInfo[] {
    const seen = new Set<string>();
    const out: ZoneInfo[] = [];
    for (const id of zones) {
        if (seen.has(id)) continue;
        seen.add(id);
        const info = zoneInfo(id, locale, date, labelFor);
        if (info) out.push(info);
    }
    const collator = new Intl.Collator(locale);
    return out.sort((a, b) => a.offsetMinutes - b.offsetMinutes || collator.compare(a.name, b.name) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** The zone the browser is in, as an IANA id. `undefined` outside a browser or when it cannot be told. */
export function systemZone(): string | undefined {
    try {
        return new Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
    } catch {
        return undefined;
    }
}

/**
 * Which of `zones` stands for `system`: the zone itself when listed, else the listed zone with the same offset and
 * name (Europe/Berlin → Europe/Paris), else `undefined`.
 */
export function matchZone(system: string | undefined, zones: ZoneInfo[], locale: string, date: Date): string | undefined {
    if (!system) return undefined;
    if (zones.some((z) => z.id === system)) return system;
    const info = zoneInfo(system, locale, date);
    if (!info) return undefined;
    return zones.find((z) => z.offsetMinutes === info.offsetMinutes && z.name === info.name)?.id;
}
