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

// The digits written, read back in "en": grouping commas and the comparator and unit removed. A lost digit changes this.
function readBack(written: string): number {
    return Number(
        written
            .replace(/[<>≤≥≈]/u, "")
            .split(/\s/u)[0]
            .replaceAll(",", ""),
    );
}

function check(node: Node): string | undefined {
    switch (node._type) {
        case "DV_QUANTITY": {
            const magnitude = node.magnitude as number;
            const written = formatQuantity(
                magnitude,
                String(node.units ?? ""),
                "en",
                comparator(node.magnitude_status),
                precisionOf(node),
            );
            return readBack(written) === magnitude ? undefined : `digit lost: ${written}`;
        }
        case "DV_COUNT": {
            const magnitude = node.magnitude as number;
            const written = formatQuantity(magnitude, "", "en", comparator(node.magnitude_status));
            return readBack(written) === magnitude ? undefined : `digit lost: ${written}`;
        }
        case "DV_INTERVAL": {
            const lower = node.lower as Node | undefined;
            const upper = node.upper as Node | undefined;
            if (lower?._type !== "DV_QUANTITY" || upper?._type !== "DV_QUANTITY") return "skip";
            formatRange(
                lower.magnitude as number,
                upper.magnitude as number,
                String(upper.units ?? ""),
                "en",
            );
            return undefined;
        }
        case "DV_DATE": {
            const value = String(node.value);
            // openEHR requires ISO 8601's extended format (2019-01-14); the corpus has three basic-format dates
            // (20190114). A refusal of one is correct, and accepting it would be the defect.
            if (/^\d{8}$/.test(value)) {
                try {
                    partialDatePrecision(value);
                } catch {
                    return undefined;
                }
                return "basic-format date accepted";
            }
            partialDatePrecision(value);
            formatPartialDate(value, "en");
            return undefined;
        }
        case "DV_DURATION": {
            const value = String(node.value);
            durationParts(value);
            // HTML <time datetime> has no years, months or weeks, so those durations have no HTML form, by design.
            const calendar = /[YMW]/.test(value.split("T")[0]);
            const html = htmlDuration(value);
            if (calendar) return html ? "HTML duration with years, months or weeks" : undefined;
            return html ? undefined : "no HTML duration";
        }
        case "DV_PROPORTION": {
            const kind = KIND[node.type as number];
            if (!kind) return "unknown proportion type";
            formatProportion(node.numerator as number, node.denominator as number, kind, "en");
            return undefined;
        }
        default:
            return "skip";
    }
}

describe.skipIf(!CORPUS)("clinical-format against the EHRbase SDK canonical JSON", () => {
    it("formats every value the corpus holds without a refusal or a lost digit", () => {
        const rows: Row[] = [];
        for (const file of files(CORPUS as string)) {
            let json: Json;
            try {
                json = JSON.parse(readFileSync(file, "utf8")) as Json;
            } catch {
                continue; // not JSON: not this run's subject
            }
            walk(json, "$", (node, path) => {
                if (typeof node._type !== "string" || !node._type.startsWith("DV_")) return;
                let outcome: string;
                try {
                    outcome = check(node) ?? "ok";
                } catch (error) {
                    outcome = `refused: ${(error as Error).message}`;
                }
                if (outcome !== "skip")
                    rows.push({
                        file: relative(CORPUS as string, file),
                        path,
                        type: node._type,
                        outcome,
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
        const failures = rows.filter((r) => r.outcome !== "ok");
        expect(rows.length).toBeGreaterThan(0);
        expect(failures).toEqual([]);
    });
});
