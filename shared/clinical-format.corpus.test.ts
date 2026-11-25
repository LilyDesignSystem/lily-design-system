// A corpus the formatters did not write (tasks.md P47-T9, spec/lessons/openehr-rust item 9): every DV_QUANTITY, DV_COUNT,
// DV_INTERVAL of quantities, DV_DATE, DV_DURATION and DV_PROPORTION in the EHRbase SDK's canonical JSON compositions, fed to
// shared/clinical-format.ts. It reports any value a formatter refuses or writes with a digit lost.
//
// Skipped unless OPENEHR_JSON_CORPUS names the corpus directory. The corpus is read where it is, never copied into this tree
// (it is Apache-2.0 test data of another project):
//
//   git clone --depth 1 https://github.com/ehrbase/openEHR_SDK /some/where
//   OPENEHR_JSON_CORPUS=/some/where/test-data/src/main/resources/composition/canonical_json \
//     npx vitest run clinical-format.corpus.test.ts
//
// FHIR_JSON_CORPUS names a directory of FHIR JSON the same way, for example an implementation guide's package from
// packages.fhir.org, unpacked (quantities, reference ranges, ratios and partial dates).
//
// OPENEHR_JSON_CORPUS_REPORT=/path/report.tsv also writes one row per value: file, JSON path, type, "ok" or the error.
// A recorded run, with the corpus commit, is in spec/lessons/openehr-rust/index.md.

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
    durationParts,
    formatPartialDate,
    formatProportion,
    formatQuantity,
    formatRange,
    htmlDuration,
    partialDatePrecision,
    type ProportionKind,
    type QuantityComparator,
} from "./clinical-format";

const CORPUS = process.env.OPENEHR_JSON_CORPUS;
const FHIR_CORPUS = process.env.FHIR_JSON_CORPUS;
const REPORT = process.env.OPENEHR_JSON_CORPUS_REPORT;

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Node = { [key: string]: Json };
interface Row {
    file: string;
    path: string;
    type: string;
    outcome: string;
}

// openEHR PROPORTION_KIND codes.
const KIND: Record<number, ProportionKind> = {
    0: "ratio",
    1: "unitary",
    2: "percent",
    3: "fraction",
    4: "integer-fraction",
};

function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return files(path);
        return name.endsWith(".json") ? [path] : [];
    });
}

function walk(value: Json, path: string, visit: (node: Node, path: string) => void): void {
    if (Array.isArray(value)) value.forEach((item, i) => walk(item, `${path}[${i}]`, visit));
    else if (value !== null && typeof value === "object") {
        visit(value, path);
        for (const [key, item] of Object.entries(value)) walk(item, `${path}.${key}`, visit);
    }
}

// "=" is openEHR's exact magnitude_status, written with no sign.
function comparator(status: Json | undefined): QuantityComparator | undefined {
    if (status === undefined || status === null || status === "=") return undefined;
    return status as QuantityComparator;
}

// openEHR precision: absent or -1 is "no limit", 0 is a whole number, n is n places.
function precisionOf(node: Node): { precision?: number } {
    const p = node.precision;
    return typeof p === "number" && p >= 0 ? { precision: p } : {};
}

// The formatters under test. A test below plants a wrong one for each type, so a check that stopped checking would show.
const FORMATTERS = {
    durationParts,
    formatPartialDate,
    formatProportion,
    formatQuantity,
    formatRange,
    htmlDuration,
    partialDatePrecision,
};
type Formatters = typeof FORMATTERS;

// The digits written, read back in "en": grouping commas and the comparator and unit removed. A lost digit changes this.
function readBack(written: string): number {
    return Number(
        written
            .replace(/[<>≤≥≈]/u, "")
            .split(/\s/u)[0]
            .replaceAll(",", ""),
    );
}

function lost(written: string, ...expected: boolean[]): string | undefined {
    return expected.every(Boolean) ? undefined : `not read back: ${written}`;
}

function quantity(
    f: Formatters,
    value: number,
    unit: string,
    status: QuantityComparator | undefined,
    options: { precision?: number } = {},
): string | undefined {
    const written = f.formatQuantity(value, unit, "en", status, options);
    const sign = { "<": "<", "<=": "≤", ">=": "≥", ">": ">", "~": "≈" }[status ?? "<"];
    return lost(
        written,
        readBack(written) === value,
        status ? written.startsWith(sign as string) : !/[<>≤≥≈]/u.test(written),
        unit === "" || written.endsWith(`\u00a0${unit}`),
    );
}

function range(f: Formatters, low: number, high: number, unit: string): string | undefined {
    const written = f.formatRange(low, high, unit, "en");
    const numbers = unit ? written.slice(0, -(unit.length + 1)) : written;
    // "en" joins with an en dash; a minus sign is a hyphen, so it is not a joint.
    const ends = numbers.split(/\s*–\s*/u).map(readBack);
    return lost(
        written,
        ends[0] === low,
        ends[ends.length - 1] === high,
        ends.length === (low === high ? 1 : 2),
        unit === "" || written.endsWith(`\u00a0${unit}`),
    );
}

const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(Date.UTC(2020, i, 1)),
);

function date(f: Formatters, value: string): string | undefined {
    const [year, month, day] = value.split("-").map(Number);
    const precision = f.partialDatePrecision(value);
    const written = f.formatPartialDate(value, "en");
    const numbers = (written.match(/\d+/g) ?? []).map(Number);
    const named = MONTHS.flatMap((name, i) => (written.includes(name) ? [i + 1] : []));
    return lost(
        `${precision} ${written}`,
        precision === (day ? "day" : month ? "month" : "year"),
        numbers.includes(year),
        named.length === (month ? 1 : 0) && (!month || named[0] === month),
        // Nothing invented: a day is written only when one was recorded.
        numbers.length === (day ? 2 : 1) && (!day || numbers.includes(day)),
    );
}

const DURATION =
    /^(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:[.,]\d+)?)S)?)?$/;

function duration(f: Formatters, value: string): string | undefined {
    const expected = DURATION.exec(value);
    if (!expected) return `not an ISO 8601 duration: ${value}`;
    const number = (text: string | undefined) => Number((text ?? "0").replace(",", "."));
    const parts = f.durationParts(value);
    const html = f.htmlDuration(value);
    // HTML <time datetime> has no years, months or weeks, so those durations have no HTML form, by design.
    const calendar = /[YMW]/.test(value.split("T")[0]);
    return lost(
        `${JSON.stringify(parts)} ${JSON.stringify(html)}`,
        parts.negative === (expected[1] === "-"),
        parts.years === number(expected[2]),
        parts.months === number(expected[3]),
        parts.weeks === number(expected[4]),
        parts.days === number(expected[5]),
        parts.hours === number(expected[6]),
        parts.minutes === number(expected[7]),
        parts.seconds === number(expected[8]),
        calendar
            ? html === null
            : html?.datetime === value.replace("-", "").replace(",", ".") &&
                  html.negative === (expected[1] === "-"),
    );
}

function proportion(
    f: Formatters,
    numerator: number,
    denominator: number,
    kind: ProportionKind,
): string | undefined {
    const written = f.formatProportion(numerator, denominator, kind, "en");
    const n = (text: string) => Number(text.replaceAll(",", ""));
    switch (kind) {
        case "ratio":
        case "fraction": {
            const [top, bottom] = written.split(kind === "ratio" ? ":" : "/").map(n);
            return lost(written, top === numerator, bottom === denominator);
        }
        case "unitary":
            return lost(written, n(written) === numerator);
        case "percent":
            return lost(written, written.endsWith("%"), n(written.slice(0, -1)) === numerator);
        case "integer-fraction": {
            const [, sign, whole, top, bottom] =
                /^(-?)(?:([\d,]+)(?:\u00a0|$))?(?:([\d,]+)\/([\d,]+))?$/u.exec(written) ?? [];
            const value = n(whole ?? "0") + (top ? n(top) / n(bottom) : 0);
            return lost(
                written,
                sign !== undefined,
                Math.abs((sign ? -value : value) - numerator / denominator) < 1e-12,
                bottom === undefined || n(bottom) === denominator,
            );
        }
    }
}

function checkOpenEhr(node: Node, f: Formatters = FORMATTERS): string | undefined {
    switch (node._type) {
        case "DV_QUANTITY":
            return quantity(
                f,
                node.magnitude as number,
                String(node.units ?? ""),
                comparator(node.magnitude_status),
                precisionOf(node),
            );
        case "DV_COUNT":
            return quantity(f, node.magnitude as number, "", comparator(node.magnitude_status));
        case "DV_INTERVAL": {
            const lower = node.lower as Node | undefined;
            const upper = node.upper as Node | undefined;
            if (lower?._type !== "DV_QUANTITY" || upper?._type !== "DV_QUANTITY") return "skip";
            return range(
                f,
                lower.magnitude as number,
                upper.magnitude as number,
                String(upper.units ?? ""),
            );
        }
        case "DV_DATE": {
            const value = String(node.value);
            // openEHR requires ISO 8601's extended format (2019-01-14); the corpus has three basic-format dates
            // (20190114). A refusal of one is correct, and accepting it would be the defect.
            if (/^\d{8}$/.test(value)) {
                try {
                    f.partialDatePrecision(value);
                } catch {
                    return undefined;
                }
                return "basic-format date accepted";
            }
            return date(f, value);
        }
        case "DV_DURATION":
            return duration(f, String(node.value));
        case "DV_PROPORTION": {
            const kind = KIND[node.type as number];
            if (!kind) return "unknown proportion type";
            return proportion(f, node.numerator as number, node.denominator as number, kind);
        }
        default:
            return "skip";
    }
}

// FHIR's data types carry no type name in JSON, so a node is known by its shape and the key that holds it.
function checkFhir(
    node: Node,
    key: string,
    f: Formatters = FORMATTERS,
): [string, string | undefined][] {
    const amount = (value: Json | undefined) =>
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        typeof value.value === "number"
            ? { value: value.value, unit: String(value.unit ?? value.code ?? "") }
            : undefined;
    const found: [string, string | undefined][] = [];
    if (/(Quantity|Age|Duration)$/.test(key) && amount(node))
        found.push([
            "Quantity",
            quantity(f, node.value as number, amount(node)!.unit, comparator(node.comparator)),
        ]);
    const low = amount(node.low);
    const high = amount(node.high);
    if (low && high) found.push(["Range", range(f, low.value, high.value, high.unit)]);
    for (const [bound, name] of [
        [low, "low"],
        [high, "high"],
    ] as const)
        if (bound) found.push([`Range ${name}`, quantity(f, bound.value, bound.unit, undefined)]);
    const numerator = amount(node.numerator);
    const denominator = amount(node.denominator);
    if (numerator && denominator)
        found.push(["Ratio", proportion(f, numerator.value, denominator.value, "ratio")]);
    for (const [name, value] of Object.entries(node))
        if (
            typeof value === "string" &&
            /(Date|DateTime|date|issued|start|end)$/.test(name) &&
            /^\d{4}(-\d{2}(-\d{2})?)?$/.test(value)
        )
            found.push(["date", date(f, value)]);
    return found;
}

describe("the corpus checks", () => {
    const good: Node[] = [
        { _type: "DV_QUANTITY", magnitude: 1234.5, units: "mg", precision: 1 },
        { _type: "DV_QUANTITY", magnitude: 5, units: "mg", magnitude_status: "<=" },
        { _type: "DV_COUNT", magnitude: 12 },
        {
            _type: "DV_INTERVAL",
            lower: { _type: "DV_QUANTITY", magnitude: -3.5 },
            upper: { _type: "DV_QUANTITY", magnitude: 5.3, units: "mmol/L" },
        },
        { _type: "DV_DATE", value: "2019" },
        { _type: "DV_DATE", value: "2019-03" },
        { _type: "DV_DATE", value: "2019-03-14" },
        { _type: "DV_DURATION", value: "-P1DT2H3M4,5S" },
        { _type: "DV_DURATION", value: "P1Y2M3W" },
        { _type: "DV_PROPORTION", numerator: 1, denominator: 128, type: 0 },
        { _type: "DV_PROPORTION", numerator: 0.25, denominator: 1, type: 1 },
        { _type: "DV_PROPORTION", numerator: 1.1, denominator: 100, type: 2 },
        { _type: "DV_PROPORTION", numerator: 3, denominator: 4, type: 3 },
        { _type: "DV_PROPORTION", numerator: -7, denominator: 4, type: 4 },
        { _type: "DV_PROPORTION", numerator: 8, denominator: 4, type: 4 },
    ];

    it("accept what the formatters write", () => {
        expect(good.map((node) => [node, checkOpenEhr(node)]).filter(([, r]) => r)).toEqual([]);
    });

    const tens = (text: string) => text.replace(/\d/u, (d) => String((Number(d) + 1) % 10));
    it.each<[string, Partial<Formatters>]>([
        ["DV_QUANTITY", { formatQuantity: (...a) => tens(formatQuantity(...a)) }],
        ["DV_QUANTITY", { formatQuantity: (v, u, l) => formatQuantity(v, u, l, "<") }],
        ["DV_QUANTITY", { formatQuantity: (v, _u, l, c, o) => formatQuantity(v, "g", l, c, o) }],
        ["DV_COUNT", { formatQuantity: (...a) => tens(formatQuantity(...a)) }],
        ["DV_INTERVAL", { formatRange: (...a) => tens(formatRange(...a)) }],
        ["DV_INTERVAL", { formatRange: (low, _high, u, l) => formatRange(low, low, u, l) }],
        [
            "DV_DATE",
            {
                formatPartialDate: (iso, ...a) =>
                    formatPartialDate(`${iso.slice(0, 4)}-01-01`, ...a),
            },
        ],
        ["DV_DATE", { partialDatePrecision: () => "day" }],
        ["DV_DURATION", { durationParts: (iso) => ({ ...durationParts(iso), days: 9 }) }],
        ["DV_DURATION", { durationParts: (iso) => ({ ...durationParts(iso), negative: false }) }],
        ["DV_DURATION", { htmlDuration: () => ({ datetime: "PT0S", negative: false }) }],
        ["DV_PROPORTION", { formatProportion: (...a) => tens(formatProportion(...a)) }],
    ])("catch a wrong formatter for %s (%#)", (type, wrong) => {
        const nodes = good.filter((node) => node._type === type);
        expect(nodes.some((node) => checkOpenEhr(node, { ...FORMATTERS, ...wrong }))).toBe(true);
    });

    it("catch a wrong formatter for FHIR's types", () => {
        const node: Node = {
            low: { value: 3.5, unit: "g" },
            high: { value: 5.3, unit: "g" },
            birthDate: "1980-02",
            numerator: { value: 1 },
            denominator: { value: 8 },
        };
        expect(checkFhir(node, "referenceRange").filter(([, r]) => r)).toEqual([]);
        expect(checkFhir({ value: 5, unit: "mg" }, "valueQuantity")).toEqual([
            ["Quantity", undefined],
        ]);
        const wrong = {
            ...FORMATTERS,
            formatQuantity: (...a: Parameters<typeof formatQuantity>) => tens(formatQuantity(...a)),
            formatRange: (...a: Parameters<typeof formatRange>) => tens(formatRange(...a)),
            formatProportion: (...a: Parameters<typeof formatProportion>) =>
                tens(formatProportion(...a)),
            formatPartialDate: (iso: string) => formatPartialDate(`${iso.slice(0, 4)}-12-25`, "en"),
        };
        expect(checkFhir(node, "referenceRange", wrong).every(([, r]) => r)).toBe(true);
        expect(checkFhir({ value: 5, unit: "mg" }, "valueQuantity", wrong)[0][1]).toBeTruthy();
    });
});

function run(
    corpus: string,
    check: (node: Node, key: string) => [string, string | undefined][],
): void {
    const rows: Row[] = [];
    for (const file of files(corpus)) {
        let json: Json;
        try {
            json = JSON.parse(readFileSync(file, "utf8")) as Json;
        } catch {
            continue; // not JSON: not this run's subject
        }
        walk(json, "$", (node, path) => {
            const key = /\.(\w+)(?:\[\d+\])?$/.exec(path)?.[1] ?? "";
            let found: [string, string | undefined][];
            try {
                found = check(node, key);
            } catch (error) {
                found = [[String(node._type ?? key), `refused: ${(error as Error).message}`]];
            }
            for (const [type, outcome] of found)
                if (outcome !== "skip")
                    rows.push({
                        file: relative(corpus, file),
                        path,
                        type,
                        outcome: outcome ?? "ok",
                    });
        });
    }
    if (REPORT)
        writeFileSync(
            REPORT,
            rows.map((r) => [r.file, r.path, r.type, r.outcome].join("\t")).join("\n") + "\n",
        );
    const counts = new Map<string, number>();
    for (const r of rows) counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    console.log(Object.fromEntries(counts));
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.filter((r) => r.outcome !== "ok")).toEqual([]);
}

describe.skipIf(!CORPUS)("clinical-format against openEHR canonical JSON", () => {
    it("formats every value the corpus holds without a refusal or a lost digit", () => {
        run(CORPUS as string, (node) =>
            typeof node._type === "string" && node._type.startsWith("DV_")
                ? [[node._type, checkOpenEhr(node)]]
                : [],
        );
    });
});

describe.skipIf(!FHIR_CORPUS)("clinical-format against FHIR JSON", () => {
    it("formats every value the corpus holds without a refusal or a lost digit", () => {
        run(FHIR_CORPUS as string, checkFhir);
    });
});
