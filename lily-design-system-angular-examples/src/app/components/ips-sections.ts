/**
 * International Patient Summary section registry (spec/healthcare-ui, international-patient-summary). Pure and framework-neutral:
 * no DOM, no FHIR parsing, no words.
 *
 * The sixteen sections of the HL7 FHIR IPS Composition (IPS 2.0.1), each with its LOINC code and its level in the IG. Three are
 * required: Medication Summary, Allergies and Intolerances, Problem List. A document that leaves one out has still said
 * something (nothing about it), so the component shows the gap rather than hiding it: ipsContents() appends an "omitted" entry
 * for each required section the consumer's list lacks, in registry order.
 *
 * The section keys are Lily's names, stable across catalogs. Headings, status words and every other word are the consumer's.
 */

export type IpsSectionStatus = "known" | "none-known" | "not-recorded" | "unavailable" | "omitted";

export type IpsSectionLevel = "required" | "recommended" | "optional";

export interface IpsSectionDefinition {
    key: string;
    /** The section's LOINC code in the IPS Composition. */
    code: string;
    level: IpsSectionLevel;
}

/** One section the consumer renders, as plain data: the root builds its contents navigation from these. */
export interface IpsSectionEntry {
    key: string;
    heading: string;
    status?: IpsSectionStatus;
    /** The section's element id; default ipsSectionId(key). */
    id?: string;
}

export interface IpsContentsEntry {
    key: string;
    heading: string;
    status: IpsSectionStatus;
    id: string;
    code: string | undefined;
    required: boolean;
    /** True when the root added it because the consumer's list lacked a required section. */
    added: boolean;
}

/** The IPS 2.0.1 Composition sections, in the IG's order. */
export const IPS_SECTIONS: readonly IpsSectionDefinition[] = Object.freeze([
    { key: "medications", code: "10160-0", level: "required" },
    { key: "allergies", code: "48765-2", level: "required" },
    { key: "problems", code: "11450-4", level: "required" },
    { key: "immunizations", code: "11369-6", level: "recommended" },
    { key: "results", code: "30954-2", level: "recommended" },
    { key: "procedures", code: "47519-4", level: "recommended" },
    { key: "devices", code: "46264-8", level: "recommended" },
    { key: "vital-signs", code: "8716-3", level: "optional" },
    { key: "past-illness", code: "11348-0", level: "optional" },
    { key: "functional-status", code: "47420-5", level: "optional" },
    { key: "plan-of-care", code: "18776-5", level: "optional" },
    { key: "social-history", code: "29762-2", level: "optional" },
    { key: "pregnancy", code: "10162-6", level: "optional" },
    { key: "advance-directives", code: "42348-3", level: "optional" },
    { key: "alerts", code: "104605-1", level: "optional" },
    { key: "patient-story", code: "81338-6", level: "optional" },
] as IpsSectionDefinition[]);

/** The keys of the three required sections, in registry order. */
export const IPS_REQUIRED_SECTIONS: readonly string[] = Object.freeze(
    IPS_SECTIONS.filter((s) => s.level === "required").map((s) => s.key),
);

/** A section's LOINC code, or undefined for a key that is not an IPS section. */
export function ipsSectionCode(key: string): string | undefined {
    return IPS_SECTIONS.find((s) => s.key === key)?.code;
}

/** A section's level in the IPS ("required", "recommended" or "optional"), or undefined for a key that is not an IPS section. */
export function ipsSectionLevel(key: string): IpsSectionLevel | undefined {
    return IPS_SECTIONS.find((s) => s.key === key)?.level;
}

export function ipsSectionIsRequired(key: string): boolean {
    return IPS_REQUIRED_SECTIONS.includes(key);
}

/** The default id prefix; give each summary on a page its own, so their section ids differ. */
export const IPS_ID_PREFIX = "international-patient-summary";

/** The element id a section uses, so a contents link and its section agree without the consumer wiring them. */
export function ipsSectionId(key: string, id?: string, idPrefix: string = IPS_ID_PREFIX): string {
    return id || `${idPrefix || IPS_ID_PREFIX}-${key}`;
}

/** The required section keys the consumer's list lacks, in registry order. */
export function ipsMissingRequired(sections: readonly Pick<IpsSectionEntry, "key">[]): string[] {
    const present = new Set(sections.map((s) => s.key));
    return IPS_REQUIRED_SECTIONS.filter((key) => !present.has(key));
}

/**
 * The contents, in the consumer's order, followed by an "omitted" entry for each missing required section. A missing
 * required section is headed by requiredHeadings[key], the consumer's words. Ids use idPrefix, so two summaries on one page
 * can have different ones.
 */
export function ipsContents(
    sections: readonly IpsSectionEntry[],
    requiredHeadings: Readonly<Record<string, string>>,
    idPrefix: string = IPS_ID_PREFIX,
): IpsContentsEntry[] {
    const given = sections.map((s) => ({
        key: s.key,
        heading: s.heading,
        status: s.status ?? "known",
        id: ipsSectionId(s.key, s.id, idPrefix),
        code: ipsSectionCode(s.key),
        required: ipsSectionIsRequired(s.key),
        added: false,
    }));
    const added = ipsMissingRequired(sections).map((key) => ({
        key,
        heading: requiredHeadings[key] ?? "",
        status: "omitted" as const,
        id: ipsSectionId(key, undefined, idPrefix),
        code: ipsSectionCode(key),
        required: true,
        added: true,
    }));
    return [...given, ...added];
}
